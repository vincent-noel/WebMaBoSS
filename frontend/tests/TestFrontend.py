from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from selenium.webdriver.support.ui import WebDriverWait


class TestFrontend(StaticLiveServerTestCase):

	def __init__(self, *args, **kwargs):

		StaticLiveServerTestCase.__init__(self, *args, **kwargs)
		self.driver = None

	def tearDown(self):
		self.driver.quit()

	def get(self, url):
		self.driver.get(self.live_server_url + url)
		return self.driver

	def assertCurrentURL(self, url):
		self.assertEqual(self.driver.current_url, self.live_server_url + url)
