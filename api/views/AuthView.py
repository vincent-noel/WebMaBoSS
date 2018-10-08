from rest_framework.views import APIView
from rest_framework import authentication, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_auth.views import LogoutView
from rest_framework import status


class TestAuthView(APIView):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        return Response("Hello {0}!".format(request.user))

class LogoutViewEx(LogoutView):
    authentication_classes = (authentication.TokenAuthentication,)

class UserEmailView(APIView):

    def get(self, request):

        if request.user.is_anonymous:
            raise PermissionDenied

        return Response({'email': request.user.email})

    def put(self, request):

        if request.user.is_anonymous:
            raise PermissionDenied

        request.user.email = request.data['email']
        request.user.save()

        return Response(status=status.HTTP_200_OK)
