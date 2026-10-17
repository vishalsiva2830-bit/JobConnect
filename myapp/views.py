
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics
from .models import Job, JobApplication
from .serializers import JobApplicationSerializer


@api_view(['GET'])
def job_list(request):
    jobs = Job.objects.all().order_by('-created_at')

    data = []
    for job in jobs:
        data.append({
            'id': job.id,
            'title': job.title,
            'company_name': job.company_name,
            'location': job.location,
            'job_type': job.job_type,
            'salary': job.salary,
            'description': job.description,
            'requirements': job.requirements,
            'created_at': job.created_at,
        })

    return Response(data)


class JobApplicationCreateView(generics.CreateAPIView):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
