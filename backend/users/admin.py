from django.contrib import admin

# Register your models here.
from django.contrib import admin

from .models import NewUser, SocialMediaPlatform

admin.site.register(NewUser)


@admin.register(SocialMediaPlatform)
class SocialMediaPlatformAdmin(admin.ModelAdmin):
    list_display = ("main_user",
                    "user_id",
                    "name",
                    "platform",
                    "access_token",)  # Add fields you want to display in the list view
    # Add fields you want to be searchable
    search_fields = ("main_user",
                     "user_id",
                     "name",
                     "platform",
                     "access_token",)
    # Add more customization options as needed
