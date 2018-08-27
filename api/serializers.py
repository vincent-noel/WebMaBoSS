from rest_framework import serializers
from api.models import LogicalModel

class LogicalModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogicalModel
        fields = '__all__'

class LogicalModelNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogicalModel
        fields = ['name']