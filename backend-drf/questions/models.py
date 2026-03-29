from django.db import models
from assessment.models import Assignment

class Question(models.Model):

    DIFFICULTY_LEVEL = (('easy', 'Easy'),('medium', 'Medium'),('hard', 'Hard'), )

    assignment = models.ForeignKey(Assignment,on_delete=models.CASCADE,related_name="questions")

    question = models.TextField()

    option1 = models.CharField(max_length=200)
    option2 = models.CharField(max_length=200)
    option3 = models.CharField(max_length=200)
    option4 = models.CharField(max_length=200)

    answer = models.CharField(max_length=200)

    difficulty = models.CharField(max_length=10,choices=DIFFICULTY_LEVEL)

    def __str__(self):
        return f'{self.assignment}  --  {self.difficulty}  -- {self.question}  '
