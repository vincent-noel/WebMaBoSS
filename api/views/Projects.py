from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, NotFound

from api.models import Project
from api.serializers import ProjectSerializer
from api.views.HasUser import HasUser


class Projects(HasUser):

	def get(self, request, project_id=None):

		HasUser.load(self, request)

		try:
			if project_id is None:
				projects = Project.objects.filter(user=request.user)
				serializer = ProjectSerializer(projects, many=True)

				return Response(serializer.data)
			else:
				project = Project.objects.get(id=project_id)

				if project.user != self.user:
					raise PermissionDenied

				serializer = ProjectSerializer(project)

				return Response(serializer.data)

		except Project.DoesNotExist:
			raise NotFound

	def post(self, request):

		HasUser.load(self, request)

		Project(
			user=self.user,
			name=request.data['name'],
			description=request.data['description']
		).save()

		return Response(status=status.HTTP_200_OK)

	def put(self, request, project_id):

		HasUser.load(self, request)

		try:
			project = Project.objects.get(id=project_id)

			if project.user != self.user:
				raise PermissionDenied

			project.name = request.data['name']
			project.description = request.data['description']
			project.save()

			return Response(status=status.HTTP_200_OK)

		except Project.DoesNotExist:
			raise NotFound

	def delete(self, request, project_id):

		HasUser.load(self, request)

		try:
			project = Project.objects.get(id=project_id)

			if project.user != self.user:
				raise PermissionDenied

			project.delete()
			return Response(status=status.HTTP_200_OK)

		except Project.DoesNotExist:
			raise NotFound

