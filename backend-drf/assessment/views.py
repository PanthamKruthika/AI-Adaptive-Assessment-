from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from . models import Assignment,AssessmentSession
from questions.models import Question
from rest_framework.response import Response
from . ml_model import predict_next
from django.contrib.auth import get_user_model

User = get_user_model()


class StartAssessmentView(APIView):
    permission_classess = [IsAuthenticated]
    def post(self, request):

        user = request.user
        topic_id = request.data.get("topic_id")

        assignment = Assignment.objects.get(topic_id=topic_id)

        session = AssessmentSession.objects.create(user=user,assignment=assignment)

        question = Question.objects.filter(assignment=assignment,difficulty="medium").order_by('?').first()

        return Response({
            "session_id": session.id,
            "question": question.question,
            "options": [
                question.option1,
                question.option2,
                question.option3,
                question.option4
            ],
            "question_id": question.id
        })
    


class SubmitAnswerView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        

        session_id = request.data.get("session_id")
        question_id = request.data.get("question_id")
        selected = request.data.get("selected_option")

        session = AssessmentSession.objects.get(id=session_id,user=request.user)
        question = Question.objects.get(id=question_id)

        correct = 1 if selected == question.answer else 0

        # scoring
        if correct:
            if question.difficulty == "easy":
                session.score += 1
            elif question.difficulty == "medium":
                session.score += 2
            else:
                session.score += 3

        # ML prediction
        next_difficulty = predict_next(
            correct,
            session.current_difficulty,
            session.question_number
        )

        session.current_difficulty = next_difficulty
        session.question_number += 1
        session.save()

        # stop condition
        if session.question_number >= session.assignment.total_questions:
            session.is_completed = True
            session.save()

            return Response({
                "completed": True,
                "score": session.score
            })

        session.asked_questions.add(question)

        asked = session.asked_questions.all()

        next_question = Question.objects.filter(assignment=session.assignment,difficulty=next_difficulty).exclude(id__in=asked).order_by('?').first()

        return Response({
            "question": next_question.question,
            "options": [
                next_question.option1,
                next_question.option2,
                next_question.option3,
                next_question.option4
            ],
            "question_id": next_question.id
        })