from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.firefox.options import Options as FireFoxOptions


class TestFirefox(LiveServerTestCase):

	def __init__(self, *args, **kwargs):
		LiveServerTestCase.__init__(self, *args, **kwargs)
		self.driver = None

	def setUp(self):

		options = FireFoxOptions()
		options.add_argument('-headless')
		self.driver = webdriver.Firefox(
			firefox_options=options,
			executable_path='geckodriver'
		)

	def tearDown(self):
		self.driver.quit()

	def get(self, url):
		self.driver.get(self.live_server_url + url)
		return self.driver


