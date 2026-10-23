from rest_framework.authentication import TokenAuthentication

from api.models.activity import record_activity


class ActivityTokenAuthentication(TokenAuthentication):
	""" Token authentication, which also records the days on which the users are active """

	def authenticate(self, request):
		result = TokenAuthentication.authenticate(self, request)
		if result is not None:
			record_activity(result[0])
		return result
