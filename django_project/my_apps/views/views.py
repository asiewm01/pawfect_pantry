from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from my_apps.models import Product
from django.views.decorators.csrf import ensure_csrf_cookie

@login_required
def homepage(request):
    recommended_products = Product.objects.all().order_by('-views')[:3]
    data = {
        'recommended_products': [
            {
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'views': product.views,
                'image': product.image.url if product.image else None,
            }
            for product in recommended_products
        ]
    }
    return JsonResponse(data)

def about_view(request):
    return JsonResponse({'message': 'This is the About page of the Pawfect Pantry API.'})

def contact_view(request):
    return JsonResponse({'email': 'support@example.com', 'phone': '+1234567890'})

