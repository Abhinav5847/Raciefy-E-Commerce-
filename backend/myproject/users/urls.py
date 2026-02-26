from django.urls import path
from .views import RegisterView,LoginView,CurrentUserView,VerifyEmailView

urlpatterns = [
    path('register/',RegisterView.as_view(),name='register'),
    path('verify-email/<uuid:token>/', VerifyEmailView.as_view(), name="verify-email"),
    path('login/',LoginView.as_view(),name='login'),
    path('user/', CurrentUserView.as_view(), name='current_user'),
]