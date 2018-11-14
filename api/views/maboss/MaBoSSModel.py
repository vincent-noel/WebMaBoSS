from api.views.HasModel import HasModel
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK

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
			node_data.update(node.internal_var)

			data.update({name: node_data})

		return Response(data=json.dumps(data))

	def post(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()
		field = request.POST['field']
		if field == "logic":
			field = "logExp"
		elif field == "rateUp":
			field = "rt_up"
		elif field == "rateDown":
			field = "rt_down"

		maboss_sim.save_formula(request.POST['node'], field, request.POST['formula'])
		self.saveMaBoSSModel(maboss_sim)

		return Response(status=HTTP_200_OK)


class MaBoSSCheckFormula(HasModel):

	def post(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()
		field = request.POST['field']
		if field == "logic":
			field = "logExp"
		elif field == "rateUp":
			field = "rt_up"
		elif field == "rateDown":
			field = "rt_down"

		res = maboss_sim.check_formula(request.POST['node'], field, request.POST['formula'])

		data = {'error': ''}

		if res is not None:

			if not (res[0] == "BooleanNetwork exception"):
				data.update({'error': res.join(':')})
			else:

				if res[1].startswith("BND syntax error at line"):
					data.update({'error': 'syntax error'})

				else:
					data.update({'error': res[1]})

		return Response(data=data)
