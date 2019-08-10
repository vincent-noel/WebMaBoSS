from .TestFrontend import TestFrontend
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


class TestChrome(TestFrontend):

	def __init__(self, *args, **kwargs):

		TestFrontend.__init__(self, *args, **kwargs)
		self.driver = None

	def setUp(self):

		chrome_options = ChromeOptions()
		chrome_options.add_argument("--headless")
		chrome_options.add_argument("--no-sandbox")
		chrome_options.add_argument("--disable-dev-shm-usage")

		self.driver = webdriver.Chrome(
			executable_path='chromedriver',
			chrome_options=chrome_options,
			service_args=["--verbose", "--log-path=chromedriver.log"]
		)

		TestFrontend.setUp(self)
