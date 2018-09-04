from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

from django.http import Http404

from api.models import Project
from api.serializers import ProjectSerializer


class Projects(APIView):

	def get(self, request, format=None):

		if request.user.is_anonymous:
			raise PermissionDenied

		projects = Project.objects.filter(user=request.user)
		serializer = ProjectSerializer(projects, many=True)

		return Response(serializer.data)


	def post(self, request):

		if request.user.is_anonymous:
			raise PermissionDenied

		Project(
			user=request.user,
			name=request.data['name'],
			description=request.data['description']
		).save()

		return Response(status=status.HTTP_200_OK)


	def delete(self, request, pk=None, format=None):

		if request.user.is_anonymous:
			raise PermissionDenied
		try:
			model = Project.objects.get(user=request.user, id=int(request.data['id']))
			model.delete()

		except Project.DoesNotExist:
			raise Http404

		return Response(status=status.HTTP_200_OK)
