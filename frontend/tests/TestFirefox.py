from .TestFrontend import TestFrontend
from selenium import webdriver
from selenium.webdriver.firefox.options import Options as FireFoxOptions


class TestFirefox(TestFrontend):

	def __init__(self, *args, **kwargs):
		TestFrontend.__init__(self, *args, **kwargs)
		self.driver = None

	def setUp(self):

		options = FireFoxOptions()
		options.add_argument('-headless')
		self.driver = webdriver.Firefox(
			firefox_options=options,
			executable_path='geckodriver'
		)

		TestFrontend.setUp(self)
