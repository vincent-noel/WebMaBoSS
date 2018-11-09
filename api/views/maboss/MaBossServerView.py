from api.views.HasUser import HasUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

from django.http import Http404

from api.models.maboss import MaBoSSServer
from api.serializers import MaBoSSServerSerializer

class MaBoSSServerView(HasUser):

	def get(self, request, server_id=None):

		HasUser.load(self, request)

		try:
			if server_id is None:
				servers = MaBoSSServer.objects.filter(user=self.user)
				serializer = MaBoSSServerSerializer(servers, many=True)

				return Response(serializer.data)
			else:
				server = MaBoSSServer.objects.get(id=server_id)

				if server.user != self.user:
					raise PermissionDenied

				serializer = MaBoSSServerSerializer(server)
				return Response(serializer.data)

		except MaBoSSServer.DoesNotExist:
			raise Http404


	def post(self, request):

		HasUser.load(self, request)

		MaBoSSServer(
			user=self.user,
			host=self.POST['host'],
			port=self.POST['port']
		).save()

		return Response(status=status.HTTP_200_OK)

	def put(self, request, server_id):

		HasUser.load(self, request)

		try:
			server = MaBoSSServer.objects.get(id=server_id)

			if server.user != self.user:
				raise PermissionDenied

			server.host = request.data['host']
			server.port = int(request.data['port'])
			server.save()

			return Response(status=status.HTTP_200_OK)

		except MaBoSSServer.DoesNotExist:
			raise Http404


	def delete(self, request, server_id):

		HasUser.load(self, request)

		try:
			server = MaBoSSServer.objects.get(id=server_id)

			if server.user != self.user:
				raise PermissionDenied

			server.delete()
			return Response(status=status.HTTP_200_OK)

		except MaBoSSServer.DoesNotExist:
			raise Http404
