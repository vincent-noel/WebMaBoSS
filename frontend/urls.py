from django.urls import path, re_path
from . import views

urlpatterns = [

	path('', views.index, name="home"),
	path('login/', views.index, name="login"),
	path('logout/', views.index, name="logout"),
	path('profile/', views.index, name="profile"),
	path('register/', views.index, name="register"),
	path('models/', views.index, name="models"),
	path('data/', views.index, name="data"),
	re_path('model/.*', views.index, name="model"),
	# re_path('images/.*', views.index, name="images"),
]