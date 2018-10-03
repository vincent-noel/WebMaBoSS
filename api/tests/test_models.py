from django.test import TestCase
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework import status
from json import loads
from os.path import join, dirname, exists
from os import makedirs
from shutil import rmtree

class TestModels(TestCase):

	fixtures = ['project.json']

	def __init__(self, *args, **kwargs):
		TestCase.__init__(self, *args, **kwargs)
		self.client = None
		self.project_id = 1
		self.project_path = "zS2NSxM9A4I0"

	def setUp(self):

		# Making sure media root is empty
		if exists(settings.MEDIA_ROOT):
			rmtree(settings.MEDIA_ROOT)

		makedirs(join(settings.MEDIA_ROOT, self.project_path), exist_ok=True)

		self.client = APIClient()

	def testWithoutAuthorization(self):

		# Checking if the list starts empty
		request = self.client.get('/api/logical_models/%d/' % self.project_id)

		self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)
		self.assertEqual(loads(request.content), {'detail': 'You do not have permission to perform this action.'})

		model_name = 'Flobak2015_full_journal.pcbi.1004426.s003.ZGINML'
		# Checking if we can add a model
		request_add = self.client.post(
			'/api/logical_models/%d/' % self.project_id,
			{
				'name': 'Flobak full',
				'file': open(join(dirname(__file__), 'files', model_name), 'rb'),
			},
		)

		self.assertEqual(request_add.status_code, status.HTTP_403_FORBIDDEN)

		# Checking if we can remove it with a bad id
		request_del = self.client.delete('/api/logical_models/%d/%d' % (self.project_id, 0))
		self.assertEqual(request_del.status_code, status.HTTP_403_FORBIDDEN)

	def testWithAuthorization(self):
		# Checking if the list starts empty
		request = self.client.post('/api/auth/login', {
			'username': 'admin', 'password': 'test_password'
		})

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(list(loads(request.content).keys()), ["key"])

		# Adding credentials to the APIClient
		api_key = loads(request.content)["key"]
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + api_key)

		# Checking if the list starts empty
		request = self.client.get('/api/logical_models/%d/' % self.project_id)

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(loads(request.content), [])

		model_name = 'Flobak2015_full_journal.pcbi.1004426.s003.ZGINML'
		# Checking if we can add a model
		request_add = self.client.post(
			'/api/logical_models/%d/' % self.project_id,
			{
				'name': 'Flobak full',
				'file': open(join(dirname(__file__), 'files', model_name), 'rb'),
			},
		)

		self.assertEqual(request_add.status_code, status.HTTP_200_OK)

		request = self.client.get('/api/logical_models/%d/' % self.project_id)

		self.assertEqual(request.status_code, status.HTTP_200_OK)

		model_id = 1
		json_content = loads(request.content)
		self.assertEqual(len(json_content), 1)
		self.assertEqual(json_content[0]['id'], model_id)
		self.assertEqual(json_content[0]['name'], "Flobak full")
		self.assertEqual(json_content[0]['project'], self.project_id)

		# Checking if we can remove it with a bad id
		request_del = self.client.delete('/api/logical_models/%d/%d' % (self.project_id, 0))
		self.assertEqual(request_del.status_code, status.HTTP_404_NOT_FOUND)

		# Now with the good id
		request_del = self.client.delete('/api/logical_models/%d/%d' % (self.project_id, model_id))
		self.assertEqual(request_del.status_code, status.HTTP_200_OK)

		# Checking if the list ends up empty
		request = self.client.get('/api/logical_models/%d/' % self.project_id)

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(loads(request.content), [])
