from django.test import TestCase
from django.conf import settings

from rest_framework.test import APIClient
from rest_framework import status

from json import loads
from os.path import join, exists
from os import makedirs
from shutil import rmtree


class APITestCase(TestCase):

	def __init__(self, *args, **kwargs):
		TestCase.__init__(self, *args, **kwargs)
		self.client = None

	def setUp(self):
		TestCase.setUp(self)

		if exists(settings.MEDIA_ROOT):
			rmtree(settings.MEDIA_ROOT)
		makedirs(join(settings.MEDIA_ROOT), exist_ok=True)

		self.client = APIClient()

	def tearDown(self):
		TestCase.tearDown(self)

		if exists(settings.MEDIA_ROOT):
			rmtree(settings.MEDIA_ROOT)

	def login(self):
		# Logging in
		request = self.client.post('/api/auth/login', {
			'username': 'admin', 'password': 'test_password'
		})

		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(list(loads(request.content).keys()), ["key"])

		# Adding credentials to the APIClient
		api_key = loads(request.content)["key"]
		self.client.credentials(HTTP_AUTHORIZATION='Token ' + api_key)
