from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('landowner', 'Land Owner'),
        ('farmer', 'Farmer'),
    )
    user_type   = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='farmer')
    phone       = models.CharField(max_length=15, blank=True)
    county      = models.CharField(max_length=100, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.username