import base64
from datetime import datetime
import time
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
import requests
import os
import google.auth
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
import time
from django.http import JsonResponse

SCOPES = ["https://www.googleapis.com/upload/youtube"]
reels_id = os.getenv('REELS_ID')

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = NewUser.objects.all().order_by('created_at')
    serializer_class = NewUserSerializer


class SocialMediaPlatformsViewSet(viewsets.ModelViewSet):
    queryset = SocialMediaPlatform.objects.all().order_by('main_user')
    serializer_class = SocialMediaPlatformSerializer




@api_view(['DELETE'])
def delete_by_id(request, pk):
    instance = get_object_or_404(NewUser, pk=pk)
    instance.delete()
    return JsonResponse({"Success": True, "message": "Object deleted successfully"})


# ---------------------------------------------------------------------------Connecting Multiple Accounts--------------------------------------------------------------------------------------

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
        user_id = data.get('user_id')
        all_users = NewUser.objects.all()
        # for user in all_users:
        #     print(
        #         f"User ID: {user.user_id}, Name: {user.name}, Email: {user.email}")

    return JsonResponse({'success': True})

# ----------------------------------------------------------------------------------------Instagram--------------------------------------------------------------------------------------


@api_view(['POST'])
def post_instagram(request):
    # TODO: Give photo url/video from Amazon S3
    endpoint = f"https://graph.facebook.com/v19.0/{17841460087405367}/media"
    access_token = SocialMediaPlatform.objects.get(
        user_id="17841460087405367").access_token
    video_url = "https://askdocaibucket.s3.us-east-2.amazonaws.com/uploads/x10Faster.mp4"
    captions = "testing 12345"

    if not video_url:
        return JsonResponse({'success': False, 'message': 'No video URL provided'})
    if not captions:
        return JsonResponse({'success': False, 'message': 'No caption provided'})

    params = {
        'access_token': access_token,
        'video_url': video_url,
        'media_type': 'REELS',
        'caption': captions,
    }
    try:
        response = requests.post(endpoint, params=params)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)

        if response.status_code == 200:
            print('Successfully created container')
            print('Container ID:', response.json())

            # Status code of post:
            time.sleep(30)
            status = status_code(
                response.json().get('id'),
                access_token,
            )
            print('status:', status)
            res = publish_instgram_post(
                access_token, status.get('id'))
            print(res)
            if res['success'] == True:
                return JsonResponse({'success': True, 'message': 'Successfully posted'})
            else:
                print('failed')
                return JsonResponse({'success': False, 'message': 'FAILED'})

        else:
            # print(response.json())
            return JsonResponse({'success': False, 'error': f'Response code: {response.status_code}'})

    except requests.exceptions.RequestException as req_exc:
        # Handle request-related exceptions
        return JsonResponse({'success': False, 'error': f'Request exception: {req_exc}'})

    except Exception as e:
        # Handle other unexpected exceptions
        print("Unexpected exception in post:", e)

        return JsonResponse({'success': False, 'error in post': f'Unexpected exception: {e}'})

    return JsonResponse({'success': True})


def status_code(container_id, access_token):
    if not container_id:
        return ({'success': False, 'message': 'No container ID provided'})
    endpoint = f"https://graph.facebook.com/v19.0/{container_id}"
    params = {
        'access_token': access_token,
        'fields': 'status_code'
    }
    response = requests.get(endpoint, params=params)
    response = response.json()
    return response


def publish_instgram_post(access_token, container_id):
    # if not container_id:
    #     return ({'success': False, 'message': 'No container ID provided'})
    endpoint = f"https://graph.facebook.com/v19.0/{reels_id}/media_publish"
    params = {
        'creation_id': container_id,
        'access_token': access_token,

    }
    try:
        response = requests.post(endpoint, params=params)
        print(response.json())
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)

        if response.status_code == 200:
            return ({'success': True, 'message': 'Successfully posted'})
        else:
            print(response.json())
            return ({'success': False, 'error': f'Response code: {response.status_code}'})
    except requests.exceptions.RequestException as req_exc:
        # Handle request-related exceptions
        return ({'success': False, 'error': f'Request exception: {req_exc}'})

    except Exception as e:
        # Handle other unexpected exceptions
        print("Unexpected exception in publish:", e)
        return ({'success': False, 'error in publish': f'Unexpected exception: {e}'})

    return ({'success': True})


@api_view(['POST'])
def post_youtube(request):
    try:
        upload_video()
    except:
        print('error')
        return JsonResponse({'success': False})

    return JsonResponse({'success': True})


@api_view(['GET'])
def get_instagram_reels_views(request):
    # get env variable
    
    reels = []
    endpoint = f"https://graph.facebook.com/v19.0/{reels_id}"
    access_token = SocialMediaPlatform.objects.get(
        user_id="17841460087405367").access_token
    params = {
        'access_token': access_token,
        'fields': 'media'
    }
    response = requests.get(endpoint, params=params)
    if response.status_code != 200:
        return JsonResponse({'success': False, 'error': f"Failed to retrieve data: {response.status_code}"})

    res = response.json()

    # iterate through each id and grab title, timestamp, reach
    for id in reversed(res['media']['data'][:10]):
        media_id = id['id']
        media_url = f"https://graph.facebook.com/v19.0/{media_id}"
        media_param = {
            'fields': 'caption,timestamp,insights.metric(reach)',
            'access_token': access_token,

        }
        response = requests.get(url=media_url, params=media_param)
        if response.status_code == 200:
            try:

                media_data = response.json()
                captions = media_data.get('caption', {})
                time = media_data.get('timestamp', {})
                date_object = datetime.strptime(time[:19], '%Y-%m-%dT%H:%M:%S')

                # Format the date as Month Day
                formatted_date = date_object.strftime('%B %d')
                time = formatted_date
                views = media_data['insights']['data'][0]['values'][0]['value']

                reels.append(
                    {'title': captions,
                     'platform': 'Instagram', 'timestamp': time, 'views': views})
            except ValueError as e:
                print(f"Failed to parse json {e}")
        else:
            print(f'Failed to retrive data for media')
            return JsonResponse({'success': False, 'error':  "Failed to retrieve data for media"})

    return JsonResponse({'count': len(reels), 'reels': reels})


# ----------------------------------------------------------------------------------------Youtube--------------------------------------------------------------------------------------
def authenticate():
    credentials = None

    # First check to see if we cached our current token
    if os.path.exists('token.json'):
        credentials = Credentials.from_authorized_user_file('token.json')
    try:
        # If we don't have a valid token, we need to get one
        if not credentials or not credentials.valid:
            if credentials and credentials.expired and credentials.refresh_token:
                credentials.refresh(Request())
            else:
                # Takes in our client secret file and our scopes
                flow = InstalledAppFlow.from_client_secrets_file(
                    'H:/MultiPost/backend/users/client_secrets2.json', SCOPES)
                print('before run_local_server')
                credentials = flow.run_local_server()
                print('after run_local_server')
            # Save our credentials for next time
            with open('token.json', 'w') as token:
                token.write(credentials.to_json())
    except Exception as e:
        print(e)
    return credentials


def upload_video():
    credentials = authenticate()
    youtube = build('youtube', 'v3', credentials=credentials)

    # Step 1: Upload the full-length video
    try:
        full_length_video_request = youtube.videos().insert(
            part="snippet,status",
            body={
                "snippet": {
                    "title": "Write code 10x faster using Codeium  #shorts",
                    "description": "Use codeium ai to write code 10x faster #shorts",
                    "tags": ["code", "coding", "tips and tricks", "developer", "swe"],
                    "categoryId": "28",
                },
                "status": {
                    "privacyStatus": "public",  # Important for YouTube Shorts
                }
            },
            media_body=MediaFileUpload(
                "H:/Coding Vlogs/CodingClips/CodeiumDone/x10Faster.mp4"),
        )

        full_length_video_response = full_length_video_request.execute()

        print("YouTube Shorts video uploaded successfully.",
              full_length_video_response)

    except Exception as e:
        print(f"Error: {e}")


api_view(['GET'])


def get_youtube_shorts_views(request):
    credentials = authenticate()
    youtube_shorts = []

    try:
        youtube = build('youtube', 'v3', credentials=credentials)
        request = youtube.videos().list(
            part="snippet,contentDetails,statistics",
            myRating="like",
            maxResults=10
        )
        response = request.execute()
        for video in response['items']:
            # Convert timestamp to the desired format
            timestamp = datetime.strptime(
                video['snippet']['publishedAt'], "%Y-%m-%dT%H:%M:%SZ").strftime("%B %d")
            youtube_shorts.append(
                {"title": video['snippet']['title'], "platform": "Youtube", "timestamp": timestamp, "views": video['statistics']['viewCount']})
        liked_videos_response = response

        while 'nextPageToken' in liked_videos_response:
            if len(youtube_shorts) >= 10:
                break

            next_page_token = liked_videos_response['nextPageToken']
            liked_videos_request = youtube.videos().list(
                part="snippet,contentDetails,statistics",
                myRating='like',
                maxResults=min(10 - len(youtube_shorts), 20),
                pageToken=next_page_token
            )
            liked_videos_response = liked_videos_request.execute()
            youtube_shorts += process_liked_videos(liked_videos_response)

            if len(youtube_shorts) >= 10:
                break

        # Sort the youtube_shorts based on timestamp (latest to newest)
        youtube_shorts.sort(key=lambda x: datetime.strptime(
            x['timestamp'], "%B %d"), reverse=False)

    except Exception as e:
        print(e)
        return {'success': False, 'error': f'Unexpected exception: {e}'}

    return JsonResponse({'count': len(youtube_shorts), 'shorts': youtube_shorts})


def process_liked_videos(response):
    items = response.get('items', [])
    items = items[:5]
    youtube_shorts = []
    try:
        for item in items:
            if 'M' not in item['contentDetails']['duration']:
                timestamp = datetime.strptime(
                    item['snippet']['publishedAt'], "%Y-%m-%dT%H:%M:%SZ").strftime("%B %d")
                youtube_shorts.append(
                    {"title": item['snippet']['title'], "platform": "Youtube", "timestamp": timestamp, "views": item['statistics']['viewCount']})
    except Exception as e:
        print("Error processing item: ", e)
    return youtube_shorts




