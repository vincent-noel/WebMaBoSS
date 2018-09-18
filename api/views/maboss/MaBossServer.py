from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.serializers import ModelSerializer

from django.http import Http404

from api.models.maboss import MaBoSSServer


class MaBoSSServer(APIView):

	def get(self, request):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			servers = MaBoSSServer.objects.filter(user=user)
			serializer = ModelSerializer(server, many=True)

			return Response(serializer.data)

		except Project.DoesNotExist:
			raise Http404


	def post(self, request):

		if request.user.is_anonymous:
			raise PermissionDenied

		MaBoSSServer(
			user=request.user,
			host=request.POST['host'],
			port=request.POST['port']
		).save()

		return Response(status=status.HTTP_200_OK)

	# def put(self, request, server_id):
	#
	# 	if request.user.is_anonymous:
	# 		raise PermissionDenied
	#
	# 	try:
	# 		project = Project.objects.get(id=project_id)
	#
	# 		if project.user != request.user:
	# 			raise PermissionDenied
	#
	# 		project.name = request.data['name']
	# 		project.description = request.data['description']
	# 		project.save()
	#
	# 	except Project.DoesNotExist:
	# 		raise Http404
	#
	#
	# def delete(self, request, server_id):
	#
	# 	if request.user.is_anonymous:
	# 		raise PermissionDenied
	#
	# 	try:
	# 		project = Project.objects.get(id=project_id)
	#
	# 		if project.user != request.user:
	# 			raise PermissionDenied
	#
	# 		project.delete()
	# 		return Response(status=status.HTTP_200_OK)
	#
	# 	except Project.DoesNotExist:
	# 		raise Http404
