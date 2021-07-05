from django.conf import settings
from django.db import models
from django.db.models.signals import pre_delete, post_save
from django.contrib.auth.models import User
# from api.models.logical_model import LogicalModel

from random import choice
from string import ascii_uppercase, ascii_lowercase, digits
from os import remove, mkdir
from os.path import join, isdir
from shutil import rmtree

def add_default_project(sender, instance, **kwargs):
	if len(Project.objects.filter(user=instance)) == 0:
		default_project = Project(user=instance, name="My Project")
		default_project.save()
		return default_project
		# add_default_models(default_project)	

def new_project_path():
	rand_string = ''.join(choice(ascii_uppercase + ascii_lowercase + digits) for _ in range(12))
	while isdir(join(settings.MEDIA_ROOT, rand_string)):
		rand_string = ''.join(choice(ascii_uppercase + ascii_lowercase + digits) for _ in range(12))
	mkdir(join(settings.MEDIA_ROOT, rand_string))
	return rand_string


def remove_project_path(sender, instance, **kwargs):
	if isdir(join(settings.MEDIA_ROOT, instance.path)):
		rmtree(join(settings.MEDIA_ROOT, instance.path))


class Project(models.Model):

	user = models.ForeignKey(User, on_delete=models.CASCADE)
	name = models.CharField(max_length=256)
	description = models.CharField(max_length=10240, blank=True)
	path = models.CharField(max_length=256, default=new_project_path)


pre_delete.connect(remove_project_path, sender=Project)
# post_save.connect(add_default_project, sender=User)
