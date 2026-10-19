from django.urls import path
from .views import estimate_job_cost

urlpatterns = [
    path("estimate/", estimate_job_cost, name="ml-estimate-job"),
]
