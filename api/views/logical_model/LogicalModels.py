from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, NotFound

from api.models import LogicalModel
from api.serializers import LogicalModelSerializer
from api.views.HasProject import HasProject


class LogicalModels(HasProject):

	def get(self, request, project_id, model_id=None):

		HasProject.load(self, request, project_id)

		try:
			if model_id is None:

				models = LogicalModel.objects.filter(
					project=self.project
				)
				serializer = LogicalModelSerializer(models, many=True)

				return Response(serializer.data)

			else:
				model = LogicalModel.objects.get(id=model_id)

				if model.project != self.project:
					raise PermissionDenied

				serializer = LogicalModelSerializer(model)

				return Response(serializer.data)

		except LogicalModel.DoesNotExist:
			raise NotFound


	def post(self, request, project_id):

		HasProject.load(self, request, project_id)

		if 'file2' in request.data.keys():
			LogicalModel(
				project=self.project,
				name=request.data['name'],
				bnd_file=request.data['file'],
				cfg_file=request.data['file2'],
				format=LogicalModel.MABOSS
			).save()

		else:
			LogicalModel(
				project=self.project,
				name=request.data['name'],
				file=request.data['file'],
				format=LogicalModel.ZGINML
			).save()

		return Response(status=status.HTTP_200_OK)


	def delete(self, request, project_id, model_id):

		HasProject.load(self, request, project_id)

		try:
			model = LogicalModel.objects.get(id=model_id)

			if model.project != self.project:
				raise PermissionDenied

			model.delete()

		except LogicalModel.DoesNotExist:
			raise NotFound

		return Response(status=status.HTTP_200_OK)
