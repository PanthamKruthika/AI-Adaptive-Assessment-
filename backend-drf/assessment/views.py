from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from . models import Assignment,AssessmentSession
from questions.models import Question
from rest_framework.response import Response
from . ml_model import predict_next
from django.contrib.auth import get_user_model

User = get_user_model()


class StartAssessmentView(APIView):
    permission_classes = [IsAuthenticated]
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
        if question.difficulty == "easy":
            marks = 1

        elif question.difficulty == "medium":
            marks = 2

        else:
            marks = 3


        # total possible marks
        session.total_marks += marks


        # obtained marks
        if correct:
            session.score += marks

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
    



class ResultsDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        sessions = AssessmentSession.objects.filter(
            user=request.user,
            is_completed=True
        )

        data = []

        for session in sessions:

            if session.total_marks == 0:
                continue

            percentage = 0

            if session.total_marks > 0:

                percentage = (
                    session.score / session.total_marks
                ) * 100

            data.append({

                "session_id": session.id,

                "assignment": session.assignment.title,

                "topic": session.assignment.topic.name,

                "score": session.score,

                "total_marks": session.total_marks,

                "questions_attempted": session.question_number,

                "percentage": round(percentage, 2),

            })

        return Response(data)