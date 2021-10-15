from django.apps import AppConfig


class LogicalmodellingConfig(AppConfig):
    name = 'api'

    def ready(self):
        from api.models.common import create_guest_account
        create_guest_account()