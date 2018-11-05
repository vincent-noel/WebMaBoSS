from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import JSONParser

from django.core.files import File
from django.http import Http404
from django.conf import settings
from django.db import transaction

from api.serializers import MaBoSSSimulationSerializer
from api.models import LogicalModel, MaBoSSSimulation, Project

from threading import Thread
from os.path import join
from json import loads, dumps
import ginsim
import maboss



class MaBoSSResultsFixedPoints(APIView):

	def get(self, request, simulation_id):

		try:
			simulation = MaBoSSSimulation.objects.get(id=simulation_id)
			if simulation.project.user != request.user:
				raise PermissionDenied

			fixed_points = {}
			for key, values in loads(simulation.states_probtraj).items():
				last_time = list(values.keys())[len(values.keys())-1]
				if values[last_time] > 0:
					fixed_points.update({key: values[last_time]})


			return Response(
					{
						'fixed_points': fixed_points,
						'status': simulation.status
					},
					status=status.HTTP_200_OK
				)

		except MaBoSSSimulation.DoesNotExist:
			raise Http404

class MaBoSSResultsStatesProbTraj(APIView):

	def get(self, request, simulation_id):

		try:
			simulation = MaBoSSSimulation.objects.get(id=simulation_id)
			if simulation.project.user != request.user:
				raise PermissionDenied

			if simulation.states_probtraj is not None:
				states_probtraj = loads(simulation.states_probtraj)

			else:
				states_probtraj = None

			return Response(
				{
					'states_probtraj': states_probtraj,
					'status': simulation.status
				},
				status=status.HTTP_200_OK
			)

		except MaBoSSSimulation.DoesNotExist:
			raise Http404

class MaBoSSResultsNodesProbTraj(APIView):

	def get(self, request, simulation_id):

		try:
			simulation = MaBoSSSimulation.objects.get(id=simulation_id)
			if simulation.project.user != request.user:
				raise PermissionDenied

			if simulation.nodes_probtraj is not None:
				nodes_probtraj = loads(simulation.nodes_probtraj)

			else:
				nodes_probtraj = None

			return Response(
				{
					'nodes_probtraj': nodes_probtraj,
					'status': simulation.status
				},
				status=status.HTTP_200_OK
			)

		except MaBoSSSimulation.DoesNotExist:
			raise Http404

