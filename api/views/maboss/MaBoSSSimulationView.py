from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import JSONParser

from django.core.files import File
from django.core.files.base import ContentFile
from django.http import Http404, HttpResponse, FileResponse

from django.conf import settings
from django.db import transaction
from api.views.HasModel import HasModel
from api.views.HasMaBoSSSimulation import HasMaBoSSSimulation
from api.serializers import MaBoSSSimulationSerializer
from api.models import LogicalModel, MaBoSSSimulation, Project

from threading import Thread
from os.path import join, exists, splitext, basename
from os import remove
from json import loads, dumps
import ginsim
import maboss


class MaBoSSSimulationView(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)
		simulations = MaBoSSSimulation.objects.filter(model=self.model)
		serializer = MaBoSSSimulationSerializer(simulations, many=True)
		return Response(serializer.data)

	def post(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		if self.model.format == LogicalModel.ZGINML:
			path = join(settings.MEDIA_ROOT, self.model.file.path)
			ginsim_model = ginsim.load(path)
			maboss_model = ginsim.to_maboss(ginsim_model)

			tmp_bnd_path = join(settings.TMP_ROOT, splitext(basename(self.model.file.path))[0] + ".bnd")
			bnd_file = open(tmp_bnd_path, 'w')
			maboss_model.print_bnd(out=bnd_file)
			bnd_file.close()

			tmp_cfg_path = join(settings.TMP_ROOT, splitext(basename(self.model.file.path))[0] + ".cfg")
			cfg_file = open(tmp_cfg_path, 'w')
			maboss_model.print_cfg(out=cfg_file)
			cfg_file.close()

			maboss_simulation = MaBoSSSimulation(
				project=self.project,
				model=self.model,
				name=request.POST['name'],
				bnd_file=File(open(tmp_bnd_path, 'rb')),
				cfg_file=File(open(tmp_cfg_path, 'rb')),
				status=MaBoSSSimulation.BUSY
			)
			maboss_simulation.save()

			remove(tmp_bnd_path)
			remove(tmp_cfg_path)

		elif self.model.format == LogicalModel.MABOSS:

			bnd_path = join(settings.MEDIA_ROOT, self.model.bnd_file.path)
			cfg_path = join(settings.MEDIA_ROOT, self.model.cfg_file.path)

			maboss_simulation = MaBoSSSimulation(
				project=self.project,
				model=self.model,
				name=request.POST['name'],
				bnd_file=File(open(bnd_path, 'rb')),
				cfg_file=File(open(cfg_path, 'rb')),
				status=MaBoSSSimulation.BUSY
			)
			maboss_simulation.save()

			maboss_model = maboss.load(bnd_path, cfg_path)
		else:
			return HttpResponse(status=500)

		cfg_settings = loads(request.POST['settings'])
		maboss_model.param.update(cfg_settings)

		mutations = loads(request.POST['mutations'])
		for var, mutation in mutations.items():
			maboss_model.mutate(var, mutation)

		maboss_model.network.set_output(
			[key for key, value in loads(request.POST['outputVariables']).items() if value]
		)

		for var, istate in loads(request.POST['initialStates']).items():
			maboss_model.network.set_istate(var, [1.0-float(istate), float(istate)])

		maboss_simulation.update_model(maboss_model)

		thread = Thread(target=run_simulation, args=(maboss_model, maboss_simulation.id))
		thread.start()

		return Response({'simulation_id': maboss_simulation.id}, status=status.HTTP_200_OK)



def run_simulation(maboss_model, maboss_simulation_id):

	try:
		res = maboss_model.run()

		fixed_points = res.get_fptable()
		if fixed_points is not None:
			fixed_points_json = fixed_points.to_json()
		else:
			fixed_points_json = "{}"

		states_probtraj = res.get_states_probtraj()
		states_probtraj_json = states_probtraj.to_json()

		nodes_probtraj = res.get_nodes_probtraj()
		nodes_probtraj_json = nodes_probtraj.to_json()

		with transaction.atomic():
			maboss_simulation = MaBoSSSimulation.objects.get(id=maboss_simulation_id)
			maboss_simulation.fixpoints = fixed_points_json
			maboss_simulation.states_probtraj = states_probtraj_json
			maboss_simulation.nodes_probtraj = nodes_probtraj_json

			maboss_simulation.status = MaBoSSSimulation.ENDED
			maboss_simulation.save()

	except:
		with transaction.atomic():
			maboss_simulation = MaBoSSSimulation.objects.get(id=maboss_simulation_id)
			maboss_simulation.status = MaBoSSSimulation.ERROR
			maboss_simulation.error = "Simulation failed"
			maboss_simulation.save()


class MaBoSSSimulationRemove(HasMaBoSSSimulation):

	def delete(self, request, project_id, simulation_id):

		HasMaBoSSSimulation.load(self, request, project_id, simulation_id)

		self.simulation.delete()
		return Response(status=status.HTTP_200_OK)


class MaBossSettings(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		maboss_model = self.getMaBoSSModel()

		output_variables = {var: not value.is_internal for var, value in maboss_model.network.items()}
		initial_states = maboss_model.network.get_istate()
		mutations = maboss_model.get_mutations()
		settings = {key: value for key, value in maboss_model.param.items() if not key.startswith("$")}

		if settings['use_physrandgen'] in [0, 1]:
			settings.update({'use_physrandgen': bool(settings['use_physrandgen'])})

		if settings['discrete_time'] in [0, 1]:
			settings.update({'discrete_time': bool(settings['discrete_time'])})

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
			'initial_states': fixed_initial_states,
			'mutations': mutations,
			'settings': settings
		})


class MaBoSSSimulationBNDFile(HasMaBoSSSimulation):

	def get(self, request, project_id, simulation_id):
		HasMaBoSSSimulation.load(self, request, project_id, simulation_id)

		bnd_filename = self.getBNDFilePath()

		if bnd_filename is None:
			return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

		return FileResponse(
			open(bnd_filename, 'rb'),
			as_attachment=True, filename=basename(bnd_filename)
		)


class MaBoSSSimulationCFGFile(HasMaBoSSSimulation):

	def get(self, request, project_id, simulation_id):
		HasMaBoSSSimulation.load(self, request, project_id, simulation_id)

		cfg_filename = self.getCFGFilePath()

		if cfg_filename is None:
			return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

		return FileResponse(
			open(cfg_filename, 'rb'),
			as_attachment=True, filename=basename(cfg_filename)
		)


class MaBoSSSimulationNewModel(HasMaBoSSSimulation):

	def get(self, request, project_id, simulation_id):
		HasMaBoSSSimulation.load(self, request, project_id, simulation_id)

		try:
			new_model = LogicalModel(
				project=self.project,
				name=self.simulation.name + " model",
				bnd_file=File(open(self.getBNDFilePath(), 'rb')),
				cfg_file=File(open(self.getCFGFilePath(), 'rb')),
				format=LogicalModel.MABOSS
			)
			new_model.save()

			return Response(status=status.HTTP_200_OK)

		except:
			return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
