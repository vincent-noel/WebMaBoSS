from rest_framework.response import Response
from rest_framework import status

from django.http import HttpResponse, FileResponse
from django.conf import settings

from api.views.HasModel import HasModel
from api.models.logical_model import LogicalModel
from api.serializers import LogicalModelNameSerializer
from api.views.maboss.MaBoSSModel import simplify_messages
from os.path import join, basename

import ginsim
from json import loads
import tempfile

class LogicalModelFile(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		model_file = self.getZGINMLModelFile()

		if model_file is None:
			return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

		return FileResponse(
			open(model_file, 'rb'),
			as_attachment=True, filename=basename(model_file)
		)

class LogicalModelBNetFile(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		model_file = self.getBNetModelFile()

		if model_file is None:
			return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

		return FileResponse(
			open(model_file, 'rb'),
			as_attachment=True, filename=basename(model_file)
		)
		
class LogicalModelSBMLFile(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		sbml_filename = self.getSBMLModelFile()

		if sbml_filename is None:
			return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

		return FileResponse(
			open(sbml_filename, 'rb'),
			as_attachment=True, filename=basename(sbml_filename)
		)

class LogicalModelMaBoSSBNDFile(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		bnd_filename = self.getMaBoSSBNDFile()

		if bnd_filename is None:
			return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

		return FileResponse(
			open(bnd_filename, 'rb'),
			as_attachment=True, filename=basename(bnd_filename)
		)

class LogicalModelMaBoSSCFGFile(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		cfg_filename = self.getMaBoSSCFGFile()

		if cfg_filename is None:
			return Response(status=status.HTTP_501_NOT_IMPLEMENTED)
		
		return FileResponse(
			open(cfg_filename, 'rb'),
			as_attachment=True, filename=basename(cfg_filename)
		)

class LogicalModelName(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		serializer = LogicalModelNameSerializer(self.model)

		return Response(serializer.data)

	def post(self, request, project_id, model_id):
		
		HasModel.load(self, request, project_id, model_id)
		HasModel.setName(self, request.POST['name'])
		serializer = LogicalModelNameSerializer(self.model)
		return Response(serializer.data)

class LogicalModelNodes(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)
		maboss_model = self.getMaBoSSModel()

		return Response(sorted(list(maboss_model.network.keys())))

	def post(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		if self.model.format == LogicalModel.MABOSS:
			maboss_model = self.getMaBoSSModel()
			if request.POST['name'] not in maboss_model.network.keys():
				maboss_model.network.add_node(request.POST['name'])

				self.saveMaBoSSModel(maboss_model)
				return Response(status=status.HTTP_200_OK)
			else:
				return Response(status=status.HTTP_409_CONFLICT)
		else:
			return Response(status=status.HTTP_501_NOT_IMPLEMENTED)

	def delete(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		maboss_model = self.getMaBoSSModel()
		maboss_model.network.remove_node(request.POST['name'])
		res = simplify_messages(maboss_model.check())

		data = {'error': ''}
		if len(res) > 0:
			if any([message.startswith("node") and message.endswith("used but not defined") for message in res]):
				for message in res:
					if message.startswith("node") and message.endswith("used but not defined"):
						data.update({'error': message})
			elif any([message == "Some logic rule had unkown variables" for message in res]):
				data.update({'error': "The node %s is used in the model" % request.POST['name']})

			elif len(res) > 0:
				data.update({'error': res[0]})

		else:
			self.saveMaBoSSModel(maboss_model)

		return Response(data=data, status=status.HTTP_200_OK)

class LogicalModelGraph(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		ginsim_model = self.getGINSimModel()
		fig = ginsim._get_image(ginsim_model)

		return HttpResponse(fig, content_type="image/svg+xml")


	def post(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		steady_state = loads(request.data['steady_state'])
		ginsim_model = self.getGINSimModel()
		fig = ginsim._get_image(ginsim_model, steady_state)

		return HttpResponse(fig, content_type="image/svg+xml")


class LogicalModelGraphRaw(HasModel):

	def post(self, request, project_id, model_id):
		
		HasModel.load(self, request, project_id, model_id)
		
		positions = loads(request.POST["positions"])
		
		min_x = 0
		max_x = 0
		min_y = 0
		max_y = 0
		new_positions = {}
		
		for position in positions:
			min_x = min(position['x'], min_x)
			max_x = max(position['x'], max_x)
			min_y = min(position['y'], min_y)
			max_y = max(position['y'], max_y)
			new_positions.update({position['name']: {
				'pos': [position['x'] + 30, position['y'] + 30],
				'dim': [60.0, 30.0]
			}})
		
		
		# print(min_x)
		# print(max_x)
		# print(min_y)
		# print(max_y)
		
		
		self.setLayout(((60.0 + max_x - min_x, 60 + max_y - min_y), new_positions))
		
		return Response(status=status.HTTP_200_OK)

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)

		minibn = self.getMinibnModel()
		ig = minibn.influence_graph()
		nodes = list(ig.nodes.keys())
		edges = [(source, dest, sign if sign == 1 else 0) for source, dest, sign in ig.edges(data="sign")]
	
		nodes_dict = {}
		layout = self.getLayout()
	
		for i, node in enumerate(nodes):
			if isinstance(nodes_dict, dict):
				if i not in nodes_dict.keys():
					nodes_dict.update({i: {}})
				nodes_dict[i].update({'name': node})
				
				if layout is not None and isinstance(layout[1], dict):
					if node in layout[1].keys():
						nodes_dict[i].update({
							'x': layout[1][node]['pos'][0],
							'y': layout[1][node]['pos'][1],
						})
					else:
						
						candidates = [layout_node for layout_node in layout[1].keys() if node.startswith(layout_node + '_b')]
						if len(candidates) == 1:
							nodes_dict[i].update({
								'x': layout[1][candidates[0]]['pos'][0],
								'y': layout[1][candidates[0]]['pos'][1],
							})	
				# 		for j, candidate in enumerate(candidates):
				# 			nodes_dict[i].update({
				# 				'x': layout[1][candidate]['pos'][0]+j*10,
				# 				'y': layout[1][candidate]['pos'][1]+j*10
				# 			})
			# if layout is not None:	
			# 	for node in layout[1].keys():
			# 		if node in nodes:
			# 			nodes_dict[i].update({
				# 			'x': layout[1][node]['pos'][0],
				# 			'y': layout[1][node]['pos'][1],
				# 		})
								
			

		return Response(
			{
				'nodes': nodes,
				'edges': edges,
				'dims': layout[0] if layout is not None else None,
				'nodes_dict': nodes_dict
			},
			status=status.HTTP_200_OK
		)

class LogicalModelGraphRawModify(HasModel):
	
	def post(self, request, project_id, model_id, node):
		
		HasModel.load(self, request, project_id, model_id)
		raw_layout = self.getLayout()
		if raw_layout is not None:
			dims, layout = raw_layout
			new_pos = loads(request.POST["position"]) 
			
			layout[node].update({"pos": [new_pos["x"], new_pos["y"]]})
			self.updateLayout((dims, layout))
		
		return Response(status=status.HTTP_200_OK)
		