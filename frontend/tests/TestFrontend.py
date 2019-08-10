from django.contrib.staticfiles.testing import StaticLiveServerTestCase
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from rest_framework.authtoken.models import Token


class TestFrontend(StaticLiveServerTestCase):

	def __init__(self, *args, **kwargs):

		StaticLiveServerTestCase.__init__(self, *args, **kwargs)
		self.driver = None

	def setUp(self):
		if self.driver is not None:
			self.wait = WebDriverWait(self.driver, 2)

	def tearDown(self):
		self.driver.quit()

	def get(self, url):
		self.driver.get(self.live_server_url + url)
		return self.driver

	def assertCurrentURL(self, url):
		self.wait.until(EC.url_to_be(self.live_server_url + url))
		self.assertEqual(self.driver.current_url, self.live_server_url + url)

	def login(self):
		self.driver = self.get("/login/")
		self.getById('username').send_keys('admin')
		self.getById('password').send_keys('test_password')
		self.getById('submit_login').click()
		self.assertCurrentURL('/')
		self.assertEqual(
			self.driver.execute_script("return window.sessionStorage.getItem('api_key');"),
			Token.objects.get(user_id=1).key
		)

	def getByXPath(self, xpath):
		self.wait.until(EC.presence_of_element_located((By.XPATH, xpath)))
		return self.driver.find_element_by_xpath(xpath)

	def getById(self, id):
		self.wait.until(EC.presence_of_element_located((By.ID, id)))
		return self.driver.find_element_by_id(id)
