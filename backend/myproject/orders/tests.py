from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient,APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import Orders
from product.models import Product
from cart.models import CartItem

user = get_user_model()

class OrdersTestCase(APITestCase):
    
    def setUp(self):
        self.user = user.objects.create_user(
            email="user@example.com",
            password="testpass123",
            is_verified=True,
            is_active=True
        )

        self.product1 = Product.objects.create(name="RC Car", price=100)
       
        CartItem.objects.create(user=self.user,product=self.product1)
        
        
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_getOrders(self):
            url = reverse('orders')
            Orders.objects.create(
            user=self.user,
            product=self.product1,
            quantity=1,
            total_price=100,
            address="123 Test St",
            payment_method="razorpay"
            )

            response = self.client.get(url)
            self.assertEqual(response.status_code,status.HTTP_200_OK)
            self.assertTrue(len(response.data)>0)

    def test_addOrders(self):
         url = reverse('orders')
         data = {
            "address": {
                "name": "John Doe",
                "phone": "1234567890",
                "street": "123 Main St",
                "city": "TestCity",
                "pincode": "123456"
            },
            "paymentMethod": "razorpay"
        }
         
         response = self.client.post(url,data,format='json')

         self.assertEqual(response.status_code,status.HTTP_200_OK)
         self.assertIn("message",response.data) 
         
        


            


# Create your tests here.
