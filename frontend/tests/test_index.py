from selenium.webdriver import Firefox
from selenium.webdriver.firefox.options import Options


from pyvirtualdisplay import Display
display = Display(visible=0, size=(800, 600))
display.start()
print('display running')
options = Options()
options.add_argument('-headless')
browser = Firefox(firefox_options=options)
print('firefox running')
# browser = webdriver.Firefox()
browser.get('http://localhost:8000')
print('got the index page')
assert 'App Curie' == browser.title
print(browser.title)
browser.stop()
display.stop()