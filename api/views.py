# from django.shortcuts import render
#
# # Create your views here.
# from api.models import LogicalModel
# from api.serializers import LogicalModelSerializer, LogicalModelNameSerializer
# from rest_framework import generics
# from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
#
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import authentication, permissions, status
# from django.contrib.auth.models import User
# import json
# from django.http import Http404
# from os.path import join
# from django.conf import settings
# from django.http import HttpResponse
# from views.LogicalModels import LogicalModels
# from views.LogicalModel import *
# from views.BioLQMSimulation import *
# from views.MaBoSSSimulation import *
#
# class LogicalModels(APIView):
#
# 	def get(self, request, format=None):
# 		models = LogicalModel.objects.all()
# 		serializer = LogicalModelSerializer(models, many=True)
# 		return Response(serializer.data)
#
# 	def post(self, request):
# 		model = LogicalModel(
# 			name=request.data['name'],
# 			file=request.data['file']
# 		)
#
# 		model.save()
# 		return Response(status=status.HTTP_200_OK)
#
# 	def delete(self, request, pk=None, format=None):
# 		id = request.data['id']
#
# 		try:
# 			model = LogicalModel.objects.get(id=id)
# 			model.delete()
#
# 		except LogicalModel.DoesNotExist:
# 			raise Http404
#
# 		return Response(status=status.HTTP_200_OK)

# class LogicalModelView(APIView):

	# parser_classes = (MultiPartParser, FileUploadParser, )
	# serializer_class = LogicalModelSerializer

	# def get_object(self, pk):
	# 	try:
	# 		return LogicalModel.objects.get(pk=pk)
	# 	except Snippet.DoesNotExist:
	# 		raise Http404
#
# class LogicalModelName(APIView):
#
# 	def get(self, request, pk):
# 		try:
#
# 			model = LogicalModel.objects.get(pk=pk)
# 			serializer = LogicalModelNameSerializer(model)
#
# 			return Response(serializer.data)
# 		except LogicalModel.DoesNotExist:
# 			raise Http404
#
#
#
# class LogicalModelGraph(APIView):
#
# 	def get(self, request, pk):
# 		try:
#
# 			model = LogicalModel.objects.get(pk=pk)
# 			import ginsim
# 			path = join(settings.MEDIA_ROOT, model.file.path)
# 			ginsim_model = ginsim.load(path)
# 			fig = ginsim.get_image(ginsim_model)
#
# 			return HttpResponse(fig, content_type="image/png")
#
# 		except LogicalModel.DoesNotExist:
# 			raise Http404
#
#
#
#
# class LogicalModelSimulation(APIView):
#
# 	def get(self, request, pk):
# 		try:
#
# 			model = LogicalModel.objects.get(pk=pk)
# 			import ginsim
# 			path = join(settings.MEDIA_ROOT, model.file.path)
# 			ginsim_model = ginsim.load(path)
# 			maboss_model = ginsim.to_maboss(ginsim_model)
#
# 			maboss_model.run()
#
#
# 		except LogicalModel.DoesNotExist:
# 			raise Http404
# #
# class LogicalModelSteadyStates(APIView):
#
# 	def get(self, request, pk):
# 		try:
#
# 			model = LogicalModel.objects.get(pk=pk)
# 			import ginsim
# 			path = join(settings.MEDIA_ROOT, model.file.path)
# 			ginsim_model = ginsim.load(path)
#
# 			import biolqm
# 			biolqm_model = ginsim.to_biolqm(ginsim_model)
# 			ss = biolqm.fixpoints(biolqm_model)
# 			return Response(ss, status=status.HTTP_200_OK)
#
#
# 		except LogicalModel.DoesNotExist:
# 			raise Http404
