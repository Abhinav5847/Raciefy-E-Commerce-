from rest_framework import serializers

class PaymentSerializer(serializers.Serializer):
    amount = serializers.IntegerField(min_value=1,help_text="Amount in rupees")