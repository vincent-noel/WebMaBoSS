from django.conf import settings
from django.db import models
from django.db.models.signals import pre_delete, post_save
from django.contrib.auth.models import User

from random import choice
from string import ascii_uppercase, ascii_lowercase, digits
from os import remove, mkdir
from os.path import join, isdir
from shutil import rmtree

def add_default_project(sender, instance, **kwargs):
	if len(Project.objects.filter(user=instance)) == 0:
		default_project = Project(user=instance, name="My Project")
		default_project.save()

def new_project_path():
	rand_string = ''.join(choice(ascii_uppercase + ascii_lowercase + digits) for _ in range(12))
	while isdir(join(settings.MEDIA_ROOT, rand_string)):
		rand_string = ''.join(choice(ascii_uppercase + ascii_lowercase + digits) for _ in range(12))
	mkdir(join(settings.MEDIA_ROOT, rand_string))
	return rand_string


def remove_project_path(sender, instance, **kwargs):
	if isdir(join(settings.MEDIA_ROOT, instance.path)):
		rmtree(join(settings.MEDIA_ROOT, instance.path))


def path_logical_model(instance, filename):
	return join(instance.user.project.path, 'logical_models', filename)


def remove_logical_model(sender, instance, **kwargs):
	if instance.file:
		remove(join(settings.MEDIA_ROOT, instance.file.path))


def remove_simulation_model(sender, instance, **kwargs):
	if instance.model_file:
		remove(join(settings.MEDIA_ROOT, instance.model_file.path))



class Project(models.Model):

	user = models.ForeignKey(User, on_delete=models.CASCADE)
	name = models.CharField(max_length=256)
	description = models.CharField(max_length=102400, blank=True)
	path = models.CharField(max_length=256, default=new_project_path)


pre_delete.connect(remove_project_path, sender=Project)
post_save.connect(add_default_project, sender=User)

class LogicalModel(models.Model):

	project = models.ForeignKey(Project, on_delete=models.CASCADE)
	name = models.CharField(max_length=256)
	file = models.FileField(upload_to=path_logical_model)


pre_delete.connect(remove_logical_model, sender=LogicalModel)


class MaBoSSSimulation(models.Model):

	project = models.ForeignKey(Project, on_delete=models.CASCADE)
	model_file = models.FileField(upload_to=path_logical_model)

	fptable = models.CharField(max_length=102400, null=True)
	nodes_probtraj = models.CharField(max_length=102400, null=True)
	states_probtraj = models.CharField(max_length=102400, null=True)
	fixpoints = models.CharField(max_length=102400, null=True)

	QUEUED = 'Queued'
	INTERRUPTED = 'Interrupted'
	BUSY = 'Running'
	ENDED = 'Finished'
	ERROR = 'Failed'

	STATUSES = (
		(QUEUED, 'Queued'),
		(INTERRUPTED, 'Interrupted'),
		(BUSY, 'Busy'),
		(ENDED, 'Ended'),
		(ERROR, 'Error')
	)

	status = models.CharField(max_length=15, choices=STATUSES, default=QUEUED)
	error = models.CharField(max_length=255, default="", null=True)


pre_delete.connect(remove_simulation_model, sender=MaBoSSSimulation)

