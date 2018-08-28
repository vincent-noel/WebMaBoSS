from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404

from api.models import LogicalModel
from api.serializers import LogicalModelSerializer


class LogicalModels(APIView):

	def get(self, request, format=None):
		models = LogicalModel.objects.all()
		serializer = LogicalModelSerializer(models, many=True)
		return Response(serializer.data)

	def post(self, request):

		try:
			model = LogicalModel(
				name=request.data['name'],
				file=request.data['file']
			)

			model.save()

			return Response(status=status.HTTP_200_OK)

		except:
			raise Http404

	def delete(self, request, pk=None, format=None):
		try:
			model = LogicalModel.objects.get(id=request.data['id'])
			model.delete()

		except LogicalModel.DoesNotExist:
			raise Http404

		return Response(status=status.HTTP_200_OK)