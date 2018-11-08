from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied, MethodNotAllowed
from rest_framework.parsers import JSONParser

from django.core.files import File
from django.core.files.base import ContentFile
from django.http import Http404, HttpResponse
from django.conf import settings
from django.db import transaction

from api.serializers import MaBoSSSimulationSerializer
from api.models import LogicalModel, MaBoSSSimulation, Project
from api.views.commons.converter import ginsim_to_maboss
from threading import Thread
from os.path import join, exists, splitext, basename
from os import remove
from json import loads
import ginsim
import maboss
import json


class MaBoSSSpeciesFormulas(APIView):

	def get(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)
			if model.format == LogicalModel.MABOSS:
				maboss_sim = maboss.load(
					join(settings.MEDIA_ROOT, model.bnd_file.path),
					join(settings.MEDIA_ROOT, model.cfg_file.path)
				)

			elif model.format == LogicalModel.ZGINML:
				maboss_sim = ginsim_to_maboss(model)

			else:
				raise MethodNotAllowed

			data = {}
			for name, node in maboss_sim.network.items():

				node_data = {}
				node_data.update({'logic': node.logExp})
				node_data.update({'rateUp': node.rt_up})
				node_data.update({'rateDown': node.rt_down})

				data.update({name: node_data})

			return Response(data=json.dumps(data))

		except LogicalModel.DoesNotExist:
			raise Http404

		except Project.DoesNotExist:
			raise Http404


class MaBoSSCheckFormula(APIView):

	def post(self, request, project_id, model_id):

		if request.user.is_anonymous:
			raise PermissionDenied

		try:
			project = Project.objects.get(id=project_id)

			if project.user != request.user:
				raise PermissionDenied

			model = LogicalModel.objects.get(project=project, id=model_id)
			if model.format == LogicalModel.MABOSS:
				maboss_sim = maboss.load(
					join(settings.MEDIA_ROOT, model.bnd_file.path),
					join(settings.MEDIA_ROOT, model.cfg_file.path)
				)

			elif model.format == LogicalModel.ZGINML:
				maboss_sim = ginsim_to_maboss(model)

			else:
				raise MethodNotAllowed

			res = maboss_sim.network.check_logic(request.POST['formula'])
			return Response(data={'error': res})

		except LogicalModel.DoesNotExist:
			raise Http404

		except Project.DoesNotExist:
			raise Http404




