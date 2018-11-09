from api.views.HasModel import HasModel
from rest_framework.response import Response

import json


class MaBoSSSpeciesFormulas(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()

		data = {}
		for name, node in maboss_sim.network.items():

			node_data = {}
			node_data.update({'logic': node.logExp})
			node_data.update({'rateUp': node.rt_up})
			node_data.update({'rateDown': node.rt_down})

			data.update({name: node_data})

		return Response(data=json.dumps(data))


class MaBoSSCheckFormula(HasModel):

	def post(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()
		res = maboss_sim.network.check_logic(request.POST['formula'])

		return Response(data={'error': res})
