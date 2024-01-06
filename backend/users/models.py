from django.db import models
from django.contrib.postgres.fields import ArrayField
class NewUser(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    user_id = models.CharField(max_length=1024, unique=True) 
    list_users_id = ArrayField(models.TextField(), default=list, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name

class SocialMediaPlatform(models.Model):
    main_user = models.ForeignKey(NewUser, on_delete=models.CASCADE)
    user_id = models.CharField(max_length=1024, unique=True) 
    name = models.CharField(max_length=255)
    platform = models.CharField(max_length=255)
    access_token = models.CharField(max_length=1024)

    def __str__(self):
        return f'{self.name} - {self.platform} ({self.main_user.user_id})'