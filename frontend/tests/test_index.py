from .TestChrome import TestChrome
from .TestFirefox import TestFirefox


class TestIndexChrome (TestChrome):

	def testTitle(self):

		response = self.get("/")
		self.assertEqual(response.title, "App Curie")


class TestIndexFirefox(TestFirefox):

	def testFirefox(self):

		response = self.get("/")
		self.assertEqual(response.title, "App Curie")

