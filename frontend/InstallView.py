#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Copyright 2014-2017 Vincent Noel (vincent.noel@butantan.gov.br)
#
# This file is part of libSigNetSim.
#
# libSigNetSim is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# libSigNetSim is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with libSigNetSim.  If not, see <http://www.gnu.org/licenses/>.

""" InstallView.py
	This file is the installation script. It will create an admin user, and create the Settings object
"""

from django.views.generic import TemplateView
from django.conf import settings as django_settings
from django.contrib.auth.models import User
from os import utime
from os.path import join
from threading import Thread
import yaml
from string import ascii_uppercase, ascii_lowercase, digits
from random import choice


class InstallView(TemplateView):
	template_name = 'frontend/install.html'

	def __init__(self, **kwargs):

		TemplateView.__init__(self, **kwargs)
		self.install_done = False


	def get_context_data(self, **kwargs):

		kwargs['install_done'] = self.install_done
		return kwargs


	def post(self, request, *args, **kwargs):

		# print("Here we are")

		username = request.POST.get('admin_username')
		email = request.POST.get('admin_email')
		password1 = request.POST.get('admin_password1')
		password2 = request.POST.get('admin_password2')

		# print(request.POST)
		self.install_done = True
		if username is not None and email is not None and password1 is not None and password1 == password2:
			admin = User.objects.create_superuser(username, email, password1)
			secret_key = ''.join(choice(ascii_uppercase + ascii_lowercase + digits) for _ in range(60))

			settings = {
				'admin': admin.username,
				'admin_address': admin.email,
				'secret_key': secret_key,
				'allowed_hosts': ['*'],
			}

			with open(join(django_settings.BASE_DIR, "data", "settings", "config.yml"), "w") as settings_file:
				settings_file.write(yaml.dump(settings))

			thread = ReloadConf()
			thread.start()
			self.install_done = True
		return TemplateView.get(self, request, *args, **kwargs)


class ReloadConf(Thread):

	"""Thread just to reload the django conf after returning the page"""

	def __init__(self):
		Thread.__init__(self)

	def run(self):
		utime(join(django_settings.BASE_DIR, "settings/wsgi.py"), None)
