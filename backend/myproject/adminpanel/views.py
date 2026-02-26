from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from users.models import CustomUser
from orders.models import Orders
from product.models import Product
from .serializers import AdminUserview,ProductSerializer,UserSerializer,AdminOrderserializer
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone

class AdminLoginView(APIView):
    def post(self,request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')

            if not email or not password:
                return Response({"error":"email and password are required"},status=status.HTTP_400_BAD_REQUEST)
            
            user = authenticate(request,username=email,password=password)

            if not user:
                return Response({"error":"Invalid credentials"},status=status.HTTP_401_UNAUTHORIZED)
            
            if not user.is_staff:
                return Response({"error" : "You are not authorized as admin"},status=status.HTTP_403_FORBIDDEN)
            
            refresh = RefreshToken.for_user(user)

            return Response({
                "access" : str(refresh.access_token),
                "refresh" : str(refresh),
                "admin_name" : user.name
            },status=status.HTTP_200_OK)
        

        except Exception as e:
            return Response(
                {"error": "Database error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AdminViewList(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request):
       try: 
        users = CustomUser.objects.filter(is_delete=False)  
        data=[
            {
                'id':user.id,
                'email':user.email,
                "name":user.name,
                "is_active" : user.is_active
            }
            for user in users
        ]
        return Response(data,status=status.HTTP_200_OK)
       except Exception as e:
          return Response({"error":"user fetching error"})
    
       
class AdminStatusToogle(APIView):
    permission_classes = [IsAdminUser]

    def patch(self,request,user_id):
        try:
            user = CustomUser.objects.get(id=user_id,is_delete=False)

            user.is_active = not user.is_active
            user.save()

            return Response({
                "message": "User status updated successfully",
                "is_active": user.is_active
            }, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({"error":"user not found"},status=status.HTTP_404_NOT_FOUND)

class AdminUserView(APIView):
   permission_classes = [IsAdminUser]

   def get(self,request,user_id):
      try:
         user = CustomUser.objects.get(id=user_id,is_delete=False)
         serializer = AdminUserview(user)
         return Response(serializer.data,status=status.HTTP_200_OK)
      except CustomUser.DoesNotExist:
         return Response({"error":"user doest not exit"})

class AdminSoftdelete(APIView):
    permission_classes = [IsAdminUser]

    def patch(self,request,user_id):
       
       try:
        user = CustomUser.objects.get(id=user_id,is_delete = False)

        user.is_delete = True
        user.deleted_at = timezone.now()
        user.save()

        return Response({
            "message":"user soft deleted successfully"
        },status=status.HTTP_200_OK)
       
       except CustomUser.DoesNotExist:
           return Response({"error":"user not exit"},status=status.HTTP_404_NOT_FOUND)

class AdminOrdersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request):
       try: 
        orders = Orders.objects.all().order_by('-created_at')
        serializer = AdminOrderserializer(orders,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)   
       except Exception as e:
           return Response({"error":"admin orders issue"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def patch(self,request,order_id):
       try:
          order = Orders.objects.get(id=order_id)
       except Orders.DoesNotExist:
          return Response({"error":"order not found"},status=status.HTTP_404_NOT_FOUND)     
          
       new_status = request.data.get('status')

       if new_status not in dict(Orders.STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=status.HTTP_404_NOT_FOUND)

       order.status = new_status
       order.save()
       return Response({"message":"success"},status=status.HTTP_200_OK)

class AdminProduct(APIView):
   permission_classes = [IsAdminUser]

   def get(self,request):
      try:
         products = Product.objects.filter(is_delete=False)
         serializer = ProductSerializer(products,many=True)
         return Response(serializer.data,status=status.HTTP_200_OK)
      except Exception as e:
         return Response({"error":"error from product fetching admin"})
      
   def post(self,request):
     try: 
      serializer = ProductSerializer(data=request.data)
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data,status=status.HTTP_201_CREATED)
     except Exception as e:
        return Response({"error":"product posting issue"})
     
     return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class AdminProductDetails(APIView):
   permission_classes = [IsAdminUser]

   def get(self,request,product_id):
      try:
         product = Product.objects.get(id=product_id,is_delete=False)
         serializer = ProductSerializer(product)
         return Response(serializer.data,status=status.HTTP_200_OK)
      except Product.DoesNotExist:
         return Response({"err":"product does not exit"},status=status.HTTP_404_NOT_FOUND)


   def patch(self,request,product_id):
     try: 
      product = Product.objects.get(id=product_id,is_delete=False)

      serializer = ProductSerializer(product,data=request.data,partial=True) 
      
      if serializer.is_valid():
         serializer.save()
         return Response(serializer.data,status=status.HTTP_200_OK)
      
      return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
     
     except Exception as e:
        return Response({"error":"product not found"},status=status.HTTP_404_NOT_FOUND)
    

class AdminProductSoftdelete(APIView):
   permission_classes = [IsAdminUser]

   def patch(self,request,product_id):
      try:
         product = Product.objects.get(id=product_id,is_delete=False)

         product.is_delete = True
         product.deleted_at = timezone.now()
         product.save() 

         return Response({"message":"product deleted successfully"},status=status.HTTP_200_OK)
      except Exception as e:
         return Response({"message" : " product not found"},status=status.HTTP_404_NOT_FOUND)

# Create your views here.
