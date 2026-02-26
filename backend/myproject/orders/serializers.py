from rest_framework import serializers
from .models import Orders,Product

class ProductSerializer(serializers.ModelSerializer):
  image = serializers.ImageField(use_url=True)
  class Meta:
    model = Product
    fields = ['id','name','price','image']

class OrderSerializer(serializers.ModelSerializer):
    # product_name = serializers.ReadOnlyField(source='product.name')
    # product_image = serializers.ReadOnlyField()
    product = ProductSerializer(read_only =True)
    class Meta:
     model = Orders
     fields = '__all__'
     read_only_fields = ['user','status','total_price']

class OrderCreateSerializer(serializers.Serializer):
  address = serializers.DictField(
        child=serializers.CharField(),
        help_text="Address object with keys: name, phone, street, city, pincode"
    )
  paymentMethod = serializers.CharField(required=False)
  razorpay_payment_id = serializers.CharField(required=False)



    # def get_product_image(self,obj):
    #     if obj.product.image:
    #         return obj.product.image.url
    #     return None