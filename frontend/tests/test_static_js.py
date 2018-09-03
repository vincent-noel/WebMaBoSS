from .TestChrome import TestChrome
from .TestFirefox import TestFirefox

from django.conf import settings
from os.path import isfile, join


class TestStaticJSChrome (TestChrome):

	def testTitle(self):

		self.assertTrue(isfile(join(settings.BASE_DIR, "frontend", "static", "index.js.gz")))

		response = self.get("/static/index.js.gz")
		sleep(1)

		self.assertNotEqual(response.page_source,
			'<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body><h1>Not Found</h1>'
			+ '<p>The requested URL /static/index.js.gz was not found on this server.</p></body></html>'
		)


class TestStaticJSFirefox(TestFirefox):

	def testFirefox(self):

		self.assertTrue(isfile(join(settings.BASE_DIR, "frontend", "static", "index.js.gz")))

		response = self.get("/static/index.js.gz")
		sleep(1)

		self.assertNotEqual(response.page_source,
			'<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body><h1>Not Found</h1>'
			+ '<p>The requested URL /static/index.js.gz was not found on this server.</p></body></html>'
		)
