from django.shortcuts import render
from .models import Orders
from .serializers import OrderSerializer,OrderCreateSerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from cart.models import CartItem
from django.db import transaction



class OrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
       try: 
        user = request.user
        orders = Orders.objects.filter(user=user).order_by('-created_at')
        serializer = OrderSerializer(orders,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
       except Exception as e:
          return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
   
    def post(self,request):
       try: 
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        address_obj = serializer.validated_data['address']
        paymentMethod = serializer.validated_data['paymentMethod']
        razorpay_payment_id = serializer.validated_data.get('razorpay_payment_id')

        address_str = f"{address_obj.get('name')}, {address_obj.get('phone')}, {address_obj.get('street')}, {address_obj.get('city')} - {address_obj.get('pincode')}"
        
        user = request.user
        cart_items = CartItem.objects.filter(user=user)

        if not cart_items.exists():
            return Response({"error":"cart is empty"},status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
         for item in cart_items:
            Orders.objects.create(
                user=user,
                product=item.product,
                quantity = item.quantity,
                total_price = item.quantity * item.product.price,
                address = address_str,
                payment_method = paymentMethod,
                razorpay_payment_id = razorpay_payment_id
            )

         cart_items.delete()

        return Response({"message":"order placed"},status=status.HTTP_200_OK)

       except Exception as e:
          return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)




    
# Create your views here.
