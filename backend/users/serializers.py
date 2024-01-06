from rest_framework import serializers
from .models import NewUser, SocialMediaPlatform


class NewUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewUser
        fields = ['id', 'name', 'user_id',
                  'email', 'list_users_id', 'created_at']
        read_only_fields = ['id', 'created_at']


class SocialMediaPlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialMediaPlatform
        fields = ['main_user', 'user_id', 'name', 'platform', 'access_token']
