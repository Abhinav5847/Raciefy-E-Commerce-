from rest_framework import serializers
from .models import WishList
from product.serializers import ProductSerializer

class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = WishList
        fields = ['id','product','added_at']