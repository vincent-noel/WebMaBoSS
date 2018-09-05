from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

from django.http import Http404
from django.conf import settings

from api.models import LogicalModel, Project

from os.path import join

class LogicalModelSteadyStates(APIView):

	def get(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)
			import ginsim
			path = join(settings.MEDIA_ROOT, model.file.path)
			ginsim_model = ginsim.load(path)

			import biolqm
			biolqm_model = ginsim.to_biolqm(ginsim_model)
			ss = biolqm.fixpoints(biolqm_model)
			return Response(ss, status=status.HTTP_200_OK)

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404
