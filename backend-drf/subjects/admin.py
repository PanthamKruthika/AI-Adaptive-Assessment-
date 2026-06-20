from django.contrib import admin
from . models import Subject,Topic


class TopicAdmin(admin.ModelAdmin):
    list_display=['id','subject','name']
    list_filter =['subject']
    ordering=['id']

admin.site.register(Subject)
admin.site.register(Topic, TopicAdmin)