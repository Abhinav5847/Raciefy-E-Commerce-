from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import WishList
from .serializers import WishlistSerializer
from rest_framework.response import Response
from rest_framework import status
from product.models import Product

class WishlistView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):
        items = WishList.objects.filter(user=request.user)
        serializer = WishlistSerializer(items,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def post(self,request):

        product_id = request.data.get('product_id')

        if not product_id:
            return Response({"error":"product id is required"})
        
        try:
            product = Product.objects.get(id=product_id)

        except Product.DoesNotExist:
            return Response({"error":"product does not exit"},status=status.HTTP_400_BAD_REQUEST)

        wishlist_item = WishList.objects.filter(user=request.user,product=product)

        if wishlist_item.exists():
            wishlist_item.delete()
            return Response({"message":"product removed from wishlist"},status=status.HTTP_200_OK) 
        else:
            WishList.objects.create(user=request.user,product=product)
            return Response({"message":"product added to wishlist"},status=status.HTTP_201_CREATED)   
        


# Create your views here.
