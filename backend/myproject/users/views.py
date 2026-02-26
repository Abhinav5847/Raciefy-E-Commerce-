from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RegisterSerializer,UserSerializer,LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny,IsAuthenticated
from .models import CustomUser
from .utils import send_verification_email
from rest_framework import serializers


class CurrentUserView(APIView):

    permission_classes = [IsAuthenticated]
    
    def get(self, request):
       try: 
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data,status=status.HTTP_200_OK)
       except Exception as e:
           return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegisterView(APIView):

    permission_classes = [AllowAny] 

    def post(self,request):
        try:
            serializer = RegisterSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            user.is_active = False
            user.is_verified = False
            user.save()

            send_verification_email(user,request)

            return Response({"message":"Registarion successfuly completed"},status=status.HTTP_201_CREATED)
        
        except serializers.ValidationError as e:
            return Response({"errors": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    
class VerifyEmailView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, token):
        try:
            user = CustomUser.objects.get(verification_token=token)

            if user.is_verified:
                return Response({"message": "Email already verified."}, status=status.HTTP_200_OK)

            user.is_verified = True
            user.is_active = True
            user.save()

            return Response({"message": "Email verified successfully. You can now login."}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({"error": "Invalid verification link."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class LoginView(APIView):

    permission_classes = [AllowAny]
    serializer_class = LoginSerializer


    def post(self,request):
       try: 
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email'].strip().lower()
        password =  serializer.validated_data['password'].strip()
        user = authenticate(request,username=email,password=password)

        if user:
            
            if not user.is_verified:
                return Response({"error": "Email not verified. Check your inbox."},status=status.HTTP_400_BAD_REQUEST)

            refresh = RefreshToken.for_user(user)
            return Response({
                "user" : UserSerializer(user).data,
                "access" : str(refresh.access_token),
                "refresh" : str(refresh)
            })
        
        return Response({"error":"Invalid credentials"},status=status.HTTP_401_UNAUTHORIZED)
       
       except Exception as e:
          return Response({"error":str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# Create your views here.
