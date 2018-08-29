from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.http import Http404
from django.conf import settings

from api.models import LogicalModel

from os.path import join

class LogicalModelSteadyStates(APIView):

	def get(self, request, pk):
		try:

			model = LogicalModel.objects.get(user=request.user, pk=pk)
			import ginsim
			path = join(settings.MEDIA_ROOT, model.file.path)
			ginsim_model = ginsim.load(path)

			import biolqm
			biolqm_model = ginsim.to_biolqm(ginsim_model)
			ss = biolqm.fixpoints(biolqm_model)
			return Response(ss, status=status.HTTP_200_OK)


		except LogicalModel.DoesNotExist:
			raise Http404
