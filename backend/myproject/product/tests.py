from django.test import TestCase
from rest_framework.test import APIClient,APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Product


class ProductTest(APITestCase):

    def setUp(self):
        
        self.product1 = Product.objects.create(name='bmw',price=1500,is_delete=False)
        self.product2 = Product.objects.create(name='m4',price=1500,is_delete=False)
        self.delete_product = Product.objects.create(name='audi',price=1400,is_delete=True)

        self.client = APIClient()
        self.url = reverse('products')

    def test_products(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),2)

        product_name = [p['name'] for p in response.data]
        self.assertIn(self.product1.name,product_name)
        self.assertIn(self.product2.name,product_name)
        self.assertNotIn(self.delete_product.name,product_name)



# Create your tests here.
