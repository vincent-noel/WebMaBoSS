from api.views.HasProject import HasProject
from rest_framework.exceptions import NotFound, PermissionDenied

from api.models import MaBoSSSensitivityAnalysis


class HasMaBoSSSensitivity(HasProject):

	def __init__(self, *args, **kwargs):
		HasProject.__init__(self, *args, **kwargs)
		self.analysis = None

	def load(self, request, project_id, analysis_id):
		
		if request.user.is_anonymous:
			raise PermissionDenied
		
		HasProject.load(self, request, project_id)

		try:
			analysis = MaBoSSSensitivityAnalysis.objects.get(id=analysis_id)
			if analysis.project != self.project:
				raise PermissionDenied

			self.analysis = analysis

		except MaBoSSSensitivityAnalysis.DoesNotExist:
			raise NotFound
