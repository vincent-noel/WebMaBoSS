from django.core.management.base import BaseCommand

from api.models import LogicalModel, Project
from api.models.common import create_guest_account
from api.models.logical_model import add_demo_models


class Command(BaseCommand):
	help = "Resets the demo project shown to anonymous users : its models are replaced by fresh copies of the demo models"

	def handle(self, *args, **options):

		guest_account = create_guest_account()
		demo_project = Project.objects.filter(user=guest_account).first()

		# Also removes their simulations, and their files
		for model in LogicalModel.objects.filter(project=demo_project):
			self.stdout.write("Removing %s" % model.name)
			model.delete()

		add_demo_models(demo_project)
		for model in LogicalModel.objects.filter(project=demo_project):
			self.stdout.write("Added %s" % model.name)
