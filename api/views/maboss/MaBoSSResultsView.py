from rest_framework.response import Response
from rest_framework import status

from api.views.HasMaBoSSSimulation import HasMaBoSSSimulation
from json import loads


class MaBoSSResultsFixedPoints(HasMaBoSSSimulation):

	def get(self, request, project_id, simulation_id):

		HasMaBoSSSimulation.load(self, request, project_id, simulation_id)

		fixed_points = None

		if self.simulation.states_probtraj is not None:
			fixed_points = {}
			for key, values in loads(self.simulation.states_probtraj).items():
				last_time = list(values.keys())[len(values.keys())-1]
				if values[last_time] > 0:
					fixed_points.update({key: values[last_time]})

		return Response(
			{
				'fixed_points': fixed_points,
				'status': self.simulation.status
			},
			status=status.HTTP_200_OK
		)


class MaBoSSResultsStatesProbTraj(HasMaBoSSSimulation):

	def get(self, request, project_id, simulation_id):

		HasMaBoSSSimulation.load(self, request, project_id, simulation_id)

		if self.simulation.states_probtraj is not None:
			states_probtraj = loads(self.simulation.states_probtraj)

		else:
			states_probtraj = None

		return Response(
			{
				'states_probtraj': states_probtraj,
				'status': self.simulation.status
			},
			status=status.HTTP_200_OK
		)


class MaBoSSResultsNodesProbTraj(HasMaBoSSSimulation):

	def get(self, request, project_id, simulation_id):

		HasMaBoSSSimulation.load(self, request, project_id, simulation_id)

		if self.simulation.nodes_probtraj is not None:
			nodes_probtraj = loads(self.simulation.nodes_probtraj)

		else:
			nodes_probtraj = None

		return Response(
			{
				'nodes_probtraj': nodes_probtraj,
				'status': self.simulation.status
			},
			status=status.HTTP_200_OK
		)
