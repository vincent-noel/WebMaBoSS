from django.test import TestCase
from django.conf import settings

from rest_framework.test import APIClient
from rest_framework import status

from json import loads
from os.path import join, dirname, exists
from os import makedirs
from shutil import copytree, rmtree
from filecmp import cmp


class TestModel(TestCase):
	fixtures = ['model.json']

	def __init__(self, *args, **kwargs):
		TestCase.__init__(self, *args, **kwargs)
		self.client = None
		self.project_id = 1
		self.project_path = "zS2NSxM9A4I0"
		self.model_id = 1

	def setUp(self):

		# Making sure media root is empty
		if exists(settings.MEDIA_ROOT):
			rmtree(settings.MEDIA_ROOT)

		makedirs(join(settings.MEDIA_ROOT, 'admin', 'logical_models'), exist_ok=True)
		copytree(
			join(dirname(__file__), 'fixtures', 'model', self.project_path),
			join(settings.MEDIA_ROOT, self.project_path)
		)

		self.client = APIClient()

	def testUnAuthorizedModel(self):

		# Checking without login
		request = self.client.get('/api/logical_model/%d/%d/name' % (self.project_id, self.model_id))

		self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)
		self.assertEqual(loads(request.content), {'detail': 'You do not have permission to perform this action.'})

		request = self.client.get('/api/logical_model/%d/%d/graph' % (self.project_id, self.model_id))

		self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)
		self.assertEqual(loads(request.content), {'detail': 'You do not have permission to perform this action.'})

		request = self.client.get('/api/logical_model/%d/%d/graph_raw' % (self.project_id, self.model_id))

		self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)
		self.assertEqual(loads(request.content), {'detail': 'You do not have permission to perform this action.'})

	def testAuthorizedModel(self):

		# Logging in
		request = self.client.post('/api/auth/login', {
			'username': 'admin', 'password': 'test_password'
		})

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(list(loads(request.content).keys()), ["key"])

		# Adding credentials to the APIClient
		api_key = loads(request.content)["key"]
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + api_key)

		request = self.client.get('/api/logical_model/%d/%d/name' % (self.project_id, self.model_id))

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(loads(request.content), {'name': 'Metastasis'})

		request = self.client.get('/api/logical_model/%d/%d/graph' % (self.project_id, self.model_id))

		self.assertEqual(request.status_code, status.HTTP_200_OK)

		# with open(join(settings.MEDIA_ROOT, "graph.png"), 'wb') as file:
		# 	file.write(request.content)
		# self.assertTrue(cmp(join(settings.MEDIA_ROOT, "graph.png"), join(dirname(__file__), 'files', 'graph.png')))

		request = self.client.get('/api/logical_model/%d/%d/graph_raw' % (self.project_id, self.model_id))

		self.assertEqual(request.status_code, status.HTTP_200_OK)

		self.assertEqual(sorted(list(loads(request.content).keys())), ['edges', 'nodes'])
		self.assertEqual(sorted(list(loads(request.content)['nodes'])), [
			'AKT1', 'AKT2', 'Apoptosis', 'CDH1', 'CDH2', 'CTNNB1', 'CellCycleArrest', 'DKK1', 'DNAdamage',
			'ECMicroenv', 'EMT', 'ERK', 'GF', 'Invasion', 'Metastasis', 'Migration', 'NICD', 'SMAD',
			'SNAI1', 'SNAI2', 'TGFbeta', 'TWIST1', 'VIM', 'ZEB1', 'ZEB2', 'miR200', 'miR203', 'miR34',
			'p21', 'p53', 'p63', 'p73'
		])

		self.assertEqual(sorted(list(loads(request.content)['edges'])), [
			['AKT1', 'Apoptosis', 0], ['AKT1', 'CTNNB1', 0], ['AKT1', 'CellCycleArrest', 0],
			['AKT1', 'ERK', 0], ['AKT1', 'Migration', 0], ['AKT1', 'miR34', 0], ['AKT1', 'p21', 0],
			['AKT1', 'p53', 0], ['AKT1', 'p63', 0], ['AKT1', 'p73', 0], ['AKT2', 'CDH1', 0],
			['AKT2', 'Migration', 1], ['AKT2', 'miR200', 0], ['AKT2', 'miR34', 1], ['AKT2', 'p21', 1],
			['AKT2', 'p53', 0], ['AKT2', 'p63', 0], ['AKT2', 'p73', 0], ['CDH1', 'AKT1', 0],
			['CDH1', 'CTNNB1', 0], ['CDH1', 'EMT', 0], ['CDH1', 'GF', 0], ['CDH2', 'AKT1', 1],
			['CDH2', 'AKT2', 1], ['CDH2', 'CTNNB1', 0], ['CDH2', 'EMT', 1], ['CDH2', 'ERK', 1],
			['CDH2', 'GF', 1], ['CDH2', 'Invasion', 1], ['CTNNB1', 'AKT1', 1], ['CTNNB1', 'DKK1', 1],
			['CTNNB1', 'Invasion', 1], ['CTNNB1', 'SNAI1', 0], ['CTNNB1', 'SNAI2', 1],
			['CTNNB1', 'TGFbeta', 0], ['CTNNB1', 'TWIST1', 1], ['CTNNB1', 'VIM', 1],
			['CTNNB1', 'ZEB1', 1], ['CTNNB1', 'p53', 1], ['DKK1', 'CTNNB1', 0], ['DNAdamage', 'p53', 1],
			['DNAdamage', 'p63', 1], ['DNAdamage', 'p73', 1], ['ECMicroenv', 'NICD', 1],
			['ECMicroenv', 'TGFbeta', 1], ['EMT', 'Migration', 1], ['ERK', 'Apoptosis', 0],
			['ERK', 'Migration', 1], ['ERK', 'p21', 0], ['GF', 'AKT1', 1], ['GF', 'AKT2', 1],
			['GF', 'ERK', 1], ['GF', 'GF', 1], ['Invasion', 'Migration', 1],
			['Migration', 'Metastasis', 1], ['NICD', 'AKT1', 1], ['NICD', 'AKT2', 1], ['NICD', 'DKK1', 1],
			['NICD', 'ERK', 1], ['NICD', 'SNAI1', 1], ['NICD', 'SNAI2', 1], ['NICD', 'TGFbeta', 1],
			['NICD', 'TWIST1', 1], ['NICD', 'ZEB1', 1], ['NICD', 'ZEB2', 1], ['NICD', 'p21', 1],
			['NICD', 'p53', 1], ['NICD', 'p63', 0], ['SMAD', 'ERK', 1], ['SMAD', 'Invasion', 1],
			['SMAD', 'p21', 1], ['SNAI1', 'CDH1', 0], ['SNAI1', 'TWIST1', 1], ['SNAI1', 'ZEB1', 1],
			['SNAI1', 'ZEB2', 1], ['SNAI1', 'miR200', 0], ['SNAI1', 'miR203', 0], ['SNAI1', 'miR34', 0],
			['SNAI2', 'CDH1', 0], ['SNAI2', 'ZEB1', 1], ['SNAI2', 'ZEB2', 1], ['SNAI2', 'miR200', 0],
			['SNAI2', 'p53', 0], ['TGFbeta', 'AKT1', 1], ['TGFbeta', 'AKT2', 1], ['TGFbeta', 'SMAD', 1],
			['TWIST1', 'AKT2', 1], ['TWIST1', 'CDH1', 0], ['TWIST1', 'CDH2', 1], ['TWIST1', 'SNAI1', 1],
			['TWIST1', 'SNAI2', 1], ['TWIST1', 'ZEB1', 1], ['TWIST1', 'ZEB2', 1], ['VIM', 'Migration', 1],
			['ZEB1', 'CDH1', 0], ['ZEB1', 'miR200', 0], ['ZEB1', 'miR203', 0], ['ZEB1', 'miR34', 0],
			['ZEB1', 'p73', 0], ['ZEB2', 'Apoptosis', 0], ['ZEB2', 'CDH1', 0],
			['ZEB2', 'CellCycleArrest', 1], ['ZEB2', 'VIM', 1], ['ZEB2', 'miR200', 0],
			['ZEB2', 'miR203', 0], ['ZEB2', 'miR34', 0], ['miR200', 'Apoptosis', 1],
			['miR200', 'CTNNB1', 0], ['miR200', 'CellCycleArrest', 1], ['miR200', 'Migration', 0],
			['miR200', 'NICD', 0], ['miR200', 'SMAD', 0], ['miR200', 'SNAI2', 0], ['miR200', 'ZEB1', 0],
			['miR200', 'ZEB2', 0], ['miR203', 'AKT2', 0], ['miR203', 'CellCycleArrest', 1],
			['miR203', 'SMAD', 0], ['miR203', 'SNAI1', 0], ['miR203', 'SNAI2', 0], ['miR203', 'ZEB2', 0],
			['miR203', 'p63', 0], ['miR34', 'AKT1', 0], ['miR34', 'AKT2', 0], ['miR34', 'Apoptosis', 1],
			['miR34', 'CTNNB1', 0], ['miR34', 'CellCycleArrest', 1], ['miR34', 'NICD', 0],
			['miR34', 'SNAI1', 0], ['miR34', 'p53', 1], ['p21', 'CellCycleArrest', 1], ['p53', 'AKT1', 0],
			['p53', 'AKT2', 0], ['p53', 'Apoptosis', 1], ['p53', 'CTNNB1', 0], ['p53', 'NICD', 0],
			['p53', 'SNAI1', 0], ['p53', 'SNAI2', 0], ['p53', 'miR200', 1], ['p53', 'miR203', 1],
			['p53', 'miR34', 1], ['p53', 'p21', 1], ['p53', 'p63', 0], ['p53', 'p73', 0],
			['p63', 'Apoptosis', 1], ['p63', 'CTNNB1', 0], ['p63', 'Migration', 0], ['p63', 'NICD', 0],
			['p63', 'miR200', 1], ['p63', 'miR34', 0], ['p63', 'p21', 1], ['p73', 'Apoptosis', 1],
			['p73', 'NICD', 0], ['p73', 'miR200', 1], ['p73', 'miR34', 1], ['p73', 'p21', 1],
			['p73', 'p53', 0]
		])

		request = self.client.get('/api/logical_model/%d/%d/nodes' % (self.project_id, self.model_id))

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(loads(request.content), [
			"ECMicroenv", "DNAdamage", "Metastasis", "Migration", "Invasion", "EMT", "Apoptosis", "CellCycleArrest",
			"GF", "TGFbeta", "p21", "CDH1", "CDH2", "VIM", "TWIST1", "SNAI1", "SNAI2", "ZEB1", "ZEB2", "AKT1", "DKK1",
			"CTNNB1", "NICD", "p63", "p53", "p73", "miR200", "miR203", "miR34", "AKT2", "ERK", "SMAD"
		])

		request = self.client.get('/api/logical_model/%d/%d/steady_states' % (self.project_id, self.model_id))

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(loads(request.content), [
			{
				"ECMicroenv": 0, "DNAdamage": 0, "Metastasis": 0, "Migration": 0, "Invasion": 0, "EMT": 0,
				"Apoptosis": 0, "CellCycleArrest": 0, "GF": 0, "TGFbeta": 0, "p21": 0, "CDH1": 1, "CDH2": 0, "VIM": 0,
				"TWIST1": 0, "SNAI1": 0, "SNAI2": 0, "ZEB1": 0, "ZEB2": 0, "AKT1": 0, "DKK1": 0, "CTNNB1": 0, "NICD": 0,
				"p63": 0, "p53": 0, "p73": 0, "miR200": 0, "miR203": 0, "miR34": 0, "AKT2": 0, "ERK": 0, "SMAD": 0
			}, {
				"ECMicroenv": 0, "DNAdamage": 0, "Metastasis": 0, "Migration": 0, "Invasion": 0, "EMT": 1,
				"Apoptosis": 0, "CellCycleArrest": 1, "GF": 1, "TGFbeta": 0, "p21": 0, "CDH1": 0, "CDH2": 1, "VIM": 1,
				"TWIST1": 1, "SNAI1": 1, "SNAI2": 1, "ZEB1": 1, "ZEB2": 1, "AKT1": 0, "DKK1": 0, "CTNNB1": 0, "NICD": 0,
				"p63": 0, "p53": 0, "p73": 0, "miR200": 0, "miR203": 0, "miR34": 0, "AKT2": 1, "ERK": 1, "SMAD": 0
			}, {
				"ECMicroenv": 0, "DNAdamage": 1, "Metastasis": 0, "Migration": 0, "Invasion": 0, "EMT": 0,
				"Apoptosis": 1, "CellCycleArrest": 1, "GF": 0, "TGFbeta": 0, "p21": 1, "CDH1": 1, "CDH2": 0, "VIM": 0,
				"TWIST1": 0, "SNAI1": 0, "SNAI2": 0, "ZEB1": 0, "ZEB2": 0, "AKT1": 0, "DKK1": 0, "CTNNB1": 0, "NICD": 0,
				"p63": 0, "p53": 1, "p73": 0, "miR200": 1, "miR203": 1, "miR34": 0, "AKT2": 0, "ERK": 0, "SMAD": 0
			}, {
				"ECMicroenv": 0, "DNAdamage": 1, "Metastasis": 0, "Migration": 0, "Invasion": 0, "EMT": 0,
				"Apoptosis": 1, "CellCycleArrest": 1, "GF": 0, "TGFbeta": 0, "p21": 1, "CDH1": 1, "CDH2": 0, "VIM": 0,
				"TWIST1": 0, "SNAI1": 0, "SNAI2": 0, "ZEB1": 0, "ZEB2": 0, "AKT1": 0, "DKK1": 0, "CTNNB1": 0, "NICD": 0,
				"p63": 1, "p53": 0, "p73": 1, "miR200": 1, "miR203": 0, "miR34": 0, "AKT2": 0, "ERK": 0, "SMAD": 0
			}, {
				"ECMicroenv": 0, "DNAdamage": 1, "Metastasis": 0, "Migration": 0, "Invasion": 0, "EMT": 1,
				"Apoptosis": 0, "CellCycleArrest": 1, "GF": 1, "TGFbeta": 0, "p21": 0, "CDH1": 0, "CDH2": 1, "VIM": 1,
				"TWIST1": 1, "SNAI1": 1, "SNAI2": 1, "ZEB1": 1, "ZEB2": 1, "AKT1": 0, "DKK1": 0, "CTNNB1": 0, "NICD": 0,
				"p63": 0, "p53": 0, "p73": 0, "miR200": 0, "miR203": 0, "miR34": 0, "AKT2": 1, "ERK": 1, "SMAD": 0
			}, {
				"ECMicroenv": 1, "DNAdamage": 0, "Metastasis": 1, "Migration": 1, "Invasion": 1, "EMT": 1,
				"Apoptosis": 0, "CellCycleArrest": 1, "GF": 1, "TGFbeta": 1, "p21": 0, "CDH1": 0, "CDH2": 1, "VIM": 1,
				"TWIST1": 1, "SNAI1": 1, "SNAI2": 1, "ZEB1": 1, "ZEB2": 1, "AKT1": 0, "DKK1": 1, "CTNNB1": 0, "NICD": 1,
				"p63": 0, "p53": 0, "p73": 0, "miR200": 0, "miR203": 0, "miR34": 0, "AKT2": 1, "ERK": 1, "SMAD": 1
			},
			{
				"ECMicroenv": 1, "DNAdamage": 1, "Metastasis": 0, "Migration": 0, "Invasion": 0, "EMT": 0,
				"Apoptosis": 1, "CellCycleArrest": 1, "GF": 0, "TGFbeta": 1, "p21": 1, "CDH1": 1, "CDH2": 0, "VIM": 0,
				"TWIST1": 0, "SNAI1": 0, "SNAI2": 0, "ZEB1": 0, "ZEB2": 0, "AKT1": 0, "DKK1": 0, "CTNNB1": 0, "NICD": 0,
				"p63": 0, "p53": 1, "p73": 0, "miR200": 1, "miR203": 1, "miR34": 0, "AKT2": 0, "ERK": 0, "SMAD": 0
			}, {
				"ECMicroenv": 1, "DNAdamage": 1, "Metastasis": 0, "Migration": 0, "Invasion": 0, "EMT": 0,
				"Apoptosis": 1, "CellCycleArrest": 1, "GF": 0, "TGFbeta": 1, "p21": 1, "CDH1": 1, "CDH2": 0, "VIM": 0,
				"TWIST1": 0, "SNAI1": 0, "SNAI2": 0, "ZEB1": 0, "ZEB2": 0, "AKT1": 0, "DKK1": 0, "CTNNB1": 0, "NICD": 0,
				"p63": 1, "p53": 0, "p73": 1, "miR200": 1, "miR203": 0, "miR34": 0, "AKT2": 0, "ERK": 0, "SMAD": 0
			}, {
				"ECMicroenv": 1, "DNAdamage": 1, "Metastasis": 1, "Migration": 1, "Invasion": 1, "EMT": 1,
				"Apoptosis": 0, "CellCycleArrest": 1, "GF": 1, "TGFbeta": 1, "p21": 0, "CDH1": 0, "CDH2": 1, "VIM": 1,
				"TWIST1": 1, "SNAI1": 1, "SNAI2": 1, "ZEB1": 1, "ZEB2": 1, "AKT1": 0, "DKK1": 1, "CTNNB1": 0, "NICD": 1,
				"p63": 0, "p53": 0, "p73": 0, "miR200": 0, "miR203": 0, "miR34": 0, "AKT2": 1, "ERK": 1, "SMAD": 1
			}
		])

		request = self.client.get('/api/logical_models/%d/%d/file' % (self.project_id, self.model_id))

		self.assertEqual(request.status_code, status.HTTP_200_OK)

		with open(join(settings.MEDIA_ROOT, "model.zginml"), 'wb') as file:
			file.write(b''.join(request.streaming_content))

		self.assertTrue(cmp(
			join(settings.MEDIA_ROOT, "model.zginml"),
			join(dirname(__file__), 'files', 'Metastasis_Master_Model.zginml'))
		)

		# Commented for now
		# request = self.client.get('/api/logical_models/%d/%d/sbmlfile' % (self.project_id, self.model_id))
		#
		# self.assertEqual(request.status_code, status.HTTP_200_OK)
		#
		# with open(join(settings.MEDIA_ROOT, "model.sbml"), 'wb') as file:
		# 	file.write(b''.join(request.streaming_content))
		#
		# self.assertTrue(cmp(
		# 	join(settings.MEDIA_ROOT, "model.sbml"),
		# 	join(dirname(__file__), 'files', 'Metastasis_Master_Model.sbml'))
		# )
