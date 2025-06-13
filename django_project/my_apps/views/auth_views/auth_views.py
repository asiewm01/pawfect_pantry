from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.password_validation import validate_password
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from ...models import UserProfile
from ...serializers import UserProfileSerializer, UserSerializer


# ----------------------------
# Get CSRF token
# ----------------------------
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})


# ----------------------------
# Session Login
# ----------------------------
@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)

    if user:
        login(request, user)  # ✅ This creates the session
        return JsonResponse({'message': 'Login successful'}, status=200)
    return JsonResponse({'error': 'Invalid credentials'}, status=401)


# ----------------------------
# Session Logout
# ----------------------------
@api_view(['POST'])
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logged out successfully'})


# ----------------------------
# Check Current Authenticated User
# ----------------------------
@api_view(['GET'])
def current_user_view(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "username": request.user.username,
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name
        }, status=200)
    return JsonResponse({"error": "Not authenticated"}, status=401)


# ----------------------------
# Register User with Profile
# ----------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    try:
        if User.objects.filter(username=data['username']).exists():
            return Response({"error": "Username already exists."}, status=400)

        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', '')
        )

        UserProfile.objects.create(
            user=user,
            phone=data.get('phone', ''),
            address=data.get('address', '')
        )

        return Response({"message": "Account created successfully."}, status=201)
    except Exception as e:
        return Response({"error": str(e)}, status=400)


# ----------------------------
# Get Profile (Authenticated)
# ----------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(profile)
    return Response(serializer.data)

# ----------------------------
# Update Profile (Authenticated)
# ----------------------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user

    try:
        profile = user.profile
    except UserProfile.DoesNotExist:
        return Response({"error": "User profile not found."}, status=404)

    # Update user fields
    user.first_name = request.data.get('first_name', user.first_name)
    user.last_name = request.data.get('last_name', user.last_name)
    user.username = request.data.get('username', user.username)
    user.email = request.data.get('email', user.email)
    user.save()

    # Update profile fields
    profile.phone = request.data.get('phone', profile.phone)
    profile.address = request.data.get('address', profile.address)
    profile.save()

    return Response({"message": "Profile updated successfully."})

# ----------------------------
# Pop-up Auth Check.js
# ----------------------------

@login_required
def auth_check_view(request):
    return JsonResponse({"authenticated": True})