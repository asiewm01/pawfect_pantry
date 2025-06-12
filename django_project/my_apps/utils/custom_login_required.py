from django.shortcuts import redirect
from functools import wraps
from django.http import HttpResponse

def custom_login_required(role=None):
    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            try:
                if not request.user.is_authenticated:
                    print("❌ Not authenticated")
                    return redirect('login')

                user_role = getattr(request.user, 'role', None)
                if role and user_role != role:
                    print(f"❌ Role mismatch: required '{role}', got '{user_role}'")
                    return HttpResponse("Unauthorized - Role Mismatch", status=403)

                return view_func(request, *args, **kwargs)

            except Exception as e:
                print(f"❌ Exception in custom_login_required: {e}")
                return HttpResponse(f"Internal error in access control: {e}", status=500)

        return _wrapped_view
    return decorator
