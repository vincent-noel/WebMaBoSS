from django.test import TestCase, LiveServerTestCase
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FireFoxOptions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException


class TestModel(LiveServerTestCase):

	def testChrome(self):


		chrome_options = ChromeOptions()
		chrome_options.add_argument("--headless")
		chrome_options.add_argument("--no-sandbox")
		chrome_options.add_argument("--disable-dev-shm-usage")
		chrome_options.binary_location = '/usr/bin/google-chrome'

		driver = webdriver.Chrome(
			executable_path='/usr/bin/chromedriver',
			chrome_options=chrome_options
		)
		driver.get(self.live_server_url)

		print('Title is: ' + driver.title)
		print(dir(driver))

		# try:
		# 	WebDriverWait(driver, 10).until(lambda x: 'Page 1' in driver.title or 'Page 2' in driver.title)
		# except TimeoutException as e:
		# 	pass

		driver.quit()

	def testFirefox(self):

		from selenium import webdriver

		options = FireFoxOptions()
		options.add_argument('-headless')
		driver = webdriver.Firefox(
			firefox_options=options,
			executable_path='geckodriver'
		)

		driver.get(self.live_server_url)

		print('Title is: ' + driver.title)
		print(dir(driver))

		driver.quit()
