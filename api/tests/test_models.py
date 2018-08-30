from django.test import TestCase
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework import status
from json import loads
from os.path import join, dirname, exists
from os import makedirs
from shutil import rmtree

class TestModels(TestCase):

	fixtures = ['user.json']

	def testListModels(self):

		# Making sure media root is empty
		if exists(settings.MEDIA_ROOT):
			rmtree(settings.MEDIA_ROOT)

		# makedirs(settings.MEDIA_ROOT, exist_ok=True)

		client = APIClient()

		# Checking without login
		# Checking if the list starts empty
		request = client.get('/api/logical_models/')

		self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)
		self.assertEqual(loads(request.content), {'detail': 'You do not have permission to perform this action.'})

		# Checking if we can add a model
		request_add = client.post(
			'/api/logical_models/',
			{
				'name': 'metastasis',
				'file': open(join(dirname(__file__), 'files', 'Metastasis_Master_Model.zginml'), 'rb'),
			},
		)

		self.assertEqual(request_add.status_code, status.HTTP_403_FORBIDDEN)

		# Checking if we can remove it with a bad id
		request_del = client.delete('/api/logical_models/', data={'id': 0})
		self.assertEqual(request_del.status_code, status.HTTP_403_FORBIDDEN)

		# Checking if the list starts empty
		request = client.post('/api/login/', {
			'username': 'admin', 'password': 'test_password'
		})

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(list(loads(request.content).keys()), ["key"])

		# Adding credentials to the APIClient
		api_key = loads(request.content)["key"]
		client.credentials(HTTP_AUTHORIZATION='Token ' + api_key)

		# Checking if the list starts empty
		request = client.get('/api/logical_models/')

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(loads(request.content), [])

		# Checking if we can add a model
		request_add = client.post(
			'/api/logical_models/',
			{
				'name': 'metastasis',
				'file': open(join(dirname(__file__), 'files', 'Metastasis_Master_Model.zginml'), 'rb'),
			},
		)

		self.assertEqual(request_add.status_code, status.HTTP_200_OK)

		request = client.get('/api/logical_models/')

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(loads(request.content), [{
			"id": 1, "name": "metastasis", "file": "/media/admin/logical_models/Metastasis_Master_Model.zginml", "user": 1
		}])

		# Checking if we can remove it with a bad id
		request_del = client.delete('/api/logical_models/', data={'id': 0})
		self.assertEqual(request_del.status_code, status.HTTP_404_NOT_FOUND)

		# Now with the good id
		request_del = client.delete('/api/logical_models/', data={'id': 1})
		self.assertEqual(request_del.status_code, status.HTTP_200_OK)

		# Checking if the list ends up empty
		request = client.get('/api/logical_models/', {})

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(loads(request.content), [])
