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

class LogicalModelNodes(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)
		maboss_model = self.getMaBoSSModel()

		return Response(list(maboss_model.network.keys()))

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

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)
		ginsim_model = self.getGINSimModel()

		# from ginsim.gateway import japi
		# This won't work in parallel... but that's ok for now

		path = tempfile.mkdtemp()
		tmp_reggraph = tempfile.mkstemp(dir=path, suffix='.reg')[1]

		ginsim.gateway.japi.gs.service("reggraph").export(ginsim_model, tmp_reggraph)

		edges = []
		nodes = []
		with open(tmp_reggraph, 'r') as reggraph:
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
