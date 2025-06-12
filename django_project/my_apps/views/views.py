from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from my_apps.models import Product
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from my_apps.models import Vendor

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

#Vendor Page on React 
def vendor_list_page(request):
    vendors = Vendor.objects.all()
    data = [
        {
            "id": v.id,
            "name": v.business_name or v.user.username,
            "description": v.description or "No description available.",
            "image": v.brand_image.url if v.brand_image else "/media/default_vendor.png"
        }
        for v in vendors
    ]
    return JsonResponse(data, safe=False)



