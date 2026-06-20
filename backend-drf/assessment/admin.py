from django.contrib import admin
from . models import Assignment, AssessmentSession

class AssignmentAdmin(admin.ModelAdmin):
    list_display=['id','topic','title']
    ordering=['id']

class AssessmentSessionAdmin(admin.ModelAdmin):
    list_display = ['user','assignment','score']
    list_filter =['assignment']
    search_fields=['assignment','user']
    ordering=['id']


admin.site.register(Assignment, AssignmentAdmin)
admin.site.register(AssessmentSession, AssessmentSessionAdmin)