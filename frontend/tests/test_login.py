from .TestChrome import TestChrome
from .TestFirefox import TestFirefox

from rest_framework.authtoken.models import Token


class TestLoginChrome (TestChrome):

	fixtures = ['user.json']

	def testLogin(self):

		driver = self.get("/")

		self.assertIsNone(driver.execute_script("return window.sessionStorage.getItem('api_key');"))

		login_link = self.getByXPath("/html/body/section/div/nav/div/ul/li[1]/a")
		self.assertEqual(login_link.get_attribute('innerHTML'), 'Sign in')

		login_link.click()
		self.assertCurrentURL('/login/')

		self.getById('username').send_keys('admin')
		self.getById('password').send_keys('test_password')
		self.getById('submit_login').click()

		self.assertCurrentURL('/')
		self.assertIsNotNone(driver.execute_script("return window.sessionStorage.getItem('api_key');"))
		self.assertEqual(
			driver.execute_script("return window.sessionStorage.getItem('api_key');"),
			Token.objects.get(user_id=1).key
		)

		logout_link = self.getByXPath("/html/body/section/div/nav/div[2]/ul/li[2]/a")
		self.assertEqual(logout_link.get_attribute('innerHTML'), "Logout")
		logout_link.click()

		self.assertCurrentURL('/login/')
		self.assertIsNone(driver.execute_script("return window.sessionStorage.getItem('api_key');"))


class TestLoginFirefox(TestFirefox):

	fixtures = ['user.json']

	def testLogin(self):

		driver = self.get("/")
		self.assertIsNone(driver.execute_script("return window.sessionStorage.getItem('api_key');"))

		login_link = self.getByXPath("/html/body/section/div/nav/div/ul/li[1]/a")
		self.assertEqual(login_link.get_attribute('innerHTML'), 'Sign in')

		login_link.click()
		self.assertCurrentURL('/login/')

		self.getById('username').send_keys('admin')
		self.getById('password').send_keys('test_password')
		self.getById('submit_login').click()

		self.assertCurrentURL('/')
		self.assertIsNotNone(driver.execute_script("return window.sessionStorage.getItem('api_key');"))
		self.assertEqual(
			driver.execute_script("return window.sessionStorage.getItem('api_key');"),
			Token.objects.get(user_id=1).key
		)

		logout_link = self.getByXPath("/html/body/section/div/nav/div[2]/ul/li[2]/a")
		self.assertEqual(logout_link.get_attribute('innerHTML'), "Logout")
		logout_link.click()

		self.assertCurrentURL('/login/')
		self.assertIsNone(driver.execute_script("return window.sessionStorage.getItem('api_key');"))
