from django.test import TestCase, Client
from rest_framework.test import APIClient
from rest_framework import status
from json import loads
from os.path import join, dirname

class TestModels(TestCase):

	def testListModels(self):

		client = APIClient()

		# Checking if the list starts empty
		request = client.get('/api/logical_models/', {})

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(loads(request.content), [])

		# Checking if we can add a model
		request_add = client.post('/api/logical_models/', {
			'name': 'metastasis',
			'file': open(join(dirname(__file__), 'files', 'Metastasis_Master_Model.zginml'), 'rb')
		})

		self.assertEqual(request_add.status_code, status.HTTP_200_OK)

		# Checking if the model is in the list
		request = client.get('/api/logical_models/', {})

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(loads(request.content), [{
			"id": 1, "name": "metastasis", "file": "/media/logical_models/Metastasis_Master_Model.zginml"
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
