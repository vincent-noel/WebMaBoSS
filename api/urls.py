from django.urls import path, re_path

from api.views.logical_model.LogicalModel import (
	LogicalModelFile, LogicalModelSBMLFile, LogicalModelMaBoSSBNDFile, LogicalModelMaBoSSCFGFile,
	LogicalModelName, LogicalModelNodes, LogicalModelGraph, LogicalModelGraphRaw
)
from api.views.logical_model.LogicalModels import LogicalModels
from api.views.logical_model.LogicalModelsTags import LogicalModelsTags, TaggedLogicalModelFile, TaggedLogicalModelSBMLFile
from api.views.Projects import Projects
from api.views.BioLQMSimulation import LogicalModelSteadyStates

from api.views.maboss.MaBossServerView import MaBoSSServerView
from api.views.maboss.MaBoSSSimulationView import MaBoSSSimulationView, MaBoSSSimulationRemove, MaBossSettings
from api.views.maboss.MaBoSSSensitivityAnalysisView import MaBoSSSensitivityAnalysisView, MaBoSSSensitivityAnalysisRemove, MaBoSSSensitivitySteadyStatesView
from api.views.maboss.MaBoSSResultsView import MaBoSSResultsFixedPoints, MaBoSSResultsNodesProbTraj, MaBoSSResultsStatesProbTraj
from api.views.maboss.MaBoSSModel import (
	MaBoSSSpeciesFormulas, MaBoSSSpeciesFormula, MaBoSSCheckFormula,
	MaBoSSParameters, MaBoSSParameter, MaBoSSCheckParameter,
	MaBoSSInitialStates, MaBoSSModelSettings
)
from api.views.AuthView import TestAuthView, LogoutViewEx, UserEmailView
from api.views.InstallStatus import InstallStatus

from rest_auth.views import LoginView, PasswordChangeView
from rest_auth.registration.views import RegisterView, VerifyEmailView

from rest_framework.documentation import include_docs_urls
from django.conf.urls import include

urlpatterns = [
	path('api/', include_docs_urls(title='InFlame API')),
	re_path('api-auth/', include('rest_framework.urls')),
	path('api/auth/is_logged_in', TestAuthView.as_view(), name='is_logged_in', ),
	path('api/auth/logout', LogoutViewEx.as_view(), name='logout', ),
	path('api/auth/login', LoginView.as_view(), name='login', ),
	path('api/auth/register', RegisterView.as_view(), name='register'),
	path('api/auth/email', UserEmailView.as_view(), name='user_email'),
	path('api/auth/password/change/', PasswordChangeView.as_view(), name='password_change'),
	path('api/auth/account-confirm-email', VerifyEmailView.as_view(), name='account_email_verification_sent'),
	path('api/auth/account-confirm-email/<str:key>', VerifyEmailView.as_view(), name='account_confirm_email'),

	path('api/projects/', Projects.as_view()),
	path('api/projects/<int:project_id>', Projects.as_view()),

	# path('api/logical_models/', LogicalModels.as_view()),
	path('api/logical_models/<int:project_id>/', LogicalModels.as_view()),
	path('api/logical_models/<int:project_id>/<int:model_id>', LogicalModels.as_view()),
	path('api/logical_models/<int:project_id>/<int:model_id>/tags/', LogicalModelsTags.as_view()),
	path('api/logical_models/<int:project_id>/<int:model_id>/tags/<str:tag>', LogicalModelsTags.as_view()),

	path('api/logical_models/<int:project_id>/<int:model_id>/tags/<str:tag>/file', TaggedLogicalModelFile.as_view()),
	path('api/logical_models/<int:project_id>/<int:model_id>/tags/<str:tag>/sbmlfile', TaggedLogicalModelSBMLFile.as_view()),

	path('api/logical_models/<int:project_id>/<int:model_id>/file', LogicalModelFile.as_view()),
	path('api/logical_models/<int:project_id>/<int:model_id>/sbmlfile', LogicalModelSBMLFile.as_view()),
	path('api/logical_models/<int:project_id>/<int:model_id>/bndfile', LogicalModelMaBoSSBNDFile.as_view()),
	path('api/logical_models/<int:project_id>/<int:model_id>/cfgfile', LogicalModelMaBoSSCFGFile.as_view()),

	path('api/logical_model/<int:project_id>/<int:model_id>/name', LogicalModelName.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/nodes', LogicalModelNodes.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/graph', LogicalModelGraph.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/graph_raw', LogicalModelGraphRaw.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/steady_states', LogicalModelSteadyStates.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/maboss', MaBoSSSimulationView.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/maboss_sensitivity', MaBoSSSensitivityAnalysisView.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/maboss/settings/', MaBossSettings.as_view()),

	path('api/logical_model/<int:project_id>/<int:model_id>/formulas', MaBoSSSpeciesFormulas.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/formula/<str:node>/<str:field>', MaBoSSSpeciesFormula.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/check_formula/<str:node>/<str:field>', MaBoSSCheckFormula.as_view()),

	path('api/logical_model/<int:project_id>/<int:model_id>/parameters', MaBoSSParameters.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/parameter/<str:name>', MaBoSSParameter.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/check_parameter/<str:name>', MaBoSSCheckParameter.as_view()),

	path('api/logical_model/<int:project_id>/<int:model_id>/initial_states', MaBoSSInitialStates.as_view()),
	path('api/logical_model/<int:project_id>/<int:model_id>/settings', MaBoSSModelSettings.as_view()),

	path('api/maboss/<int:project_id>/<int:simulation_id>/', MaBoSSSimulationRemove.as_view()),
	path('api/maboss/<int:project_id>/<int:simulation_id>/fixed_points/', MaBoSSResultsFixedPoints.as_view()),
	path('api/maboss/<int:project_id>/<int:simulation_id>/states_trajs/', MaBoSSResultsStatesProbTraj.as_view()),
	path('api/maboss/<int:project_id>/<int:simulation_id>/nodes_trajs/', MaBoSSResultsNodesProbTraj.as_view()),

	path('api/maboss_sensitivity/<int:project_id>/<int:analysis_id>/', MaBoSSSensitivityAnalysisRemove.as_view()),
	path('api/maboss_sensitivity/<int:project_id>/<int:analysis_id>/steady_states/', MaBoSSSensitivitySteadyStatesView.as_view()),

	path('api/maboss/servers/', MaBoSSServerView.as_view()),
	path('api/maboss/servers/<int:server_id>', MaBoSSServerView.as_view()),

	path('api/install_status', InstallStatus.as_view()),
]
