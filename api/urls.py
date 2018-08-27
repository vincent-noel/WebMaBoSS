from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static

from api.views.LogicalModel import LogicalModelName, LogicalModelGraph, LogicalModelGraphRaw
from api.views.LogicalModels import LogicalModels
from api.views.BioLQMSimulation import LogicalModelSteadyStates
from api.views.MaBoSSSimulation import LogicalModelSimulation, MaBoSSResultsFixedPoints, MaBoSSResultsNodesProbTraj, MaBoSSResultsStatesProbTraj

urlpatterns = [
	path('api/logical_models/', LogicalModels.as_view()),


	path('api/logical_model/<int:pk>/name/', LogicalModelName.as_view()),
	path('api/logical_model/<int:pk>/graph/', LogicalModelGraph.as_view()),
	path('api/logical_model/<int:pk>/graph_raw/', LogicalModelGraphRaw.as_view()),
	path('api/logical_model/<int:pk>/steady_states/', LogicalModelSteadyStates.as_view()),
	path('api/logical_model/<int:pk>/maboss/', LogicalModelSimulation.as_view()),

	path('api/maboss/<int:pk>/fixed_points/', MaBoSSResultsFixedPoints.as_view()),
	path('api/maboss/<int:pk>/states_trajs/', MaBoSSResultsStatesProbTraj.as_view()),
	path('api/maboss/<int:pk>/nodes_trajs/', MaBoSSResultsNodesProbTraj.as_view()),
]
