from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient,APITestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from unittest.mock import patch,MagicMock

user = get_user_model()

class PaymentTest(APITestCase):
    def setUp(self):
        self.user = user.objects.create_user(
             email="user@example.com",
            password="testpass123",
            is_active=True,
            is_verified=True
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.url = reverse('payment')

    @patch("payment.views.razorpay.Client")
    def test_payment(self,mock_razorpay ):
         mock_razorpay.return_value.order.create.return_value = {
            "id": "order_test123",
            "amount": 5000,
            "currency": "INR"
         }

         response = self.client.post(self.url,{"amount":500},format='json')

         self.assertEqual(response.status_code,status.HTTP_201_CREATED)

# Create your tests here.
