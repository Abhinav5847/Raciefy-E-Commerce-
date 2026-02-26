from django.db import models
from django.conf import settings
from product.models import Product

class WishList(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='wishlist')
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user','product')

    def __str__(self):
        return f"{self.user.email} - {self.product.name}"    
# Create your models here.
