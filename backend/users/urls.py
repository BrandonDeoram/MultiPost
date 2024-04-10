from django.urls import path, include
from rest_framework import routers
from .views import UserViewSet
from .views import SocialMediaPlatformsViewSet
from . import views


router = routers.DefaultRouter()
router.register(r'getAllUsers', views.UserViewSet)
router.register(r'getAllSocialMedaPlatforms',
                views.SocialMediaPlatformsViewSet)

urlpatterns = [
    path("test", views.test, name="test"),
    path("", include(router.urls)),
    path("createUser", views.receive_user_id, name="createUser"),
    path("checkUser", views.check_user_exists, name="checkUser"),
    path("deleteUser/<int:pk>/", views.delete_by_id, name='deleteUser'),
    path("postInstagram", views.post_instagram, name="postInstagram"),
    path("postYoutube", views.post_youtube, name="postYoutube   "),
    path("getYoutubeShortsViews", views.get_youtube_shorts_views,
         name="getYoutubeShortsViews"),
    path("getInstagramReelsViews", views.get_instagram_reels_views,
         name="getInstagramReelsViews"),
    path("getTwitterViews", views.get_twitter_views, name="getTwitterViews")



]
