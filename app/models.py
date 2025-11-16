from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    # Set email as the unique identifier for authentication
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=False)  # Allow duplicate usernames

    # Update the USERNAME_FIELD
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Username will still be a required field, but not unique

class Otp(models.Model):
    email = models.EmailField(unique=True)  
    otp_code = models.CharField(max_length=6)

    def __str__(self):
        return f'OTP for {self.email}: {self.otp_code}'


class Shop(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    shop_name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=250)
    profileimage = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    
    def __str__(self):
        return self.shop_name
    


class UserOrder(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Change this line
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)  # Link directly to the Shop model
    MEDICINE_TYPE_CHOICES = [
        ('Drug', 'Drug'),
        ('Medicine', 'Medicine'),
    ]
    address = models.CharField(max_length=255)
    drug_name = models.CharField(max_length=100, blank=True, null=True)
    medicine_name = models.CharField(max_length=100, blank=True, null=True)
    count = models.IntegerField()
    order_date = models.DateTimeField(auto_now_add=True)
    delivery_status = models.CharField(max_length=20, default='Pending')  # Added for delivery status
    payment_status = models.CharField(max_length=20, default='Unpaid')  
    delivery_date = models.DateTimeField(null=True, blank=True)  

    def __str__(self):
        return f"{self.shop.shop_name} ({self.drug_name or self.medicine_name})"






class Medicine(models.Model):
    TYPE_CHOICES = [
        ('Drug', 'Drug'),
        ('Medicine', 'Medicine'),
    ]

    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    name = models.CharField(max_length=255)
    count = models.PositiveIntegerField()
    manufacturing_date = models.DateField()  
    expiry_date = models.DateField()  
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name



class AdminProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='admin_profiles/', blank=True, null=True)




