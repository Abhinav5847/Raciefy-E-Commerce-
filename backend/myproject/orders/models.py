from django.db import models
from django.conf import settings
from product.models import Product

class Orders(models.Model):
    STATUS_CHOICES = [
        ('ORDERED','ordered'),
        ('SHIPPED','shipped'),
        ('OUT_FOR_DELIVERY','out_for_delivery'),
        ('DELIVERED','delivered'),
        ('CANCELLED','cancelled')
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=10,decimal_places=2)
    address = models.JSONField()
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='ORDERED')

    payment_method = models.CharField(max_length=50, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, null=True, blank=True)


    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.product.name}"


# Create your models here.
