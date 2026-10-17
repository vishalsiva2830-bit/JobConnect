
from django.contrib import admin
from .models import Job, JobApplication


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'company_name', 'location', 'job_type')
    search_fields = ('title', 'company_name', 'location')


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'email', 'phone', 'job', 'applied_at')
    search_fields = ('full_name', 'email', 'phone', 'job__title')
    list_filter = ('applied_at', 'job')
    readonly_fields = ('applied_at',)
