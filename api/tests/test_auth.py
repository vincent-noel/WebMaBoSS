from django.test import TestCase
from django.conf import settings
from rest_framework.test import APIClient
from rest_framework import status
from json import loads
from os.path import exists
from os import makedirs
from shutil import rmtree

class TestAuthentication(TestCase):

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

	def testLoginNoUser(self):

		# Logging in
		request = self.client.post('/api/auth/login', {
			'username': 'user', 'password': 'test_password'
		})

		self.assertEqual(request.status_code, status.HTTP_400_BAD_REQUEST)

	def testLoginUser(self):

		# Logging in
		request = self.client.post('/api/auth/login', {
			'username': 'admin', 'password': 'test_password'
		})

		self.assertEqual(request.status_code, status.HTTP_200_OK)

	def testRegisterUser(self):

		# Registering
		request = self.client.post('/api/auth/register', {
			'username': 'user', 'email': 'user@mail.com',
			'password1': 'test_password', 'password2': 'test_password'
		})

		self.assertEqual(request.status_code, status.HTTP_201_CREATED)

		# Logging in
		request = self.client.post('/api/auth/login', {
			'username': 'user', 'password': 'test_password'
		})

		self.assertEqual(request.status_code, status.HTTP_200_OK)

	def testLogout(self):

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
		self.assertEqual(len(loads(request.content)), 1)

		# Logging out
		request = self.client.post('/api/auth/logout')
		self.assertEqual(request.status_code, status.HTTP_200_OK)

		# Checking if the list starts empty
		request = self.client.get('/api/projects/')
		self.assertEqual(request.status_code, status.HTTP_401_UNAUTHORIZED)

