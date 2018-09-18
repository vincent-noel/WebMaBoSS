from django.conf import settings
from django.db import models
from django.db.models.signals import pre_delete
from django.contrib.auth.models import User

from api.models.project import Project
from api.models.logical_model import LogicalModel

from os import remove
from os.path import join


def path_simulation_model(instance, filename):
	return join(instance.project.path, 'simulations', filename)


def remove_simulation_model(sender, instance, **kwargs):
	if instance.model_file:
		remove(join(settings.MEDIA_ROOT, instance.model_file.path))


class MaBoSSSimulation(models.Model):

	project = models.ForeignKey(Project, on_delete=models.CASCADE)
	model = models.ForeignKey(LogicalModel, on_delete=models.CASCADE)
	model_file = models.FileField(upload_to=path_simulation_model)

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

class MaBoSSServer(models.Model):

	user = models.ForeignKey(User, on_delete=models.CASCADE)
	host = models.CharField(max_length=256)
	port = models.IntegerField()
