"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include,re_path
from rest_framework import permissions
# from drf_yasg.views import get_schema_view
# from drf_yasg import openapi
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.views.generic import TemplateView
import os
from pathlib import Path
# schema_view = get_schema_view(
#     openapi.Info(
#         title="My API",
#         default_version='v1',
#         description="Test Api documentation"
#     ),
#     public=True,
#     permission_classes=(permissions.AllowAny,),
# )

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = os.path.join(BASE_DIR, 'frontend', 'build')




urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    # path('swagger/',schema_view.with_ui('swagger',cache_timeout=0),name='schema-swagger-ui'),
    # path('redoc/',schema_view.with_ui('redoc',cache_timeout=0),name='schema-redoc'),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('product/',include('product.urls')),
    path('auth/',include('users.urls')),
    path('cart/',include('cart.urls')),
    path('orders/',include('orders.urls')),
    path('payment/',include('payment.urls')),
    path('wishlist/',include('wishlist.urls')),
    path('adminpanel/',include('adminpanel.urls')),

     re_path(r'^.*$', TemplateView.as_view(template_name=os.path.join(FRONTEND_DIR, 'index.html'))),
]
