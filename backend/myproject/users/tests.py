from django.test import TestCase
from rest_framework.test import APIClient,APITestCase
from rest_framework import status
from .models import CustomUser
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()

class AuthTestCase(APITestCase):

    def setUp(self):
        
        self.verified_user = User.objects.create_user(
            email="verified@example.com",
            password="testpass123",
            is_verified=True,
            is_active=True
        )

        self.unverified_user = User.objects.create_user(
            email="unverified@example.com",
            password="testpass123",
            is_verified=False,
            is_active=False
        )

        self.client = APIClient()

    def test_registerUser(self):
        url = reverse('register')
        data = {
            "email": "newuser@example.com",
            "name": "New User",
            "password": "TestPass123!",
            "password2": "TestPass123!"
        }

        response = self.client.post(url,data,format='json')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertIn("message", response.data)
        self.assertTrue(User.objects.filter(email="newuser@example.com").exists())

    def test_loginUser(self):
        url = reverse('login')
        data = {
            "email": "verified@example.com",
            "password": "testpass123"
        }
        response = self.client.post(url,data,format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)


# Create your tests here.
