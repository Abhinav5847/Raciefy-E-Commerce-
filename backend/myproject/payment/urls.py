from django.urls import path
from .views import PaymentView

urlpatterns = [
    path('create_order/',PaymentView.as_view(),name='payment')
]