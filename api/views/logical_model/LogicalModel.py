from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.http import Http404, HttpResponse, FileResponse
from django.conf import settings

from api.models import LogicalModel, Project
from api.serializers import LogicalModelNameSerializer

from os.path import join, basename, splitext
from rest_framework.exceptions import PermissionDenied, MethodNotAllowed

import ginsim, maboss, biolqm
from json import loads
from api.views.commons.converter import maboss_to_ginsim

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

			if model.format == LogicalModel.ZGINML:
				path = join(settings.MEDIA_ROOT, model.file.path)
				ginsim_model = ginsim.load(path)
				maboss_model = ginsim.to_maboss(ginsim_model)

			elif model.format == LogicalModel.MABOSS:
				maboss_model = maboss.load(
					join(settings.MEDIA_ROOT, model.bnd_file.path),
					join(settings.MEDIA_ROOT, model.cfg_file.path)
				)

			else:
				raise MethodNotAllowed

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
			if model.format == LogicalModel.ZGINML:
				path = join(settings.MEDIA_ROOT, model.file.path)
				ginsim_model = ginsim.load(path)
			elif model.format == LogicalModel.MABOSS:
				ginsim_model = maboss_to_ginsim(model)

			else:
				raise MethodNotAllowed
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

			if model.format == LogicalModel.ZGINML:
				path = join(settings.MEDIA_ROOT, model.file.path)
				ginsim_model = ginsim.load(path)
			elif model.format == LogicalModel.MABOSS:
				ginsim_model = maboss_to_ginsim(model)

			else:
				raise MethodNotAllowed

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

			if model.format == LogicalModel.ZGINML:
				path = join(settings.MEDIA_ROOT, model.file.path)
				ginsim_model = ginsim.load(path)

			elif model.format == LogicalModel.MABOSS:
				from api.views.commons.converter import maboss_to_ginsim
				ginsim_model = maboss_to_ginsim(model)

			else:
				raise MethodNotAllowed

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
