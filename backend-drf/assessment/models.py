from django.db import models
from subjects.models import Topic
from django.contrib.auth import get_user_model

User = get_user_model()

class Assignment(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    total_questions = models.IntegerField(default=10)

    def __str__(self):
        return self.title
    


class AssessmentSession(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)

    score = models.IntegerField(default=0)
    question_number = models.IntegerField(default=0)

    current_difficulty = models.CharField(max_length=10,default="medium")
    is_completed = models.BooleanField(default=False)

    asked_questions = models.ManyToManyField('questions.Question', blank=True)
    def __str__(self):
        return f"{self.user} - {self.assignment}"

