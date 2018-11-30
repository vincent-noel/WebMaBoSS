from django.contrib import admin
from api.models import Project, MaBoSSSimulation, LogicalModel, TaggedLogicalModel, MaBoSSServer, MaBoSSSensitivityAnalysis, MaBoSSSensitivitySimulation
# Register your models here.

admin.site.register(Project)
admin.site.register(LogicalModel)
admin.site.register(TaggedLogicalModel)
admin.site.register(MaBoSSSimulation)
admin.site.register(MaBoSSServer)
admin.site.register(MaBoSSSensitivitySimulation)
admin.site.register(MaBoSSSensitivityAnalysis)