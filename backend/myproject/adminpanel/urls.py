from django.urls import path
from .views import AdminUserView
from .views import AdminLoginView,AdminViewList,AdminOrdersView,AdminStatusToogle,AdminSoftdelete
from .views import AdminProduct,AdminProductSoftdelete,AdminProductDetails

urlpatterns = [
    path('login/',AdminLoginView.as_view()),
    path('total_users/',AdminViewList.as_view()),
    path('total_orders/',AdminOrdersView.as_view()),
    path('total_orders/<int:order_id>/',AdminOrdersView.as_view()),
    path('status_toggle/<int:user_id>/',AdminStatusToogle.as_view()),
    path('user_view/<int:user_id>/',AdminUserView.as_view()),
    path('soft_delete/<int:user_id>/',AdminSoftdelete.as_view()),
    path('product_list/',AdminProduct.as_view()),
    path('product_delete/<int:product_id>/',AdminProductSoftdelete.as_view()),
    path('product/<int:product_id>/',AdminProductDetails.as_view()),
]