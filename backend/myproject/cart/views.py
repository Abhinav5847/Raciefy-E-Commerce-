from django.shortcuts import render
from .models import CartItem
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from  .serializer import CartSerializer
from rest_framework.views import APIView

# class CartView(viewsets.ModelViewSet):
#     serializer_class = CartSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         return CartItem.objects.filter(user=self.request.user)
    
#     def create(self, request, *args, **kwargs):
#         product = request.data.get('product')
#         quantity = int(request.data.get('quantity',1))

#         try:
#             cart_item = CartItem.objects.get(user=self.request.user,product_id = product)
#             cart_item.quantity  += quantity
#             cart_item.save()

#             serializer = self.get_serializer(cart_item)

#             return Response(serializer.data)
        
#         except CartItem.DoesNotExist:
#             serializer = self.get_serializer(data=request.data)
#             serializer.is_valid(raise_exception=True)
#             serializer.save(user=request.user)

#             return Response(serializer.data,status=status.HTTP_201_CREATED)      
     
class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
       try: 
        cart_item = CartItem.objects.filter(user=request.user)
        serializer = CartSerializer(cart_item,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
       except Exception as e:
          return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self,request):
       product = request.data.get('product')
       quantity = request.data.get('quantity',1)

       try:
            cart_item = CartItem.objects.get(
                user=request.user,
                product_id=product
            )
            cart_item.quantity += quantity
            cart_item.save()

            serializer = CartSerializer(cart_item)
            return Response(serializer.data, status=status.HTTP_200_OK)
       
       except CartItem.DoesNotExist:
            serializer = CartSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(user=request.user)

            return Response(serializer.data, status=status.HTTP_201_CREATED) 
    
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import CartItem


class CartDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return CartItem.objects.get(pk=pk, user=user)
        except CartItem.DoesNotExist:
            return None

    def delete(self, request, pk):
       try: 
        cart_item = self.get_object(pk, request.user)

        if not cart_item:
            return Response(
                {"error": "Item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item.delete()
        return Response(
            {"message": "Item deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
       except Exception as e:
           return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR) 

    def patch(self, request, pk):
        try:
            cart_item = self.get_object(pk, request.user)

            if not cart_item:
                return Response(
                    {"error": "Item not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            quantity = int(request.data.get("quantity", 1))

         
            cart_item.quantity += quantity

            if cart_item.quantity <= 0:
                cart_item.delete()
                return Response(
                    {"message": "Item removed successfully"},
                    status=status.HTTP_204_NO_CONTENT
                )

            cart_item.save()
            serializer = CartSerializer(cart_item)

            return Response(serializer.data, status=status.HTTP_200_OK)

        except ValueError:
            return Response(
                {"error": "Quantity must be a number"},
                status=status.HTTP_400_BAD_REQUEST
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )       
       

# Create your views here.
