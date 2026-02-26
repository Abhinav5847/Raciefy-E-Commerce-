from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import OrdersView

# router = DefaultRouter()
# router.register(r'order',OrdersView,basename='order')

urlpatterns = [
    # path('',include(router.urls))
    path('order/',OrdersView.as_view(),name='orders')
]