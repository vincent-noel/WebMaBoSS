from django.conf import settings
from django.db import models
from django.db.models.signals import pre_delete
from django.contrib.auth.models import User
from os import remove
from os.path import join

def path_logical_model(instance, filename):

	return join(instance.user.username, 'logical_models', filename)

def remove_logical_model(sender, instance, **kwargs):

	if instance.file:
		remove(join(settings.MEDIA_ROOT, instance.file.path))


# Create your models here.
class LogicalModel(models.Model):

	user = models.ForeignKey(User, on_delete=models.CASCADE)
	name = models.CharField(max_length=256)
	file = models.FileField(upload_to=path_logical_model)

pre_delete.connect(remove_logical_model, sender=LogicalModel)



class MaBoSSSimulation(models.Model):

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