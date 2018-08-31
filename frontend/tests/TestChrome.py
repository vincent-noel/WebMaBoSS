from django.test import LiveServerTestCase
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions


class TestChrome(LiveServerTestCase):

	def __init__(self, *args, **kwargs):

		LiveServerTestCase.__init__(self, *args, **kwargs)
		self.driver = None

	def setUp(self):

		chrome_options = ChromeOptions()
		chrome_options.add_argument("--headless")
		chrome_options.add_argument("--no-sandbox")
		chrome_options.add_argument("--disable-dev-shm-usage")
		chrome_options.binary_location = '/usr/bin/google-chrome'

		self.driver = webdriver.Chrome(
			executable_path='/usr/bin/chromedriver',
			chrome_options=chrome_options
		)

	def tearDown(self):
		self.driver.quit()

	def get(self, url):
		self.driver.get(self.live_server_url + url)
		return self.driver

