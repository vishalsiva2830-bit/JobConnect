
from rest_framework import serializers
from .models import JobApplication


class JobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            'id',
            'job',
            'full_name',
            'email',
            'phone',
            'resume',
            'cover_letter',
            'applied_at',
        ]
        read_only_fields = ['id', 'applied_at']
