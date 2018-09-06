from .TestChrome import TestChrome
from .TestFirefox import TestFirefox

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from rest_framework.authtoken.models import Token

from time import sleep


class TestLoginChrome (TestChrome):

	fixtures = ['user.json']

	def testLogin(self):

		driver = self.get("/")
		sleep(1)

		self.assertIsNone(driver.execute_script("return window.sessionStorage.getItem('api_key');"))

		login_link = driver.find_element_by_xpath("/html/body/section/div/nav/div/ul/li[1]/a")
		self.assertEqual(login_link.get_attribute('innerHTML'), 'Sign in')
		login_link.click()

		self.assertCurrentURL('/login/')

		driver.find_element_by_id('username').send_keys('admin')
		driver.find_element_by_id('password').send_keys('test_password')
		driver.find_element_by_id('submit_login').click()
		sleep(1)

		self.assertCurrentURL('/')

		self.assertIsNotNone(driver.execute_script("return window.sessionStorage.getItem('api_key');"))
		self.assertEqual(
			driver.execute_script("return window.sessionStorage.getItem('api_key');"),
			Token.objects.get(user_id=1).key
		)

		logout_link = driver.find_element_by_xpath("/html/body/section/div/nav/div[2]/ul/li[2]/a")
		self.assertEqual(logout_link.get_attribute('innerHTML'), "Logout")
		logout_link.click()

		sleep(1)

		self.assertCurrentURL('/login/')
		self.assertIsNone(driver.execute_script("return window.sessionStorage.getItem('api_key');"))


class TestLoginFirefox(TestFirefox):

	fixtures = ['user.json']

	def testLogin(self):

		driver = self.get("/")
		sleep(1)

		self.assertIsNone(driver.execute_script("return window.sessionStorage.getItem('api_key');"))

		login_link = driver.find_element_by_xpath("/html/body/section/div/nav/div/ul/li[1]/a")
		self.assertEqual(login_link.get_attribute('innerHTML'), 'Sign in')
		login_link.click()

		self.assertCurrentURL('/login/')

		driver.find_element_by_id('username').send_keys('admin')
		driver.find_element_by_id('password').send_keys('test_password')
		driver.find_element_by_id('submit_login').click()
		sleep(1)

		self.assertCurrentURL('/')
		self.assertIsNotNone(driver.execute_script("return window.sessionStorage.getItem('api_key');"))
		self.assertEqual(
			driver.execute_script("return window.sessionStorage.getItem('api_key');"),
			Token.objects.get(user_id=1).key
		)

		logout_link = driver.find_element_by_xpath("/html/body/section/div/nav/div[2]/ul/li[2]/a")
		self.assertEqual(logout_link.get_attribute('innerHTML'), "Logout")
		logout_link.click()

		sleep(1)

		self.assertCurrentURL('/login/')
		self.assertIsNone(driver.execute_script("return window.sessionStorage.getItem('api_key');"))
