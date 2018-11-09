from api.views.HasModel import HasModel
from rest_framework.response import Response
from rest_framework import status

import biolqm


class LogicalModelSteadyStates(HasModel):

	def get(self, request, project_id, model_id):

		HasModel.load(self, request, project_id, model_id)
		biolqm_model = self.getBioLQMModel()
		ss = biolqm.fixpoints(biolqm_model)
		return Response(ss, status=status.HTTP_200_OK)

