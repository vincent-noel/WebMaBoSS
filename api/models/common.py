from django.contrib.auth.models import User
from datetime import datetime, timedelta

from .project import Project
from .logical_model import LogicalModel
from .maboss import MaBoSSSimulation


def create_guest_account():

    try:
        guest_account = User.objects.get(username="____GUEST____")
        return guest_account    

    except User.DoesNotExist as e:
        guest_account = User(
            username="____GUEST____",
        )
        guest_account.save()
        
        default_project = Project.objects.get(user=guest_account)
        default_project.name = "Demo models"
        default_project.save()
        
        return guest_account    


def clean_guest_account():
    
    guest_account = User.objects.get(username="____GUEST____")
    guest_project = Project.objects.get(user=guest_account)
    
    for model in LogicalModel.objects.filter(project=guest_project):
        
        old_simulations = MaBoSSSimulation.objects.filter(
            model=model, 
            created_at__lte=(datetime.now() - timedelta(hours=24))
        )
        
        for old_simulation in old_simulations:
            old_simulations.delete()
