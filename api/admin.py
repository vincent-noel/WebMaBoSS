from django.contrib import admin
from api.models import Project, MaBoSSSimulation, LogicalModel, MaBoSSServer
# Register your models here.

admin.site.register(Project)
admin.site.register(LogicalModel)
admin.site.register(MaBoSSSimulation)
admin.site.register(MaBoSSServer)
