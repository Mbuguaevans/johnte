from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, profile_view, profile_update_view

urlpatterns = [
    path('register/',       RegisterView.as_view(),       name='register'),
    path('login/',          TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/',        TokenRefreshView.as_view(),    name='token_refresh'),
    path('profile/',        profile_view,                  name='profile'),
    path('profile/update/', profile_update_view,           name='profile-update'),
]