from django.test import TestCase
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework import status
from json import loads
from os.path import exists
from os import makedirs
from shutil import rmtree

class TestProjects(TestCase):

	fixtures = ['user.json']

	def __init__(self, *args, **kwargs):
		TestCase.__init__(self, *args, **kwargs)
		self.client = None

	def setUp(self):

		# Making sure media root is empty
		if exists(settings.MEDIA_ROOT):
			rmtree(settings.MEDIA_ROOT)

		makedirs(settings.MEDIA_ROOT, exist_ok=True)

		self.client = APIClient()

	def testForbiddenAccess(self):

		# Checking without login
		request = self.client.get('/api/projects/')

		self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)
		self.assertEqual(loads(request.content), {'detail': 'You do not have permission to perform this action.'})

		# Checking if we can add a project
		request_add = self.client.post(
			'/api/projects/',
			{
				'user': 'anonymous',
				'name': 'metastasis',
				'description': 'some unknown project',
			},
		)

		self.assertEqual(request_add.status_code, status.HTTP_403_FORBIDDEN)

		# Checking if we can remove it with a bad id
		request_del = self.client.delete('/api/projects/%d' % 0)
		self.assertEqual(request_del.status_code, status.HTTP_403_FORBIDDEN)

	def testAuthorizedAccess(self):

		# Logging in
		request = self.client.post('/api/auth/login', {
			'username': 'admin', 'password': 'test_password'
		})

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(list(loads(request.content).keys()), ["key"])

		# Adding credentials to the APIClient
		api_key = loads(request.content)["key"]
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + api_key)

		# Checking if the list starts empty
		request = self.client.get('/api/projects/')

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		data_projects = loads(request.content)

		self.assertEqual(len(data_projects), 1)
		self.assertEqual(data_projects[0]['user'], 1)
		self.assertEqual(data_projects[0]['name'], "My Project")
		self.assertEqual(data_projects[0]['description'], "")

		# Checking if we can add a project
		request_add = self.client.post(
			'/api/projects/',
			{
				'name': 'metastasis',
				'description': 'A project about metastasis',
			},
		)

		self.assertEqual(request_add.status_code, status.HTTP_200_OK)

		request = self.client.get('/api/projects/')

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		data_projects = loads(request.content)

		self.assertEqual(len(data_projects), 2)
		self.assertEqual(data_projects[1]['user'], 1)
		self.assertEqual(data_projects[1]['name'], "metastasis")
		self.assertEqual(data_projects[1]['description'], "A project about metastasis")

		# Checking if we can remove it with a bad id
		request_del = self.client.delete('/api/projects/0')
		self.assertEqual(request_del.status_code, status.HTTP_404_NOT_FOUND)

		# Now with the good id
		request_del = self.client.delete('/api/projects/%d' % data_projects[1]['id'])
		self.assertEqual(request_del.status_code, status.HTTP_200_OK)

		# Also removing the default project
		request_del = self.client.delete('/api/projects/%d' % data_projects[0]['id'])
		self.assertEqual(request_del.status_code, status.HTTP_200_OK)

		# Checking if the list ends up empty
		request = self.client.get('/api/projects/', {})

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(loads(request.content), [])
