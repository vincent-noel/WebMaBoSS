from .TestChrome import TestChrome
from .TestFirefox import TestFirefox
from django.conf import settings
from os import makedirs
from os.path import exists, join, dirname
from shutil import rmtree, copytree


class TestSimulateChrome (TestChrome):

	fixtures = ['model.json']

	def __init__(self, *args, **kwargs):
		TestChrome.__init__(self, *args, **kwargs)
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

		TestChrome.setUp(self)

	def testSimulate(self):

		self.login()

		self.get("/model/maboss/simulation/")
		self.assertCurrentURL("/model/maboss/simulation/")

		self.getByXPath("/html/body/section/div/div/div/div[2]/div/button[1]").click()
		self.getByXPath("/html/body/div/div/div[1]/div/div/form/div/div[3]/div/button[2]").click()

class TestSimulateFirefox(TestFirefox):

	fixtures = ['user.json']

	def __init__(self, *args, **kwargs):
		TestFirefox.__init__(self, *args, **kwargs)
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

		TestFirefox.setUp(self)

	def testSimulate(self):

		self.login()

		self.get("/model/maboss/simulation/")
		self.assertCurrentURL("/model/maboss/simulation/")

		self.getByXPath("/html/body/section/div/div/div/div[2]/div/button[1]").click()
		self.getByXPath("/html/body/div/div/div[1]/div/div/form/div/div[3]/div/button[2]").click()