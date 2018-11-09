from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from django.http import Http404
from api.models import MaBoSSSimulation

from json import loads




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

