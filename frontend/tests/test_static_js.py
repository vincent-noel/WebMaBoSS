from .TestChrome import TestChrome
from .TestFirefox import TestFirefox


class TestStaticJSChrome (TestChrome):

	def testTitle(self):

		response = self.get("/static/frontend/index.js.gz")
		self.assertNotEqual(response.page_source,
			'<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body><h1>Not Found</h1>'
			+ '<p>The requested URL /static/frontend/index.js.gz was not found on this server.</p></body></html>'
		)


class TestStaticJSFirefox(TestFirefox):

	def testFirefox(self):

		response = self.get("/static/frontend/index.js.gz")
		self.assertNotEqual(response.page_source,
			'<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body><h1>Not Found</h1>'
			+ '<p>The requested URL /static/frontend/index.js.gz was not found on this server.</p></body></html>'
		)
