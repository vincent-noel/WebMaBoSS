from api.views.HasUser import HasUser
from rest_framework.exceptions import PermissionDenied, NotFound
from django.contrib.auth.models import User
from api.models import Project
from rest_framework import permissions


class HasProject(HasUser):

    permission_classes = (permissions.AllowAny,)

    def __init__(self, *args, **kwargs):
        
        HasUser.__init__(self, *args, **kwargs)
        self.project = None

    def load(self, request, project_id):

        HasUser.load(self, request)
        
        try:
            if self.user.is_anonymous:
                guest_user = User.objects.get(username="____GUEST____")
                project = Project.objects.get(user=guest_user)
        
            else:
                project = Project.objects.get(id=project_id)
                if project.user != self.user:
                    raise PermissionDenied

            self.project = project

        except Project.DoesNotExist:
            raise NotFound
