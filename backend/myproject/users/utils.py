
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse

def send_verification_email(user, request):

    frontend_url = "http://localhost:5173" 
    verification_url = f"{frontend_url}/verify-email/{user.verification_token}/"
    
    # token = user.verification_token
    # verification_url = request.build_absolute_uri(
    #     reverse("verify-email", kwargs={"token": token})
    # )
    subject = "Verify your email for RaceiFy"
    message = f"""
    Hi {user.name},

    Thanks for registering! Please verify your email by clicking the link below:

    {verification_url}

    If you didn't register, you can ignore this email.

    — RaceiFy Team
    """
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
