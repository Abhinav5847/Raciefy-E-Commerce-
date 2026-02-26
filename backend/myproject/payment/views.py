from django.shortcuts import render
from rest_framework import status
import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializer import PaymentSerializer
from drf_yasg.utils import swagger_auto_schema

class PaymentView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PaymentSerializer

    @swagger_auto_schema(request_body=PaymentSerializer)
    def post(self,request):
      try:
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = serializer.validated_data['amount']

        client = razorpay.Client(
                auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
            )
        payment = client.order.create({
                "amount": amount * 100,  
                "currency": "INR",
                "payment_capture": 1
        })
        
        return Response(payment,status=status.HTTP_201_CREATED)
      except razorpay.errors.BadRequestError as e:
            return Response({"error": "Invalid request to Razorpay", "details": str(e)},status=status.HTTP_400_BAD_REQUEST)

      except razorpay.errors.ServerError as e:
            return Response({"error": "Razorpay server error", "details": str(e)},status=status.HTTP_502_BAD_GATEWAY)

      except Exception as e:
            return Response({"error": "Something went wrong", "details": str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
              

# Create your views here.
