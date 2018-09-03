from .TestChrome import TestChrome
from .TestFirefox import TestFirefox

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from time import sleep


class TestLoginChrome (TestChrome):

	fixtures = ['user.json']

	def testLogin(self):

		driver = self.get("/login/")
		self.assertCurrentURL('/login/')

		driver.find_element_by_id('username').send_keys('admin')
		driver.find_element_by_id('password').send_keys('test_password')
		driver.find_element_by_id('submit_login').click()

		sleep(1)
		self.assertCurrentURL('/')


class TestLoginFirefox(TestFirefox):

	fixtures = ['user.json']

	def testLogin(self):

		driver = self.get("/login/")

		driver.find_element_by_id('username').send_keys('admin')
		driver.find_element_by_id('password').send_keys('test_password')
		driver.find_element_by_id('submit_login').click()

		sleep(1)
		self.assertCurrentURL('/')
