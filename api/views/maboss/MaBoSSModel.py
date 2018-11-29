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

		maboss_sim.save_formula(node, field, request.POST['formula'])
		res = maboss_sim.check_model()

		data = {'error': ''}

		if any([message.startswith("BND syntax error at line") for message in res]):
			data.update({'error': 'syntax error'})

		elif any([message.startswith("node") and message.endswith("used but not defined") for message in res]):
			for message in res:
				if message.startswith("node") and message.endswith("used but not defined"):
					data.update({'error': message})

		elif any([message.startswith("invalid use of alias attribute @logic in node") for message in res]) and field == "logExp":
			data.update({'error': "Syntax error"})


		elif len(res) > 0:
			data.update({'error': res[0]})

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

		if any([message == ("invalid use of alias attribute @%s in node %s" % (field, node)) for message in res]):
			if field == "logic":
				data.update({'error': 'The logical formula is used elsewhere in the model'})
			else:
				data.update({'error': 'The formula %s is used in the model' % field})

		elif len(res) > 0:
			data.update({'error': res[0]})

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

		data = {'error': ''}

		if any([message.startswith("configuration syntax error") for message in res]):
			data.update({'error': 'Syntax error'})

		elif len(res) > 0:
			data.update({'error': res[0]})

		return Response(data=data)

	def delete(self, request, project_id, model_id, name):

		HasModel.load(self, request, project_id, model_id)

		maboss_sim = self.getMaBoSSModel()
		del maboss_sim.param[name]

		res = maboss_sim.check_model()

		data = {'error': ''}

		if any([message == ("symbol %s is not defined" % name) for message in res]):
			data.update({'error': 'The parameter %s is used in the model' % name})

		elif len(res) > 0:
			data.update({'error': res[0]})

		return Response(data=data)


class MaBoSSInitialStates(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		maboss_model = self.getMaBoSSModel()

		initial_states = maboss_model.network.get_istate()

		# Here the problem is the variables with more than two states, who appear in the initial states as :
		# (Var_1, Var_2, Var_3) : {(0, 0, 0): 1, (1, 0, 0): 0, (1, 1, 0): 0, (1, 1, 1): 0}
		# The nice thing is that it shows the constraint that the state (0, 1, 1) is impossible. But I'm not sure
		# how to show this constraint on the interface (Probably merging them as a single multi state variable,
		# which they are. But for now, we just treat them as individual variables, ie. without the constraint.

		fixed_initial_states = {}
		for var, value in initial_states.items():
			if isinstance(var, tuple):

				t_values = {}
				for i, subvar in enumerate(var):
					t_values.update({subvar: {0: 0, 1: 0}})

				for tuple_states, tuple_value in value.items():
					for i_tuple, t_tuple in enumerate(tuple_states):
						subvar = var[i_tuple]
						t_value = t_values[subvar]
						tt_value = t_value[t_tuple] + tuple_value
						t_value.update({t_tuple: tt_value})
						t_values.update({subvar: t_value})

				fixed_initial_states.update(t_values)

			else:
				fixed_initial_states.update({var: value})

		return Response({
			'initial_states': fixed_initial_states,
		})


	def put(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		maboss_model = self.getMaBoSSModel()

		for var, istate in json.loads(request.POST['initialStates']).items():
			maboss_model.network.set_istate(var, [1.0-float(istate), float(istate)])

		self.saveMaBoSSModel(maboss_model)

		return Response(status=HTTP_200_OK)


class MaBoSSModelSettings(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		maboss_model = self.getMaBoSSModel()

		settings = {key: value for key, value in maboss_model.param.items() if not key.startswith("$")}

		return Response({
			'settings': settings,
		})


	def put(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		maboss_model = self.getMaBoSSModel()

		for name, value in json.loads(request.POST['settings']).items():
			maboss_model.param[name] = float(value)

		self.saveMaBoSSModel(maboss_model)

		return Response(status=HTTP_200_OK)
