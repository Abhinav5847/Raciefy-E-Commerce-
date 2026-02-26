from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import CartView,CartDetailView


urlpatterns = [
     path('',CartView.as_view(),name='cart'),
     path('cart_delete/<int:pk>/',CartDetailView.as_view(),name='deletecart'),

]