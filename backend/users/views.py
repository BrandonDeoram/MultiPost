from django.shortcuts import render
from .models import NewUser, SocialMediaPlatform
from .serializers import NewUserSerializer, SocialMediaPlatformSerializer
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework import viewsets
import json
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser
from django.core.management.base import BaseCommand
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist


def test(request):
    data = {"name": "User route"}
    return JsonResponse(data)


@api_view(['DELETE'])
def delete_by_id(request, pk):
    instance = get_object_or_404(NewUser, pk=pk)
    instance.delete()
    return JsonResponse({"Success": True, "message": "Object deleted successfully"})


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = NewUser.objects.all().order_by('created_at')
    serializer_class = NewUserSerializer


class SocialMediaPlatformsViewSet(viewsets.ModelViewSet):
    queryset = SocialMediaPlatform.objects.all().order_by('main_user')
    serializer_class = SocialMediaPlatformSerializer


@api_view(['POST'])
def check_user_exists(request):
    data = JSONParser().parse(request)
    user_id = data.get('currentUser')

    # Checks if user already exists and if not it create a new user
    if user_id is None or user_id == "None":
        new_user_id = data['newUser']['user_id']
        new_user = NewUser.objects.filter(
            list_users_id__contains=[new_user_id]).first()
        if new_user is not None:
            print('user already exists')
            return JsonResponse({"Success": False, "message": "User already exists"})
        else:
            token, platform = data['newUser'].pop(
                'access_token', None), data['newUser'].pop('platform', None)
            new_user = NewUser.objects.create(**data['newUser'])
            new_user.list_users_id.append(data['newUser']['user_id'])
            new_user.save()
            print('creating new social media')
            SocialMediaPlatform.objects.create(
                main_user=new_user,
                user_id=new_user.user_id,
                name=new_user.name,
                platform=platform,
                access_token=token
            )

            print('new user created')
            return JsonResponse({"Success": True, "message": "New user created"})

    # Connects account and appends user id
    else:
        # TODO: Check if appended userid is already in database if so return user exists
        user = NewUser.objects.filter(
            list_users_id__contains=[user_id]).first()
        if data['newUser']['user_id'] == user_id or data['newUser']['user_id'] in user.list_users_id:
            print('user already exists 2')
            return JsonResponse({"sucess": True})
        
        user.list_users_id.append(data['newUser']['user_id'])
        user.save()
        # Connect Account

        # If it doesn't exist, create a new one
        token, platform = data['newUser'].pop(
            'access_token', None), data['newUser'].pop('platform', None)
        print('right before connecting ')
        social_media_platform = SocialMediaPlatform.objects.create(
            main_user=user,
            user_id=data['newUser']['user_id'],
            name=data['newUser']['name'],
            platform=platform,
            access_token=token
        )
        print('account connected')

        return JsonResponse({"sucess": True, "message": "Connected Account"})


@api_view(['POST'])
def receive_user_id(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        # print("GETTING DATA HERE IT IS-----------:", data)
        user_id = data.get('user_id')
        all_users = NewUser.objects.all()
        # for user in all_users:
        #     print(
        #         f"User ID: {user.user_id}, Name: {user.name}, Email: {user.email}")
        # if user_id:
        #     # Check if the user already exists
        #     user = NewUser.objects.filter(user_id=user_id).first()
        #     if not user:
        #         # If the user does not exist, create a new user
        #         token,platform= data.pop('access_token', None),data.pop('platform', None)
        #         serializer = NewUserSerializer(data=data)
        #         if serializer.is_valid():
        #             serializer.save()
        #         # create Social Media Account

        #             return JsonResponse({'success': True})
        #         else:
        #             return JsonResponse({'error': serializer.errors}, status=400)
        #     else:
        #         return JsonResponse({'user exist success': True})

    return JsonResponse({'success': True})
