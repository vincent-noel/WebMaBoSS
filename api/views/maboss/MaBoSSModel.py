from api.views.HasModel import HasModel
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.exceptions import NotFound

import json


class MaBoSSSpeciesFormulas(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()

		data = {}
		for name, node in maboss_sim.network.items():

			node_data = {}
			node_data.update({'rateUp': node.rt_up})
			node_data.update({'rateDown': node.rt_down})

			if node.logExp is not None:
				node_data.update({'logic': node.logExp})

			node_data.update(node.internal_var)

			data.update({name: node_data})

		return Response(data=json.dumps(data))


class MaBoSSSpeciesFormula(HasModel):

	def get(self, request, project_id, model_id, node, field):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()

		node = maboss_sim.network[node]

		node_data = {}
		node_data.update({'rateUp': maboss_sim.network[node].rt_up})
		node_data.update({'rateDown': maboss_sim.network[node].rt_down})

		if node.logExp is not None:
			node_data.update({'logic': node.logExp})

		node_data.update(node.internal_var)

		return Response(data=json.dumps(node_data))


	def post(self, request, project_id, model_id, node, field):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()

		if field == "rateUp":
			maboss_sim.network[node].rt_up = request.POST['formula']

		elif field == "rateDown":
			maboss_sim.network[node].rt_down = request.POST['formula']

		elif field == "logic":
			maboss_sim.network[node].logExp = request.POST['formula']

		else:
			maboss_sim.network[node].internal_var.update({field: request.POST['formula']})

		self.saveMaBoSSModel(maboss_sim)
		return Response(status=HTTP_200_OK)


	def delete(self, request, project_id, model_id, node, field):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()

		if field in ["rateUp", "rateDown"]:
			return Response(data={'error': 'Cannot remove %s' % request.POST['field']})

		if field == "logic":
			maboss_sim.network[node].logExp = None

		else:
			del maboss_sim.network[node].internal_var[field]

		self.saveMaBoSSModel(maboss_sim)
		return Response(status=HTTP_200_OK)


class MaBoSSCheckFormula(HasModel):

	def post(self, request, project_id, model_id, node, field):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()

		if field == "logic":
			field = "logExp"
		elif field == "rateUp":
			field = "rt_up"
		elif field == "rateDown":
			field = "rt_down"

		res = maboss_sim.check_formula(node, field, request.POST['formula'])

		data = {'error': ''}

		print(res)
		if any([message.startswith("BND syntax error at line") for message in res]):
			data.update({'error': 'syntax error'})

		elif any([message.startswith("node") and message.endswith("used but not defined") for message in res]):
			for message in res:
				if message.startswith("node") and message.endswith("used but not defined"):
					data.update({'error': message})

		return Response(data=data)

	def delete(self, request, project_id, model_id, node, field):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()

		if field in ["rateUp", "rateDown"]:
			return Response(data={'error': 'Cannot remove %s' % field})

		if field == "logic":
			maboss_sim.network[node].logExp = None

		else:
			del maboss_sim.network[node].internal_var[field]

		res = maboss_sim.check_model()
		data = {'error': ''}
		print(res)
		if any([message == ("invalid use of alias attribute @%s in node %s" % (field, node)) for message in res]):
			data.update({'error': 'The formula %s is used in the model' % node})

		return Response(data=data)


class MaBoSSParameters(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()

		data = {}

		for parameter, value in maboss_sim.param.items():
			if parameter.startswith("$"):
				data.update({parameter: value})

		return Response(data=json.dumps(data))


class MaBoSSParameter(HasModel):

	def get(self, request, project_id, model_id, name):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()

		if name in maboss_sim.param.keys():
			return Response(data=maboss_sim.param[name])

		else:
			raise NotFound

	def post(self, request, project_id, model_id, name):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()
		maboss_sim.param[name] = request.POST['value']
		self.saveMaBoSSModel(maboss_sim)

		return Response(status=HTTP_200_OK)

	def delete(self, request, project_id, model_id, name):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()
		del maboss_sim.param[name]
		self.saveMaBoSSModel(maboss_sim)

		return Response(status=HTTP_200_OK)




class MaBoSSCheckParameter(HasModel):

	def post(self, request, project_id, model_id, name):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()
		maboss_sim.param[name] = request.POST['value']

		res = maboss_sim.check_model()
		print(res)
		data = {'error': ''}

		if any([message.startswith("configuration syntax error") for message in res]):
			data.update({'error': 'Syntax error'})

		return Response(data=data)

	def delete(self, request, project_id, model_id, name):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()
		del maboss_sim.param[name]

		res = maboss_sim.check_model()

		data = {'error': ''}

		if any([message == ("symbol %s is not defined" % name) for message in res]):
			data.update({'error': 'The parameter %s is used in the model' % name})

		return Response(data=data)

