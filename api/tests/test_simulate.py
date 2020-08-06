from django.conf import settings
from rest_framework import status

from api.tests.APITestCase import APITestCase
from api.models import LogicalModel, Project

from json import loads, dumps
from os.path import join, dirname, exists
from shutil import copytree, rmtree


class TestSimulate(APITestCase):
	fixtures = ['models.json']

	def __init__(self, *args, **kwargs):
		APITestCase.__init__(self, *args, **kwargs)
		self.client = None
		self.projects = []

	def setUp(self):

		APITestCase.setUp(self)

		self.projects = Project.objects.all()
		for project in self.projects:
			if exists(join(dirname(__file__), 'fixtures', 'models', project.path)):
				copytree(
					join(dirname(__file__), 'fixtures', 'models', project.path),
					join(settings.MEDIA_ROOT, project.path)
				)

	def testSimulate(self):

		self.login()

		project = self.projects[1]
		model = LogicalModel.objects.filter(project=project)[0]

		request = self.client.get("/api/logical_model/%d/%d/maboss/settings/" % (project.id, model.id))
		self.assertEqual(request.status_code, status.HTTP_200_OK)

		settings = loads(request.content.decode())

		self.assertEquals(
			settings["output_variables"],
			{"ECMicroenv": False, "DNAdamage": False, "Metastasis": True, "Migration": True, "Invasion": True,
			 "EMT": False, "Apoptosis": True, "CellCycleArrest": True, "GF": False, "TGFbeta": False, "p21": False,
			 "CDH1": False, "CDH2": False, "VIM": False, "TWIST1": False, "SNAI1": False, "SNAI2": False, "ZEB1": False,
			 "ZEB2": False, "AKT1": False, "DKK1": False, "CTNNB1": False, "NICD": False, "p63": False, "p53": False,
			 "p73": False, "miR200": False, "miR203": False, "miR34": False, "AKT2": False, "ERK": False, "SMAD": False}
		)
		
		self.assertEquals(
			settings["initial_states"],
			{'ECMicroenv': {'0': 0.5, '1': 0.5}, 'DNAdamage': {'0': 0.5, '1': 0.5}, 
			 'Metastasis': {'0': 1.0, '1': 0.0}, 'Migration': {'0': 1.0, '1': 0.0}, 
			 'Invasion': {'0': 1.0, '1': 0.0}, 'EMT': {'0': 1.0, '1': 0.0}, 
			 'Apoptosis': {'0': 1.0, '1': 0.0}, 'CellCycleArrest': {'0': 1.0, '1': 0.0}, 
			 'GF': {'0': 1.0, '1': 0.0}, 'TGFbeta': {'0': 1.0, '1': 0.0}, 'p21': {'0': 1.0, '1': 0.0}, 
			 'CDH1': {'0': 1.0, '1': 0.0}, 'CDH2': {'0': 1.0, '1': 0.0}, 'VIM': {'0': 1.0, '1': 0.0}, 
			 'TWIST1': {'0': 1.0, '1': 0.0}, 'SNAI1': {'0': 1.0, '1': 0.0}, 'SNAI2': {'0': 1.0, '1': 0.0}, 
			 'ZEB1': {'0': 1.0, '1': 0.0}, 'ZEB2': {'0': 1.0, '1': 0.0}, 'AKT1': {'0': 1.0, '1': 0.0}, 
			 'DKK1': {'0': 1.0, '1': 0.0}, 'CTNNB1': {'0': 1.0, '1': 0.0}, 'NICD': {'0': 1.0, '1': 0.0}, 
			 'p63': {'0': 1.0, '1': 0.0}, 'p53': {'0': 1.0, '1': 0.0}, 'p73': {'0': 1.0, '1': 0.0}, 
			 'miR200': {'0': 1.0, '1': 0.0}, 'miR203': {'0': 1.0, '1': 0.0}, 'miR34': {'0': 1.0, '1': 0.0}, 
			 'AKT2': {'0': 1.0, '1': 0.0}, 'ERK': {'0': 1.0, '1': 0.0}, 'SMAD': {'0': 1.0, '1': 0.0}
			}
		)

		# request = self.client.post(
		# 	"/api/logical_model/%d/%d/maboss" % (project.id, model.id),
		# 	{
		# 		'name': 'test_sim',
		# 		'settings': dumps(settings["settings"]),
		# 		'initialStates': dumps(settings["initial_states"]),
		# 		'outputVariables': dumps(settings["output_variables"]),
		# 		'mutations': dumps(settings["mutations"])
		# 	}
		
		
			# dumps(settings)
		
		# )
		# self.assertEqual(request.status_code, status.HTTP_200_OK)
		# print(request.content)