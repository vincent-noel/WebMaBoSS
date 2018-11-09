from api.views.HasUser import HasUser
from rest_framework.exceptions import PermissionDenied, NotFound

from api.models import Project


class HasProject(HasUser):

	def __init__(self, *args, **kwargs):
		HasUser.__init__(self, *args, **kwargs)
		self.project = None

	def load(self, request, project_id):

		HasUser.load(self, request)

		try:
			project = Project.objects.get(id=project_id)

			if project.user != self.user:
				raise PermissionDenied

			self.project = project

		except Project.DoesNotExist:
			raise NotFound

