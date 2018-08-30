from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

from django.http import Http404

from api.models import LogicalModel
from api.serializers import LogicalModelSerializer


class LogicalModels(APIView):

	def get(self, request, format=None):

		if request.user.is_anonymous:
			raise PermissionDenied

		models = LogicalModel.objects.filter(user=request.user)
		serializer = LogicalModelSerializer(models, many=True)

		return Response(serializer.data)


	def post(self, request):

		if request.user.is_anonymous:
			raise PermissionDenied

		LogicalModel(
			user=request.user,
			name=request.data['name'],
			file=request.data['file']
		).save()

		return Response(status=status.HTTP_200_OK)


	def delete(self, request, pk=None, format=None):

		if request.user.is_anonymous:
			raise PermissionDenied
		try:
			model = LogicalModel.objects.get(user=request.user, id=request.data['id'])
			model.delete()

		except LogicalModel.DoesNotExist:
			raise Http404

		return Response(status=status.HTTP_200_OK)
