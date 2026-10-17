
from django.urls import path
from .views import job_list, JobApplicationCreateView

urlpatterns = [
    path('jobs/', job_list, name='job_list'),
    path(
        'applications/',
        JobApplicationCreateView.as_view(),
        name='create_application'
    ),
]
