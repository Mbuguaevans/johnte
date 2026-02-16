from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'user_type', 'phone', 'county', 'is_staff')
    list_filter = ('user_type', 'is_staff', 'is_superuser')
    fieldsets = UserAdmin.fieldsets + (
        ('FarmHub Info', {'fields': ('user_type', 'phone', 'county')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('FarmHub Info', {'fields': ('user_type', 'phone', 'county')}),
    )