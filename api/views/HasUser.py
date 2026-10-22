from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from rest_framework import permissions


class AnonymousReadOnly(permissions.BasePermission):
	"""
	Anonymous users can look at the demo project, which is shared by all of them. They can't modify it,
	except for what a view explicitly allows them to do with anonymous_methods (running simulations).
	"""
	def has_permission(self, request, view):
		if request.user.is_anonymous and request.method not in view.anonymous_methods:
			raise PermissionDenied
		return True


class HasUser(APIView):
	permission_classes = (AnonymousReadOnly,)

	# HTTP methods allowed to anonymous users
	anonymous_methods = permissions.SAFE_METHODS

	def __init__(self, *args, **kwargs):
		APIView.__init__(self, *args, **kwargs)
		self.user = None

	def load(self, request):
		self.user = request.user
