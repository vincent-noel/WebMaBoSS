from rest_framework.response import Response
from rest_framework import status

from django.core.files import File
from django.conf import settings
from django.db import transaction
from api.views.HasModel import HasModel
from api.views.HasMaBoSSSensitivity import HasMaBoSSSensitivity
from api.models import LogicalModel, MaBoSSSimulation, MaBoSSSensitivitySimulation, MaBoSSSensitivityAnalysis
from api.serializers import MaBoSSSensitivityAnalysisSerializer
from threading import Thread
from os.path import join, exists, splitext, basename
from os import remove
from json import loads, dumps

class MaBoSSSensitivityAnalysisView(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		simulations = MaBoSSSensitivityAnalysis.objects.filter(model=self.model)
		serializer = MaBoSSSensitivityAnalysisSerializer(simulations, many=True)
		return Response(serializer.data)

	def post(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		maboss_model = self.getMaBoSSModel()

		analysis_settings = loads(request.POST['settings'])

		if self.model.format == LogicalModel.ZGINML:

			bnd_path = join(settings.TMP_ROOT, splitext(basename(self.model.file.path))[0] + ".bnd")
			bnd_file = open(bnd_path, 'w')
			maboss_model.print_bnd(out=bnd_file)
			bnd_file.close()

			cfg_path = join(settings.TMP_ROOT, splitext(basename(self.model.file.path))[0] + ".cfg")
			cfg_file = open(cfg_path, 'w')
			maboss_model.print_cfg(out=cfg_file)
			cfg_file.close()

			sensitivity_analysis = MaBoSSSensitivityAnalysis(
				project=self.project,
				model=self.model,
				name=analysis_settings['name'],
				bnd_file=File(open(bnd_path, 'rb')),
				cfg_file=File(open(cfg_path, 'rb'))
			)
			sensitivity_analysis.save()

			remove(bnd_path)
			remove(cfg_path)

		elif self.model.format == LogicalModel.MABOSS:

			sensitivity_analysis = MaBoSSSensitivityAnalysis(
				project=self.project,
				model=self.model,
				name=analysis_settings['name'],
				bnd_file=File(open(join(settings.MEDIA_ROOT, self.model.bnd_file.path), 'rb')),
				cfg_file=File(open(join(settings.MEDIA_ROOT, self.model.cfg_file.path), 'rb'))
			)
			sensitivity_analysis.save()

		else:
			return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

		thread = Thread(target=run_analysis, args=(maboss_model, sensitivity_analysis, analysis_settings))
		thread.start()

		return Response({'analysis_id': sensitivity_analysis.id}, status=status.HTTP_200_OK)

class MaBoSSSensitivityAnalysisRemove(HasMaBoSSSensitivity):

	def delete(self, request, project_id, analysis_id):

		HasMaBoSSSensitivity.load(self, request, project_id, analysis_id)

		self.analysis.delete()
		return Response(status=status.HTTP_200_OK)

def run_analysis(maboss_model, sensitivity_analysis, analysis_settings):

	if analysis_settings['singleMutations']['on']:

		for species in maboss_model.network.keys():
			maboss_simulation = MaBoSSSensitivitySimulation(
				sensitivity_analysis=sensitivity_analysis,
				name=("%s++" % species),
			)
			maboss_simulation.save()

			t_model = maboss_model.copy()
			t_model.mutate(species, 'ON')

			thread = Thread(target=run_simulation, args=(t_model, maboss_simulation.id))
			thread.start()

	if analysis_settings['singleMutations']['off']:

		for species in maboss_model.network.keys():
			maboss_simulation = MaBoSSSensitivitySimulation(
				sensitivity_analysis=sensitivity_analysis,
				name=("%s--" % species),
			)
			maboss_simulation.save()

			t_model = maboss_model.copy()
			t_model.mutate(species, 'OFF')

			thread = Thread(target=run_simulation, args=(t_model, maboss_simulation.id))
			thread.start()

def run_simulation(maboss_model, maboss_simulation_id):

	try:
		maboss_simulation = MaBoSSSensitivitySimulation.objects.get(id=maboss_simulation_id)

		with transaction.atomic():
			maboss_simulation.status = MaBoSSSimulation.BUSY
			maboss_simulation.save()
		res = maboss_model.run()

		fixed_points = res.get_fptable()
		if fixed_points is not None:
			fixed_points_json = fixed_points.to_json()

			with transaction.atomic():
				maboss_simulation.fixpoints = fixed_points_json
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

		with transaction.atomic():
			maboss_simulation.status = MaBoSSSimulation.ENDED
			maboss_simulation.save()

	except:
		with transaction.atomic():
			maboss_simulation.status = MaBoSSSimulation.ERROR
			maboss_simulation.error = "Simulation failed"

class MaBoSSSensitivitySteadyStatesView(HasMaBoSSSensitivity):

	def get(self, request, project_id, analysis_id):

		HasMaBoSSSensitivity.load(self, request, project_id, analysis_id)

		results = {}
		finished = []
		simulations = MaBoSSSensitivitySimulation.objects.filter(sensitivity_analysis=self.analysis)

		for simulation in simulations:
			finished.append(simulation.status == MaBoSSSensitivitySimulation.ENDED)

		if all(finished):

			results.update({'status': MaBoSSSensitivityAnalysis.ENDED, 'results': {}})

			for simulation in simulations:

				fixed_points = None

				if simulation.states_probtraj is not None:
					fixed_points = {}
					for key, values in loads(simulation.states_probtraj).items():
						last_time = list(values.keys())[len(values.keys()) - 1]
						if values[last_time] > 0:
							fixed_points.update({key: values[last_time]})

				results['results'].update({simulation.name: fixed_points})

		return Response(results, status=status.HTTP_200_OK)
