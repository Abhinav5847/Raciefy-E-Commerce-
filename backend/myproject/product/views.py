from django.shortcuts import render
from rest_framework.views import APIView 
from .models import Product
from .serializers import ProductSerializer
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

class PingView(APIView):
    permission_classes = []

    def get(self, request):
        return Response({"status": "ok"})


class ProductViewSet(APIView):
    permission_classes = [AllowAny]


    def get(self,request):
       try: 
        products = Product.objects.filter(is_delete=False).order_by('-created_at')
        serializer = ProductSerializer(products,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
       except Exception as e:
          return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductDetailedView(APIView):
   permission_classes = [AllowAny]

   def get(self,request,product_id):
      try:
         product = Product.objects.filter(id=product_id,is_delete=False).first()
         serializer = ProductSerializer(product)
         return Response(serializer.data,status=status.HTTP_200_OK)
      except Exception as e:
         return Response({"error":str(e)})
# Create your views here.
