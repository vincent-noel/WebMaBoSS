from rest_framework.views import APIView
from rest_framework import authentication, permissions, status
from rest_framework.response import Response
from rest_auth.views import LogoutView

from api.views.HasUser import HasUser


class TestAuthView(APIView):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None):
        return Response("Hello {0}!".format(request.user))

class LogoutViewEx(LogoutView):
    authentication_classes = (authentication.TokenAuthentication,)

class UserEmailView(HasUser):

    def get(self, request):

        HasUser.load(self, request)

        return Response({'email': self.user.email})

    def put(self, request):

        HasUser.load(self, request)

        self.user.email = request.data['email']
        self.user.save()

        return Response(status=status.HTTP_200_OK)
