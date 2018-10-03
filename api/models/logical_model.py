from django.conf import settings
from django.db import models
from django.db.models.signals import pre_delete

from api.models.project import Project

from random import choice
from string import ascii_uppercase, ascii_lowercase, digits
from os.path import join, exists, basename, dirname, isdir
from shutil import rmtree

def new_model_path():
	rand_string = ''.join(choice(ascii_uppercase + ascii_lowercase + digits) for _ in range(12))
	while isdir(join(settings.MEDIA_ROOT, rand_string)):
		rand_string = ''.join(choice(ascii_uppercase + ascii_lowercase + digits) for _ in range(12))
	return rand_string

def path_logical_model(instance, filename):
	return join(instance.project.path, 'logical_models', instance.path, filename)


def remove_logical_model(sender, instance, **kwargs):
	if exists(join(settings.MEDIA_ROOT, instance.file.path)):
		rmtree(dirname(join(settings.MEDIA_ROOT, instance.file.path)))


class LogicalModel(models.Model):

	project = models.ForeignKey(Project, on_delete=models.CASCADE)
	name = models.CharField(max_length=256)
	path = models.CharField(max_length=12, default=new_model_path)
	file = models.FileField(upload_to=path_logical_model)


pre_delete.connect(remove_logical_model, sender=LogicalModel)


def path_tagged_logical_model(instance, filename):
	return join(instance.model.project.path, 'logical_models', instance.model.path, instance.tag, basename(filename))


class TaggedLogicalModel(models.Model):

	model = models.ForeignKey(LogicalModel, on_delete=models.CASCADE)
	tag = models.CharField(max_length=256)
	file = models.FileField(upload_to=path_tagged_logical_model)


pre_delete.connect(remove_logical_model, sender=TaggedLogicalModel)
