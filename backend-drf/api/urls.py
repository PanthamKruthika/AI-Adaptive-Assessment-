from django.urls import path
from users import views as UserView
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from assessment import views as AssessmentView
from subjects import views as SubjectView

urlpatterns = [
    path('register/', UserView.RegisterView.as_view()),

    # USER APIs
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserView.ProfileView.as_view()),

    #Subject Api
    path('subjects/', SubjectView.SubjectList.as_view()),
    path('topics/<int:subject_id>', SubjectView.TopicsList.as_view()),

    #Assessment
    path('start/', AssessmentView.StartAssessmentView.as_view() ),
    path('submit/', AssessmentView.SubmitAnswerView.as_view()),
    path('dashboard/results/', AssessmentView.ResultsDashboardView.as_view()),

]