from rest_framework import serializers
from api.models import LogicalModel, Project, MaBoSSSimulation, MaBoSSServer

class LogicalModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogicalModel
        fields = '__all__'

class LogicalModelNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogicalModel
        fields = ['name']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class MaBoSSSimulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaBoSSSimulation
        fields = ['id']

class MaBoSSServerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaBoSSServer
        fields = '__all__'
