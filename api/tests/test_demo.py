from django.contrib.auth.models import User
from django.core.management import call_command
from rest_framework import status
from rest_framework.test import APIClient

from api.models import LogicalModel, Project
from api.models.common import create_guest_account
from api.models.logical_model import DEMO_MODELS
from api.tests.APITestCase import APITestCase

DEMO_NAMES = sorted(name for name, _ in DEMO_MODELS)


class TestDemo(APITestCase):

	def setUp(self):
		APITestCase.setUp(self)

		self.demo_project = Project.objects.get(user=create_guest_account())
		self.demo_models = LogicalModel.objects.filter(project=self.demo_project)

	def models(self, project):
		return sorted(model.name for model in LogicalModel.objects.filter(project=project))

	def testNewUser(self):

		# New users get a copy of the demo models in their first project
		user = User.objects.create_user("user", password="test_password")
		project = Project.objects.get(user=user)
		self.assertEqual(self.models(project), DEMO_NAMES)
		self.assertNotEqual(project, self.demo_project)

	def testAnonymousReadOnly(self):

		# Anonymous users see the demo project, whatever the project id
		request = self.client.get('/api/logical_models/0/')
		self.assertEqual(request.status_code, status.HTTP_200_OK)
		self.assertEqual(sorted(model['name'] for model in request.json()), DEMO_NAMES)

		model = self.demo_models[0]
		project_url = '/api/logical_models/%d/%d' % (self.demo_project.id, model.id)
		model_url = '/api/logical_model/%d/%d' % (self.demo_project.id, model.id)

		self.assertEqual(self.client.get(model_url + '/nodes').status_code, status.HTTP_200_OK)
		self.assertEqual(self.client.get(model_url + '/maboss/settings/').status_code, status.HTTP_200_OK)

		# But they can't modify it
		for method, url in [
			('delete', project_url),
			('post', '/api/logical_models/%d/' % self.demo_project.id),
			('post', model_url + '/name'),
			('post', model_url + '/nodes'),
			('post', model_url + '/formula/CDH1/logic'),
			('put', model_url + '/initial_states'),
			('put', model_url + '/outputs'),
			('put', model_url + '/settings'),
			('post', model_url + '/graph_raw/CDH1'),
			('post', project_url + '/tags/'),
			('get', project_url + '/tags/'),
			('post', model_url + '/maboss_sensitivity'),
			('post', '/api/projects/%d/demo_models' % self.demo_project.id),
			('get', '/api/projects/'),
			('post', '/api/projects/'),
		]:
			request = getattr(self.client, method)(url)
			self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN, "%s %s" % (method, url))

		self.assertEqual(self.models(self.demo_project), DEMO_NAMES)

		# They can still run simulations : the request goes past the permissions (and then fails, as it is empty)
		client = APIClient(raise_request_exception=False)
		self.assertNotEqual(client.post(model_url + '/maboss').status_code, status.HTTP_403_FORBIDDEN)

	def testRestoreDemoModels(self):

		user = User.objects.create_user("user", password="test_password")
		project = Project.objects.get(user=user)
		url = '/api/projects/%d/demo_models' % project.id

		# Not by anonymous users, nor by other users
		self.assertEqual(self.client.post(url).status_code, status.HTTP_403_FORBIDDEN)
		self.client.force_authenticate(User.objects.create_user("other", password="test_password"))
		self.assertEqual(self.client.post(url).status_code, status.HTTP_403_FORBIDDEN)

		# The user's models are kept, and fresh copies of the demo models are added
		self.client.force_authenticate(user)
		LogicalModel.objects.filter(project=project).first().delete()
		self.assertEqual(self.client.post(url).status_code, status.HTTP_200_OK)
		self.assertEqual(len(self.models(project)), 2 * len(DEMO_NAMES) - 1)
		for name in DEMO_NAMES:
			self.assertIn(name, self.models(project))

	def testResetDemo(self):

		# A demo project with a missing model, and a model which doesn't belong there
		self.demo_models.first().delete()
		LogicalModel(project=self.demo_project, name="Some model", format=LogicalModel.MABOSS).save()

		call_command("reset_demo", stdout=open("/dev/null", "w"))

		self.assertEqual(self.models(self.demo_project), DEMO_NAMES)
