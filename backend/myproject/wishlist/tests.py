from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase,APIClient
from rest_framework import status
from product.models import Product
from .models import WishList

User = get_user_model()

class WishlistTestcase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(email="ramees@example.com",password="testpass")
        self.product = Product.objects.create(name="RC Car", price=100)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_add_wishlist(self):
        url = "/wishlist/"
        response = self.client.post(url,{'product_id':self.product.id})
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertEqual(WishList.objects.count(),1)

    def test_remove_wishlist(self):

        WishList.objects.create(user=self.user,product=self.product)

        url = "/wishlist/"

        response = self.client.post(url,{'product_id':self.product.id},format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(WishList.objects.count(),0)       

# Create your tests here.
