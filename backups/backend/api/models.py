from django.db import models
from django.conf import settings


class Land(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('leased',    'Leased'),
        ('pending',   'Pending'),
    ]
    COUNTY_CHOICES = [
        ('nakuru',      'Nakuru'),
        ('kiambu',      'Kiambu'),
        ('narok',       'Narok'),
        ('laikipia',    'Laikipia'),
        ('uasin-gishu', 'Uasin Gishu'),
        ('kilifi',      'Kilifi'),
        ('nairobi',     'Nairobi'),
        ('mombasa',     'Mombasa'),
        ('kisumu',      'Kisumu'),
    ]

    owner        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lands')
    title        = models.CharField(max_length=255)
    description  = models.TextField()
    county       = models.CharField(max_length=50, choices=COUNTY_CHOICES)
    location     = models.CharField(max_length=255)
    size_acres   = models.DecimalField(max_digits=10, decimal_places=2)
    price_kes    = models.DecimalField(max_digits=15, decimal_places=2)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    # Precise Location
    latitude     = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude    = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    auction_ends_at = models.DateTimeField(null=True, blank=True)
    
    is_featured  = models.BooleanField(default=False)
    is_new       = models.BooleanField(default=True)
    image_url    = models.URLField(blank=True)

    # Amenities
    has_water       = models.BooleanField(default=False)
    has_electricity = models.BooleanField(default=False)
    has_road_access = models.BooleanField(default=False)
    has_fencing     = models.BooleanField(default=False)
    has_irrigation  = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def get_tags(self):
        tags = []
        if self.has_water:       tags.append('Water Access')
        if self.has_electricity: tags.append('Electricity')
        if self.has_road_access: tags.append('Road Access')
        if self.has_fencing:     tags.append('Fencing')
        if self.has_irrigation:  tags.append('Irrigation')
        return tags


class LandImage(models.Model):
    land = models.ForeignKey(Land, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='land_images/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.land.title}"


class Bid(models.Model):
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('leading',   'Leading'),
        ('outbid',    'Outbid'),
        ('won',       'Won'),
        ('lost',      'Lost'),
        ('cancelled', 'Cancelled'),
    ]

    land       = models.ForeignKey(Land, on_delete=models.CASCADE, related_name='bids')
    bidder     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bids')
    amount_kes = models.DecimalField(max_digits=15, decimal_places=2)
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    closes_at  = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-amount_kes']

    def __str__(self):
        return f"{self.bidder.username} → {self.land.title} @ KES {self.amount_kes}"


class Payment(models.Model):
    TYPE_CHOICES = [
        ('lease',      'Lease Payment'),
        ('investment', 'Investment'),
        ('refund',     'Refund'),
        ('bid',        'Bid Deposit'),
    ]
    STATUS_CHOICES = [
        ('pending',   'Pending'),
        ('completed', 'Completed'),
        ('failed',    'Failed'),
    ]

    user         = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    land         = models.ForeignKey(Land, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    amount_kes   = models.DecimalField(max_digits=15, decimal_places=2)
    payment_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    mpesa_ref    = models.CharField(max_length=50, blank=True)
    description  = models.CharField(max_length=255)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} — {self.description} — KES {self.amount_kes}"