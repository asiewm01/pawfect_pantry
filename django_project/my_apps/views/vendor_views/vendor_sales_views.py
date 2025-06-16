from django.http import HttpResponseServerError
from django.shortcuts import render
from my_apps.views.admin_views.analytics_helpers_views import generate_sales_data
from django.contrib.auth.decorators import login_required

@login_required
def vendor_sales_dashboard(request):
    try:
        print(f"Current user: {request.user.username}")
        context = generate_sales_data(role='vendor', user=request.user)
        print("Sales data generated successfully.")
        return render(request, 'vendor/sale_management/sales_dashboard.html', context)
    except Exception as e:
        import traceback
        print("❌ ERROR in vendor_sales_dashboard view:", str(e))
        traceback.print_exc()
        return HttpResponseServerError(f"Error: {str(e)}")