from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet,ProductDetailedView

urlpatterns = [
    path('products/',ProductViewSet.as_view(),name='products'),
    path('productview/<int:product_id>/',ProductDetailedView.as_view(),name='productsview')
]