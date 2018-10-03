from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.http import Http404, HttpResponse, FileResponse
from django.conf import settings

from api.models import LogicalModel, Project
from api.serializers import LogicalModelNameSerializer

from os.path import join, basename, splitext
from rest_framework.exceptions import PermissionDenied

import ginsim
from json import loads


class LogicalModelFile(APIView):

	def get(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)

			return FileResponse(
				open(join(settings.MEDIA_ROOT, model.file.path), 'rb'),
				as_attachment=True, filename=basename(model.file.path)
			)

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404


class LogicalModelSBMLFile(APIView):

	def get(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)

			import ginsim
			ginsim_model = ginsim.load(join(settings.MEDIA_ROOT, model.file.path))

			sbml_filename = join(settings.TMP_ROOT, splitext(basename(model.file.path))[0] + ".sbml")
			print(sbml_filename)
			ginsim.to_sbmlqual(ginsim_model, sbml_filename)

			return FileResponse(
				open(sbml_filename, 'rb'),
				as_attachment=True, filename=basename(sbml_filename)
			)

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404


class LogicalModelName(APIView):

	def get(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)
			if request.user != project.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)
			serializer = LogicalModelNameSerializer(model)

			return Response(serializer.data)

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404



class LogicalModelNodes(APIView):

	def get(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)
			if request.user != project.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)
			path = join(settings.MEDIA_ROOT, model.file.path)
			ginsim_model = ginsim.load(path)
			maboss_model = ginsim.to_maboss(ginsim_model)
			return Response(list(maboss_model.network.keys()))

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404

class LogicalModelGraph(APIView):

	def get(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)
			if request.user != project.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)
			path = join(settings.MEDIA_ROOT, model.file.path)
			ginsim_model = ginsim.load(path)
			fig = ginsim.get_image(ginsim_model)

			return HttpResponse(fig, content_type="image/png")

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404

	def post(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)
			if request.user != project.user:
				raise PermissionDenied

			steady_state = loads(request.data['steady_state'])
			model = LogicalModel.objects.get(project=project, id=model_id)
			path = join(settings.MEDIA_ROOT, model.file.path)
			ginsim_model = ginsim.load(path)
			fig = ginsim.get_image(ginsim_model, steady_state)

			return HttpResponse(fig, content_type="image/png")

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404

class LogicalModelGraphRaw(APIView):

	def get(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)
			if request.user != project.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)
			path = join(settings.MEDIA_ROOT, model.file.path)
			ginsim_model = ginsim.load(path)

			# from ginsim.gateway import japi
			# This won't work in parallel... but that's ok for now
			filename = join(settings.TMP_ROOT, "reggraph")
			ginsim.gateway.japi.gs.service("reggraph").export(ginsim_model, filename)

			edges = []
			nodes = []
			with open(filename, 'r') as reggraph:
				for line in reggraph.readlines():
					(a, sign, b) = line.strip().split()
					nodes.append(a)
					nodes.append(b)
					edges.append((a, b, (1 if sign == "->" else 0)))

			nodes = list(set(nodes))

			return Response(
				{
					'nodes': nodes,
					'edges': edges
				},
				status=status.HTTP_200_OK
			)

		except Project.DoesNotExist:
			raise Http404

		except LogicalModel.DoesNotExist:
			raise Http404
