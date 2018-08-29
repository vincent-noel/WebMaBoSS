from rest_framework.views import APIView
from rest_framework import authentication, permissions, status
from rest_framework.response import Response
from rest_auth.views import LogoutView

class TestAuthView(APIView):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        return Response("Hello {0}!".format(request.user))

class LogoutViewEx(LogoutView):
    authentication_classes = (authentication.TokenAuthentication,)

