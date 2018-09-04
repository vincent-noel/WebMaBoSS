from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

from django.http import Http404

from api.models import LogicalModel, Project
from api.serializers import LogicalModelSerializer


class LogicalModels(APIView):

	def get(self, request, pk):

		if request.user.is_anonymous:
			raise PermissionDenied

		if Project.objects.filter(user=request.user, id=pk).exists():

			models = LogicalModel.objects.filter(
				project=Project.objects.get(user=request.user, id=pk)
			)
			serializer = LogicalModelSerializer(models, many=True)

			return Response(serializer.data)
		else:
			raise Http404

	def post(self, request):

		if request.user.is_anonymous:
			raise PermissionDenied

		if Project.objects.filter(user=request.user, id=int(request.data['project'])).exists():

			LogicalModel(
				project=Project.objects.get(user=request.user, id=int(request.data['project'])),
				name=request.data['name'],
				file=request.data['file']
			).save()

			return Response(status=status.HTTP_200_OK)

		else:
			raise Http404


	def delete(self, request, pk=None, format=None):

		if request.user.is_anonymous:
			raise PermissionDenied
		try:
			if Project.objects.filter(user=request.user, id=int(request.data['project'])).exists():

				model = LogicalModel.objects.get(
					project=Project.objects.get(user=request.user, id=int(request.data['project'])),
					id=request.data['id']
				)
				model.delete()
			else:
				raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404

		return Response(status=status.HTTP_200_OK)
