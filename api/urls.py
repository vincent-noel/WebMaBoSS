from django.urls import path, re_path
from django.conf import settings
from django.conf.urls.static import static

from api.views.LogicalModel import LogicalModelName, LogicalModelGraph, LogicalModelGraphRaw
from api.views.LogicalModels import LogicalModels
from api.views.Projects import Projects
from api.views.BioLQMSimulation import LogicalModelSteadyStates
from api.views.MaBoSSSimulation import LogicalModelSimulation, MaBoSSResultsFixedPoints, MaBoSSResultsNodesProbTraj, MaBoSSResultsStatesProbTraj
from api.views.AuthView import TestAuthView, LogoutViewEx
from rest_auth.views import LoginView
from rest_auth.registration.views import RegisterView, VerifyEmailView

urlpatterns = [
	path('api/is_logged_in/', TestAuthView.as_view(), name='is_logged_in', ),
	path('api/logout/', LogoutViewEx.as_view(), name='logout', ),
	path('api/login/', LoginView.as_view(), name='login', ),
	path('api/register/', RegisterView.as_view(), name='register'),
	path('account-confirm-email/', VerifyEmailView.as_view(), name='account_email_verification_sent'),
	path('account-confirm-email/<str:key>/', VerifyEmailView.as_view(), name='account_confirm_email'),

	path('api/projects/', Projects.as_view()),

	path('api/logical_models/', LogicalModels.as_view()),
	path('api/logical_models/<int:pk>/', LogicalModels.as_view()),

	path('api/logical_model/<int:pk>/name/', LogicalModelName.as_view()),
	path('api/logical_model/<int:pk>/graph/', LogicalModelGraph.as_view()),
	path('api/logical_model/<int:pk>/graph_raw/', LogicalModelGraphRaw.as_view()),
	path('api/logical_model/<int:pk>/steady_states/', LogicalModelSteadyStates.as_view()),
	path('api/logical_model/<int:pk>/maboss/', LogicalModelSimulation.as_view()),

	path('api/maboss/<int:pk>/fixed_points/', MaBoSSResultsFixedPoints.as_view()),
	path('api/maboss/<int:pk>/states_trajs/', MaBoSSResultsStatesProbTraj.as_view()),
	path('api/maboss/<int:pk>/nodes_trajs/', MaBoSSResultsNodesProbTraj.as_view()),
]
