from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied


class HasUser(APIView):

	def __init__(self, *args, **kwargs):
		APIView.__init__(self, *args, **kwargs)
		self.user = None

	def load(self, request):

		if request.user.is_anonymous:
			raise PermissionDenied

		self.user = request.user
