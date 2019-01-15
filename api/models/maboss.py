from django.conf import settings
from django.db import models
from django.db.models.signals import pre_delete, pre_save
from django.contrib.auth.models import User

from api.models.project import Project
from api.models.logical_model import LogicalModel

from os import remove, mkdir
from os.path import join, isdir, exists, basename
from random import choice
from string import ascii_uppercase, ascii_lowercase, digits
from shutil import rmtree

def new_simulation_path(project):
	rand_string = ''.join(choice(ascii_uppercase + ascii_lowercase + digits) for _ in range(12))
	while isdir(join(settings.MEDIA_ROOT, project.path, rand_string)):
		rand_string = ''.join(choice(ascii_uppercase + ascii_lowercase + digits) for _ in range(12))
	return rand_string

def path_simulation_model(instance, filename):
	return join(instance.project.path, 'simulations', instance.path, basename(filename))

def path_sensitivityanalysis_model(instance, filename):
	return join(instance.project.path, 'sensitivity_analysis', instance.path, basename(filename))

def remove_simulation_model(sender, instance, **kwargs):
	if instance.bnd_file and exists(join(settings.MEDIA_ROOT, instance.bnd_file.path)):
		remove(join(settings.MEDIA_ROOT, instance.bnd_file.path))
	if instance.cfg_file and exists(join(settings.MEDIA_ROOT, instance.cfg_file.path)):
		remove(join(settings.MEDIA_ROOT, instance.cfg_file.path))

def remove_sensitivityanalysis_path(sender, instance, **kwargs):
	if exists(join(settings.MEDIA_ROOT, instance.path)):
		rmtree(join(settings.MEDIA_ROOT, instance.path))



def create_path(sender, instance, **kwargs):
	if not isdir(join(settings.MEDIA_ROOT, instance.project.path, 'simulations')):
		mkdir(join(settings.MEDIA_ROOT, instance.project.path, 'simulations'))

def create_path_sensitivityanalysis(sender, instance, **kwargs):
	if not isdir(join(settings.MEDIA_ROOT, instance.project.path, 'sensitivity_analysis')):
		mkdir(join(settings.MEDIA_ROOT, instance.project.path, 'sensitivity_analysis'))
class MaBoSSSimulation(models.Model):
	project = models.ForeignKey(Project, on_delete=models.CASCADE)
	model = models.ForeignKey(LogicalModel, on_delete=models.CASCADE)

	name = models.CharField(max_length=256)
	path = models.CharField(max_length=12)

	bnd_file = models.FileField(upload_to=path_simulation_model)
	cfg_file = models.FileField(upload_to=path_simulation_model)

	fptable = models.TextField(null=True)
	nodes_probtraj = models.TextField(null=True)
	states_probtraj = models.TextField(null=True)
	fixpoints = models.TextField(null=True)

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

	def save(self, *args, **kwargs):
		if self.project:
			self.path = new_simulation_path(self.project)
			super(MaBoSSSimulation, self).save(*args, **kwargs)
			if self.name.strip() == "":
				self.name = "Simulation #%d" % self.id
				super(MaBoSSSimulation, self).save(*args, **kwargs)


pre_delete.connect(remove_simulation_model, sender=MaBoSSSimulation)
pre_save.connect(create_path, sender=MaBoSSSimulation)

class MaBoSSServer(models.Model):

	user = models.ForeignKey(User, on_delete=models.CASCADE)
	host = models.CharField(max_length=256)
	port = models.IntegerField()

class MaBoSSSensitivityAnalysis(models.Model):

	project = models.ForeignKey(Project, on_delete=models.CASCADE)
	model = models.ForeignKey(LogicalModel, on_delete=models.CASCADE)

	name = models.CharField(max_length=256)
	path = models.CharField(max_length=12)

	bnd_file = models.FileField(upload_to=path_sensitivityanalysis_model)
	cfg_file = models.FileField(upload_to=path_sensitivityanalysis_model)

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

	def save(self, *args, **kwargs):
		if self.project:
			self.path = new_simulation_path(self.project)
			super(MaBoSSSensitivityAnalysis, self).save(*args, **kwargs)
			if self.name.strip() == "":
				self.name = "Sensitivity analysis #%d" % self.id
				super(MaBoSSSensitivityAnalysis, self).save(*args, **kwargs)

pre_delete.connect(remove_sensitivityanalysis_path, sender=MaBoSSSensitivityAnalysis)
pre_save.connect(create_path, sender=MaBoSSSensitivityAnalysis)

class MaBoSSSensitivitySimulation(models.Model):
	sensitivity_analysis = models.ForeignKey(MaBoSSSensitivityAnalysis, on_delete=models.CASCADE)

	name = models.CharField(max_length=256)

	fptable = models.TextField(null=True)
	nodes_probtraj = models.TextField(null=True)
	states_probtraj = models.TextField(null=True)
	fixpoints = models.TextField(null=True)

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
