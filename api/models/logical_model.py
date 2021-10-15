from django.conf import settings
from django.db import models
from django.db.models.signals import pre_delete, post_save
from django.core.files import File

from api.models.project import Project, add_default_project
from django.contrib.auth.models import User

from random import choice
from string import ascii_uppercase, ascii_lowercase, digits
from os.path import join, exists, basename, dirname, isdir
from shutil import rmtree

def new_model_path(project):
	rand_string = ''.join(choice(ascii_uppercase + ascii_lowercase + digits) for _ in range(12))
	while isdir(join(settings.MEDIA_ROOT, project.path, rand_string)):
		rand_string = ''.join(choice(ascii_uppercase + ascii_lowercase + digits) for _ in range(12))

	return rand_string

def path_logical_model(instance, filename):
	return join(instance.project.path, 'logical_models', instance.path, basename(filename))

def remove_logical_model(sender, instance, **kwargs):
	if instance.format == LogicalModel.ZGINML and instance.file and exists(join(settings.MEDIA_ROOT, instance.file.path)):
		rmtree(dirname(join(settings.MEDIA_ROOT, instance.file.path)))
	elif instance.format == LogicalModel.MABOSS:
		if instance.bnd_file and exists(join(settings.MEDIA_ROOT, instance.bnd_file.path)):
			rmtree(dirname(join(settings.MEDIA_ROOT, instance.bnd_file.path)))
		if instance.cfg_file and exists(join(settings.MEDIA_ROOT, instance.cfg_file.path)):
			rmtree(dirname(join(settings.MEDIA_ROOT, instance.cfg_file.path)))

class LogicalModel(models.Model):

	project = models.ForeignKey(Project, on_delete=models.CASCADE)
	name = models.CharField(max_length=256)
	path = models.CharField(max_length=12)

	ZGINML = 'ZGinML'
	MABOSS = 'MaBoSS'
	SBML = 'SBML'

	FORMATS = (
		(ZGINML, 'ZGinML'),
		(MABOSS, 'MaBoSS'),
		(SBML, 'SBML')
	)

	format = models.CharField(max_length=10, choices=FORMATS, default=ZGINML)

	file = models.FileField(upload_to=path_logical_model, blank=True)

	bnd_file = models.FileField(upload_to=path_logical_model, blank=True)
	cfg_file = models.FileField(upload_to=path_logical_model, blank=True)

	layout_file = models.FileField(upload_to=path_logical_model, blank=True)

	def save(self, *args, **kwargs):

		if self.project:
			self.path = new_model_path(self.project)
			super(LogicalModel, self).save(*args, **kwargs)
			
pre_delete.connect(remove_logical_model, sender=LogicalModel)


def path_tagged_logical_model(instance, filename):
	return join(instance.model.project.path, 'logical_models', instance.model.path, instance.tag, basename(filename))

def remove_tagged_logical_model(sender, instance, **kwargs):
	if instance.model.format == LogicalModel.ZGINML and exists(join(settings.MEDIA_ROOT, instance.file.path)):
		rmtree(dirname(join(settings.MEDIA_ROOT, instance.file.path)))
	elif instance.model.format == LogicalModel.MABOSS:
		if exists(join(settings.MEDIA_ROOT, instance.bnd_file.path)):
			rmtree(dirname(join(settings.MEDIA_ROOT, instance.bnd_file.path)))
		if exists(join(settings.MEDIA_ROOT, instance.cfg_file.path)):
			rmtree(dirname(join(settings.MEDIA_ROOT, instance.cfg_file.path)))

class TaggedLogicalModel(models.Model):

	model = models.ForeignKey(LogicalModel, on_delete=models.CASCADE)
	tag = models.CharField(max_length=256)

	file = models.FileField(upload_to=path_tagged_logical_model, blank=True)
	bnd_file = models.FileField(upload_to=path_tagged_logical_model, blank=True)
	cfg_file = models.FileField(upload_to=path_tagged_logical_model, blank=True)

pre_delete.connect(remove_tagged_logical_model, sender=TaggedLogicalModel)
	
def add_default_models(sender, instance, **kwargs):
	
	default_project = add_default_project(sender, instance, **kwargs)
	if default_project is not None:
		metastasis_path = join(settings.BASE_DIR, "api", "defaults", "models", "metastasis")
		LogicalModel(
			project=default_project,
			name="Cohen2015 - Tumour Cell Invasion and Migration",
			bnd_file=File(open(join(metastasis_path, "metastasis.bnd"), 'rb'), name="metastasis.bnd"),
			cfg_file=File(open(join(metastasis_path, "metastasis.cfg"), 'rb'), name="metastasis.cfg"),
			format=LogicalModel.MABOSS			
		).save()
		
		corral_path = join(settings.BASE_DIR, "api", "defaults", "models", "corral")
		LogicalModel(
			project=default_project,
			name="Corral2021 - Interplay between SMAD2 and STAT5A regulating IL-17A/F expression in Th cells",
			bnd_file=File(open(join(corral_path, "corral.bnd"), 'rb'), name="corral.bnd"),
			cfg_file=File(open(join(corral_path, "corral.cfg"), 'rb'), name="corral.cfg"),
			format=LogicalModel.MABOSS			
		).save()
	


post_save.connect(add_default_models, sender=User)