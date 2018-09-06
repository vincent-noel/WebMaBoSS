from django.conf import settings
from django.db import models
from django.db.models.signals import pre_delete

from api.models.project import Project

from os import remove
from os.path import join


def path_logical_model(instance, filename):
	return join(instance.project.path, 'logical_models', filename)


def remove_logical_model(sender, instance, **kwargs):
	if instance.file:
		remove(join(settings.MEDIA_ROOT, instance.file.path))


class LogicalModel(models.Model):

	project = models.ForeignKey(Project, on_delete=models.CASCADE)
	name = models.CharField(max_length=256)
	file = models.FileField(upload_to=path_logical_model)


pre_delete.connect(remove_logical_model, sender=LogicalModel)
