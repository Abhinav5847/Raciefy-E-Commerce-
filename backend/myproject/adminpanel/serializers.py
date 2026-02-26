from rest_framework import serializers
from users.models import CustomUser
from orders.models import Orders
from users.serializers import UserSerializer
from product.serializers import ProductSerializer

class AdminUser(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id','username','name']

class AdminOrderserializer(serializers.ModelSerializer):
        product = ProductSerializer(read_only=True)
        user = UserSerializer(read_only=True)

        class Meta:
             model = Orders
             fields = '__all__'

class AdminUserview(serializers.ModelSerializer):
     class Meta:
          model = CustomUser
          fields = [
            'id',
            'email',
            'name',
            'is_verified',
            'is_active',
            'is_staff',
            'date_joined',
            'last_login'
          ]
          read_only_fields = ['id', 'date_joined', 'last_login', 'deleted_at']

    