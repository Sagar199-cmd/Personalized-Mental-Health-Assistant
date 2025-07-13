# users/views.py
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.authtoken.models import Token

@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            name = data.get('name')

            if not email or not password or not name:
                return JsonResponse({'error': 'Missing required fields'}, status=400)
            
            if User.objects.filter(username=email).exists():
                return JsonResponse({'error': 'User with this email already exists'}, status=400)
            
            # Create user (existing logic remains same)
            user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
            user.date_joined = timezone.now()
            user.save()
            
            # Create API token for new user (NEW)
            token = Token.objects.create(user=user)
            
            return JsonResponse({
                'message': 'User registered successfully',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.first_name,
                    'createdAt': user.date_joined,
                },
                'token': token.key  # <-- Add token to response
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return JsonResponse({'error': 'Missing email or password'}, status=400)
            
            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)  # Existing session auth remains
                
                # Get or create API token (NEW)
                token, created = Token.objects.get_or_create(user=user)
                
                return JsonResponse({
                    'message': 'User logged in successfully',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'name': user.first_name,
                        'createdAt': user.date_joined,
                    },
                    'token': token.key  # <-- Add token to response
                })
            else:
                return JsonResponse({'error': 'Invalid email or password'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

# Logout remains same

@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        try:
            logout(request)
            return JsonResponse({'message': 'User logged out successfully'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
