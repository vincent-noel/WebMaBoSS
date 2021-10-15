from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from rest_framework import permissions

class HasUser(APIView):
	permission_classes = (permissions.AllowAny,)

	def __init__(self, *args, **kwargs):
		APIView.__init__(self, *args, **kwargs)
		self.user = None

	def load(self, request):
		self.user = request.user
