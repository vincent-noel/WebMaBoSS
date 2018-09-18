from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied

from django.http import Http404

from api.models.maboss import MaBoSSServer
from api.serializers import MaBoSSServerSerializer

class MaBoSSServerView(APIView):

	def get(self, request, server_id=None):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			if server_id is None:
				servers = MaBoSSServer.objects.filter(user=request.user)
				serializer = MaBoSSServerSerializer(servers, many=True)

				return Response(serializer.data)
			else:
				server = MaBoSSServer.objects.get(id=server_id)

				if server.user != request.user:
					raise PermissionDenied

				serializer = MaBoSSServerSerializer(server)
				return Response(serializer.data)

		except MaBoSSServer.DoesNotExist:
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

	def put(self, request, server_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			server = MaBoSSServer.objects.get(id=server_id)

			if server.user != server.user:
				raise PermissionDenied

			server.host = request.data['host']
			server.port = int(request.data['port'])
			server.save()

		except MaBoSSServer.DoesNotExist:
			raise Http404


	def delete(self, request, server_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			server = MaBoSSServer.objects.get(id=server_id)

			if server.user != server.user:
				raise PermissionDenied

			server.delete()
			return Response(status=status.HTTP_200_OK)

		except MaBoSSServer.DoesNotExist:
			raise Http404
