from rest_framework import serializers
from .models import CartItem

class CartSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_price = serializers.ReadOnlyField(source='product.price')
    product_image = serializers.SerializerMethodField()
    item_total = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id','product','quantity','product_name','product_price','product_image','item_total']

    def get_product_image(self,obj):
        if obj.product.image:
            return obj.product.image.url
        return None 

    def get_item_total(self,obj):
        return int(obj.product.price * obj.quantity)   