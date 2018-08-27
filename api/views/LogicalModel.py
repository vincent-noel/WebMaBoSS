from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.http import Http404, HttpResponse
from django.conf import settings

from api.models import LogicalModel
from api.serializers import LogicalModelNameSerializer

from os.path import join


class LogicalModelName(APIView):

	def get(self, request, pk):
		try:

			model = LogicalModel.objects.get(pk=pk)
			serializer = LogicalModelNameSerializer(model)

			return Response(serializer.data)
		except LogicalModel.DoesNotExist:
			raise Http404



class LogicalModelGraph(APIView):

	def get(self, request, pk):
		try:

			model = LogicalModel.objects.get(pk=pk)
			import ginsim
			path = join(settings.MEDIA_ROOT, model.file.path)
			ginsim_model = ginsim.load(path)
			fig = ginsim.get_image(ginsim_model)

			return HttpResponse(fig, content_type="image/png")

		except LogicalModel.DoesNotExist:
			raise Http404




class LogicalModelGraphRaw(APIView):

	def get(self, request, pk):
		try:

			model = LogicalModel.objects.get(pk=pk)
			import ginsim
			path = join(settings.MEDIA_ROOT, model.file.path)
			ginsim_model = ginsim.load(path)

			from ginsim.gateway import japi
			# This won't work in parallel... but that's ok for now
			filename = join(settings.TMP_ROOT, "reggraph")
			japi.gs.service("reggraph").export(ginsim_model, filename)

			edges = []
			nodes = []
			with open(filename, 'r') as reggraph:
				for line in reggraph.readlines():
					(a, sign, b) = line.strip().split()
					nodes.append(a)
					nodes.append(b)
					edges.append((a, b, (1 if sign == "->" else 0)))

			nodes = list(set(nodes))

			# print(nodes)
			# print(edges)

			return Response(
				{
					'nodes': nodes,
					'edges': edges
				},
				status=status.HTTP_200_OK
			)

		except LogicalModel.DoesNotExist:
			raise Http404
