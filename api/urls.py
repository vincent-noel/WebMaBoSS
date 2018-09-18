from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static

from api.views.LogicalModel import LogicalModelFile, LogicalModelName, LogicalModelNodes, LogicalModelGraph, LogicalModelGraphRaw
from api.views.LogicalModels import LogicalModels
from api.views.Projects import Projects
from api.views.BioLQMSimulation import LogicalModelSteadyStates
from api.views.MaBoSSSimulation import (
	LogicalModelSimulation, MaBoSSResultsFixedPoints, MaBoSSResultsNodesProbTraj, MaBoSSResultsStatesProbTraj,
	MaBoSSSimulationRemove, MaBossSettings
)
from api.views.maboss.MaBossServer import MaBoSSServer
from api.views.AuthView import TestAuthView, LogoutViewEx
from rest_auth.views import LoginView
from rest_auth.registration.views import RegisterView, VerifyEmailView
from rest_framework.documentation import include_docs_urls
from django.conf.urls import include

urlpatterns = [
	path('api/', include_docs_urls(title='AppCurie API')),
	re_path('api-auth/', include('rest_framework.urls')),
	path('api/auth/is_logged_in', TestAuthView.as_view(), name='is_logged_in', ),
	path('api/auth/logout', LogoutViewEx.as_view(), name='logout', ),
	path('api/auth/login', LoginView.as_view(), name='login', ),
	path('api/auth/register', RegisterView.as_view(), name='register'),
	path('api/auth/account-confirm-email', VerifyEmailView.as_view(), name='account_email_verification_sent'),
	path('api/auth/account-confirm-email/<str:key>', VerifyEmailView.as_view(), name='account_confirm_email'),

	path('api/projects/', Projects.as_view()),
	path('api/projects/<int:project_id>', Projects.as_view()),

	# path('api/logical_models/', LogicalModels.as_view()),
	path('api/logical_models/<int:project_id>/', LogicalModels.as_view()),
	path('api/logical_models/<int:project_id>/<int:model_id>', LogicalModels.as_view()),

	path('api/logical_model/<int:project_id>/<int:model_id>/file', LogicalModelFile.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/name', LogicalModelName.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/nodes', LogicalModelNodes.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/graph', LogicalModelGraph.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/graph_raw', LogicalModelGraphRaw.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/steady_states', LogicalModelSteadyStates.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/maboss', LogicalModelSimulation.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/maboss/settings/', MaBossSettings.as_view()),

	path('api/maboss/<int:simulation_id>/', MaBoSSSimulationRemove.as_view()),
	path('api/maboss/<int:simulation_id>/fixed_points/', MaBoSSResultsFixedPoints.as_view()),
	path('api/maboss/<int:simulation_id>/states_trajs/', MaBoSSResultsStatesProbTraj.as_view()),
	path('api/maboss/<int:simulation_id>/nodes_trajs/', MaBoSSResultsNodesProbTraj.as_view()),
	path('api/maboss/servers/', MaBoSSServer.as_view())

]
