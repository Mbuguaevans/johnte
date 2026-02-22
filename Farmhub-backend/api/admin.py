from django.contrib import admin
from .models import Land, Bid, Payment

@admin.register(Land)
class LandAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'county', 'price_kes', 'status', 'created_at')
    list_filter = ('status', 'county')
    search_fields = ('title', 'owner__username')
    actions = ['delete_selected']  # enables bulk delete

@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):
    list_display = ('land', 'bidder', 'amount_kes', 'status')
    list_filter = ('status',)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('user', 'land', 'amount_kes', 'status', 'payment_type')
    list_filter = ('status',)