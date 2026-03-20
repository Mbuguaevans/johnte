from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password    = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2   = serializers.CharField(write_only=True, required=True)
    profile_pic = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model  = User
        fields = ('username', 'email', 'password', 'password2',
                  'user_type', 'phone', 'county', 'first_name', 'last_name', 'profile_pic')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        profile_pic = validated_data.pop('profile_pic', None)
        user = User.objects.create_user(**validated_data)
        if profile_pic:
            user.profile_pic = profile_pic
            user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    name         = serializers.SerializerMethodField()
    role         = serializers.SerializerMethodField()
    member_since = serializers.SerializerMethodField()
    profile_pic  = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model  = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'name', 'role', 'phone', 'county', 'user_type', 'member_since', 'profile_pic'
        ]

    def get_name(self, obj):
        return obj.get_full_name() or obj.username

    def get_role(self, obj):
        return obj.user_type.replace('_', ' ').title()

    def get_member_since(self, obj):
        return obj.date_joined.strftime("%B %Y")

class ProfileUpdateSerializer(serializers.ModelSerializer):
    profile_pic = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model  = User
        fields = ['first_name', 'last_name', 'phone', 'county', 'email', 'profile_pic']