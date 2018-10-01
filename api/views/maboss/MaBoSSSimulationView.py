from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import JSONParser

from django.core.files import File
from django.http import Http404
from django.conf import settings
from django.db import transaction

from api.serializers import MaBoSSSimulationSerializer
from api.models import LogicalModel, MaBoSSSimulation, Project

from threading import Thread
from os.path import join
from json import loads, dumps
import ginsim
import maboss


class MaBoSSSimulationView(APIView):

	def get(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)
			simulations = MaBoSSSimulation.objects.filter(model=model)
			serializer = MaBoSSSimulationSerializer(simulations, many=True)
			return Response(serializer.data)

		except LogicalModel.DoesNotExist:
			raise Http404

		except Project.DoesNotExist:
			raise Http404



	def post(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)
			path = join(settings.MEDIA_ROOT, model.file.path)
			maboss_simulation = MaBoSSSimulation(
				project=project,
				model=model,
				model_file=File(path)
			)
			maboss_simulation.save()

			ginsim_model = ginsim.load(path)
			maboss_model = ginsim.to_maboss(ginsim_model)

			maboss_model.update_parameters(
				sample_count=int(request.POST['sampleCount']),
				max_time=float(request.POST['maxTime']),
				time_tick=float(request.POST['timeTick'])
			)

			maboss_model.network.set_output(
				[key for key, value in loads(request.POST['outputVariables']).items() if value]
			)

			for var, istate in loads(request.POST['initialStates']).items():
				maboss_model.network.set_istate(var, [1.0-float(istate), float(istate)])

			thread = Thread(target=run_simulation, args=(maboss_model, maboss_simulation.id))
			thread.start()

			return Response({'simulation_id': maboss_simulation.id}, status=status.HTTP_200_OK)


		except LogicalModel.DoesNotExist:
			raise Http404

		except Project.DoesNotExist:
			raise Http404


def run_simulation(maboss_model, maboss_simulation_id):

	try:
		maboss_simulation = MaBoSSSimulation.objects.get(id=maboss_simulation_id)

		with transaction.atomic():
			maboss_simulation.status = MaBoSSSimulation.BUSY
			maboss_simulation.save()

		res = maboss_model.run()

		fixed_points = res.get_fptable()
		fixed_points_json = fixed_points.to_json()

		with transaction.atomic():
			maboss_simulation.fixpoints = fixed_points_json
			maboss_simulation.status = MaBoSSSimulation.ENDED
			maboss_simulation.save()

		states_probtraj = res.get_states_probtraj()
		states_probtraj_json = states_probtraj.to_json()

		with transaction.atomic():
			maboss_simulation.states_probtraj = states_probtraj_json
			maboss_simulation.save()

		nodes_probtraj = res.get_nodes_probtraj()
		nodes_probtraj_json = nodes_probtraj.to_json()

		with transaction.atomic():
			maboss_simulation.nodes_probtraj = nodes_probtraj_json
			maboss_simulation.save()


	except:
		with transaction.atomic():
			maboss_simulation.status = MaBoSSSimulation.ERROR
			maboss_simulation.error = "Simulation failed"


class MaBoSSSimulationRemove(APIView):

	def delete(self, request, simulation_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			simulation = MaBoSSSimulation.objects.get(id=simulation_id)

			if simulation.project.user != request.user:
				raise PermissionDenied

			simulation.delete()

			return Response(status=status.HTTP_200_OK)

		except LogicalModel.DoesNotExist:
			raise Http404

		except Project.DoesNotExist:
			raise Http404

class MaBossSettings(APIView):

	def get(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)
			if request.user != project.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)
			path = join(settings.MEDIA_ROOT, model.file.path)
			ginsim_model = ginsim.load(path)
			maboss_model = ginsim.to_maboss(ginsim_model)

			output_variables = {var: not value.is_internal for var, value in maboss_model.network.items()}
			initial_states = maboss_model.network.get_istate()

			# Here the problem is the variables with more than two states, who appear in the initial states as :
			# (Var_1, Var_2, Var_3) : {(0, 0, 0): 1, (1, 0, 0): 0, (1, 1, 0): 0, (1, 1, 1): 0}
			# The nice thing is that it shows the constraint that the state (0, 1, 1) is impossible. But I'm not sure
			# how to show this constraint on the interface (Probably merging them as a single multi state variable,
			# which they are. But for now, we just treat them as individual variables, ie. without the constraint.

			fixed_initial_states = {}
			for var, value in initial_states.items():
				if isinstance(var, tuple):

					t_values = {}
					for i, subvar in enumerate(var):
						t_values.update({subvar: {0: 0, 1: 0}})

					for tuple_states, tuple_value in value.items():
						for i_tuple, t_tuple in enumerate(tuple_states):
							subvar = var[i_tuple]
							t_value = t_values[subvar]
							tt_value = t_value[t_tuple] + tuple_value
							t_value.update({t_tuple: tt_value})
							t_values.update({subvar: t_value})

					fixed_initial_states.update(t_values)

				else:
					fixed_initial_states.update({var: value})

			return Response({
				'output_variables': output_variables,
				'initial_states': fixed_initial_states
			})

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404