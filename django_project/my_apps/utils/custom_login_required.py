from django.http import JsonResponse
from functools import wraps

def custom_login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "You must be logged in."}, status=403)
        return view_func(request, *args, **kwargs)
    return wrapper