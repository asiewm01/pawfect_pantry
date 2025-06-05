from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from my_apps.models import Product, UserProfile, Vendor
from django.contrib import messages
from my_apps.forms import ProductForm  # We'll create this next
from django.http import HttpResponseForbidden


@login_required
def manage_product(request):
    profile = get_object_or_404(UserProfile, user=request.user)
    products = Product.objects.filter(vendor__user=request.user)

    return render(request, 'vendor/product_management/manage_product.html', {
        'products': products,
        'profile': profile,
    })

@login_required
def product_detail(request, product_id):
    profile = get_object_or_404(UserProfile, user=request.user)
    product = get_object_or_404(Product, id=product_id, vendor__user=request.user)

    return render(request, 'vendor/product_management/product_detail.html', {
        'product': product,
        'profile': profile,
    })

@login_required
def delete_product(request, product_id):
    product = get_object_or_404(Product, id=product_id, vendor__user=request.user)
    product.delete()
    messages.success(request, "Product deleted successfully.")
    return redirect('vendor_product_list')

@login_required
def edit_product(request, product_id):
    product = get_object_or_404(Product, id=product_id, vendor__user=request.user)

    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            messages.success(request, 'Product updated successfully.')
            return redirect('vendor_product_detail', product_id=product.id)
    else:
        form = ProductForm(instance=product)

    return render(request, 'vendor/product_management/product_edit.html', {
        'form': form,
        'product': product
    })

@login_required
def vendor_product_create(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            product = form.save(commit=False)
            
            try:
                vendor = Vendor.objects.get(user=request.user)
            except Vendor.DoesNotExist:
                return HttpResponseForbidden("You are not registered as a vendor.")

            product.vendor = vendor
            product.save()
            return redirect('vendor_product_list')
    else:
        form = ProductForm()
    
    return render(request, 'vendor/product_management/vendor_product_create.html', {'form': form})
