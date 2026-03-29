from django.shortcuts import render
from . models import Subject,Topic
from . serializers import SubjectSerializer, TopicSerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

class SubjectList(APIView):
    def get(self, request):
        subjects = Subject.objects.all()
        serializer = SubjectSerializer(subjects, many=True)
        return Response(serializer.data,status = status.HTTP_200_OK)
    

class TopicsList(APIView):
    def get(self,request, subject_id):
        topics = Topic.objects.filter(subject_id=subject_id)  
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data, status = status.HTTP_200_OK ) 
    
         
