from api.views.HasProject import HasProject
from rest_framework.exceptions import NotFound, PermissionDenied

from api.models import MaBoSSSimulation


class HasMaBoSSSimulation(HasProject):

	def __init__(self, *args, **kwargs):
		HasProject.__init__(self, *args, **kwargs)
		self.simulation = None

	def load(self, request, project_id, simulation_id):

		HasProject.load(self, request, project_id)

		try:
			simulation = MaBoSSSimulation.objects.get(id=simulation_id)
			if simulation.project != self.project:
				raise PermissionDenied

			self.simulation = simulation

		except MaBoSSSimulation.DoesNotExist:
			raise NotFound
