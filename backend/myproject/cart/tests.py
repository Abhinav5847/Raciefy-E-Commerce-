from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient,APITestCase
from rest_framework import status
from product.models import Product
from .models import CartItem

user = get_user_model()

class CartTestcase(APITestCase):

    def setUp(self):
        
        self.user = user.objects.create_user(email='ramees@gmail.com',password='ramees123')

        self.product = Product.objects.create(name='Rccar',price=100)

        self.client = APIClient()

        self.client.force_authenticate(user=self.user)


    def test_addtocart(self):

        url = '/cart/'
        data={
            'product':self.product.id,
            "quantity" : 2
        }  

        response = self.client.post(url,data,format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CartItem.objects.count(), 1)
        cart_item = CartItem.objects.first()
        self.assertEqual(cart_item.product, self.product)
        self.assertEqual(cart_item.quantity, 2)
        self.assertEqual(cart_item.user, self.user)
           

# Create your tests here.
