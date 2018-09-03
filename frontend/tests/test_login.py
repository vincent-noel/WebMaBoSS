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

		driver = self.get("/")

		self.assertTrue(driver.execute_script("return window.sessionStorage.getItem('api_key');") is None)

		driver.find_element_by_xpath("/html/body/section/div/nav/div/ul/li[1]/a").click()

		self.assertCurrentURL('/login/')

		driver.find_element_by_id('username').send_keys('admin')
		driver.find_element_by_id('password').send_keys('test_password')
		driver.find_element_by_id('submit_login').click()

		sleep(1)
		self.assertCurrentURL('/')

		self.assertTrue(driver.execute_script("return window.sessionStorage.getItem('api_key');") is not None)

		driver.find_element_by_xpath("/html/body/section/div/nav/div[2]/ul/li[2]/a").click()
		sleep(1)

		self.assertCurrentURL('/login/')


class TestLoginFirefox(TestFirefox):

	fixtures = ['user.json']

	def testLogin(self):

		driver = self.get("/")

		self.assertTrue(driver.execute_script("return window.sessionStorage.getItem('api_key');") is None)

		driver.find_element_by_xpath("/html/body/section/div/nav/div/ul/li[1]/a").click()

		self.assertCurrentURL('/login/')

		driver.find_element_by_id('username').send_keys('admin')
		driver.find_element_by_id('password').send_keys('test_password')
		driver.find_element_by_id('submit_login').click()

		sleep(1)
		self.assertCurrentURL('/')
		self.assertTrue(driver.execute_script("return window.sessionStorage.getItem('api_key');") is not None)

		driver.find_element_by_xpath("/html/body/section/div/nav/div[2]/ul/li[2]/a").click()

		sleep(1)

		self.assertCurrentURL('/login/')
