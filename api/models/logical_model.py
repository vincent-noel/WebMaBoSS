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
	if instance.file is not None and exists(join(settings.MEDIA_ROOT, instance.file.path)):
		rmtree(dirname(join(settings.MEDIA_ROOT, instance.file.path)))
	if instance.bnd_file is not None and exists(join(settings.MEDIA_ROOT, instance.bnd_file.path)):
		rmtree(dirname(join(settings.MEDIA_ROOT, instance.bnd_file.path)))
	if instance.cfg_file is not None and exists(join(settings.MEDIA_ROOT, instance.cfg_file.path)):
		rmtree(dirname(join(settings.MEDIA_ROOT, instance.cfg_file.path)))


class LogicalModel(models.Model):

	project = models.ForeignKey(Project, on_delete=models.CASCADE)
	name = models.CharField(max_length=256)
	path = models.CharField(max_length=12, default=new_model_path)
	file = models.FileField(upload_to=path_logical_model, blank=True)

	bnd_file = models.FileField(upload_to=path_logical_model, blank=True)
	cfg_file = models.FileField(upload_to=path_logical_model, blank=True)

pre_delete.connect(remove_logical_model, sender=LogicalModel)


def path_tagged_logical_model(instance, filename):
	return join(instance.model.project.path, 'logical_models', instance.model.path, instance.tag, basename(filename))


class TaggedLogicalModel(models.Model):

	model = models.ForeignKey(LogicalModel, on_delete=models.CASCADE)
	tag = models.CharField(max_length=256)

	file = models.FileField(upload_to=path_tagged_logical_model, blank=True)
	bnd_file = models.FileField(upload_to=path_tagged_logical_model, blank=True)
	cfg_file = models.FileField(upload_to=path_tagged_logical_model, blank=True)

pre_delete.connect(remove_logical_model, sender=TaggedLogicalModel)
