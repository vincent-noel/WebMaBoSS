from django.contrib import admin
# from api.models.Project import Project
# from api.models.MaBoSS import MaBoSSSimulation
# from api.models.LogicalModel import LogicalModel
from api.models import Project, MaBoSSSimulation, LogicalModel
# Register your models here.

admin.site.register(Project)
admin.site.register(LogicalModel)
admin.site.register(MaBoSSSimulation)
