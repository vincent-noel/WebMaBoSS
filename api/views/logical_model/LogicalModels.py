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

	def get(self, request, project_id, model_id=None):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			if model_id is None:

				models = LogicalModel.objects.filter(
					project=project
				)
				serializer = LogicalModelSerializer(models, many=True)

				return Response(serializer.data)

			else:
				model = LogicalModel.objects.get(project=project, id=model_id)
				serializer = LogicalModelSerializer(model)

				return Response(serializer.data)

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404


	def post(self, request, project_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			if 'file2' in request.data.keys():
				LogicalModel(
					project=project,
					name=request.data['name'],
					bnd_file=request.data['file'],
					cfg_file=request.data['file2'],
					format=LogicalModel.MABOSS
				).save()

			else:
				LogicalModel(
					project=project,
					name=request.data['name'],
					file=request.data['file'],
					format=LogicalModel.ZGINML
				).save()

			return Response(status=status.HTTP_200_OK)

		except Project.DoesNotExist:
			raise Http404


	def delete(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(
				project=project,
				id=model_id
			)
			model.delete()

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404

		return Response(status=status.HTTP_200_OK)
