from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

from django.http import Http404, FileResponse
from django.conf import settings

from api.models import LogicalModel, Project
from api.serializers import LogicalModelSerializer
from os.path import join, basename


class LogicalModels(APIView):

	def get(self, request, project, model=None):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			t_project = Project.objects.get(id=project)

			if t_project.user != request.user:
				raise PermissionDenied

			if model is None:

				models = LogicalModel.objects.filter(
					project=t_project
				)
				serializer = LogicalModelSerializer(models, many=True)

				return Response(serializer.data)

			else:
				t_model = LogicalModel.objects.get(project=t_project, id=model)

				return FileResponse(
					open(join(settings.MEDIA_ROOT, t_model.file.path), 'rb'),
					as_attachment=True, filename=basename(t_model.file.path)
				)

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404


	def post(self, request, project):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			t_project = Project.objects.get(id=project)

			if t_project.user != request.user:
				raise PermissionDenied

			LogicalModel(
				project=t_project,
				name=request.data['name'],
				file=request.data['file']
			).save()

			return Response(status=status.HTTP_200_OK)

		except Project.DoesNotExist:
			raise Http404


	def delete(self, request, project, model):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			t_project = Project.objects.get(id=project)

			if t_project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(
				project=t_project,
				id=request.data['id']
			)
			model.delete()

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404

		return Response(status=status.HTTP_200_OK)
