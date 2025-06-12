from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as django_auth_views

# General Views
from .views import views

# Auth Views
from .views.auth_views import (
    auth_views,
    password_views,
    auth_email_views
)
from .views.auth_views.auth_views import (
    register_user,
    get_profile,
    update_profile,
)
from .views.auth_views.password_views import api_change_password

# Vendor Views
from .views.vendor_views import (
    vendor_views,
    vendor_product_views,
    vendor_order_views,
    vendor_delivery_views,
    vendor_customer_views,
    vendor_sales_views,
)

# Product Views
from .views.product_views import (
    product_views,
    product_detail_views,
    category_views,
)
from my_apps.views.product_views.product_views import catalogue_list, product_list
from my_apps.views.product_views.product_detail_views import product_detail

# Order Views
from my_apps.views.order_views.cart_views import (
    cart_view,
    update_cart,
    remove_from_cart,
    checkout_view,
    add_to_cart,
)
from my_apps.views.order_views.order_history_views import (
    order_history,
    order_detail,
)

# Admin Views
from my_apps.views.admin_views import (
    admin_views,
    product_management_views,
    user_account_management_views,
    vendor_management_views,
    admin_sales_views,
    order_management_views
)

# CSV Upload
from my_apps.views.admin_views.csv_upload_views import upload_products_csv

# AI Views
from my_apps.views.ai_views.ai_views import (
    ai_recommendations,
    product_recommendations,
)
from my_apps.views.ai_views.chatbot_views import chatbot_view

from my_apps.views.ai_views.ai_agent_views import ai_agent_view

from .views.admin_views.ai_admin_views import admin_va_chat, va_admin_page


# API Views
from my_apps.views.api_views.api_views import cart_summary

urlpatterns = [
    # General Pages
    path('api/home/', views.homepage, name='home'),
    path('api/about/', views.about_view, name='about'),
    path('api/contact/', views.contact_view, name='contact'),

    # Catalogue & Product
    path('api/catalogue/', catalogue_list, name='catalogue_list'),
    path('api/catalogue/all/', product_list, name='api_product_list'),
    path('api/catalogue/<int:product_id>/', product_detail, name='product_detail'),
    path('api/catalogue/<int:product_id>/add/', add_to_cart, name='add_to_cart'),
    path('api/species-categories/', category_views.get_species_categories),
    path('api/food-type-categories/', category_views.get_food_type_categories),
    path('api/products/', product_list, name='product-list'),

    # Product Feedback
    path('api/catalogue/<int:product_id>/feedback/', product_detail_views.get_product_feedback, name='get_product_feedback'),
    path('api/catalogue/<int:product_id>/feedback/submit/', product_detail_views.submit_feedback, name='submit_feedback'),

    # Cart
    path('api/cart/', cart_view, name='cart'),
    path('api/cart/', cart_summary, name='cart-summary'),
    path('api/cart/add/<int:product_id>/', add_to_cart, name='add-to-cart'),
    path('api/cart/update/', update_cart, name='update-cart'),
    path('api/cart/remove/<int:product_id>/', remove_from_cart, name='remove-from-cart'),
    path('api/cart/checkout/', checkout_view, name='checkout'),

    # Orders
    path('api/orders/', order_history, name='order_history'),
    path('api/orders/<int:order_id>/', order_detail, name='order_detail'),

    # AI Features
    path('api/ai/recommend/', ai_recommendations, name='ai-recommendations'),
    path('api/ai/recommend/product/<int:product_id>/', product_recommendations, name='product-recommendations'),
    path('api/ai/chatbot/', chatbot_view, name='chatbot'),
    path("api/ai/agent/", ai_agent_view, name="ai_agent"),


    # Authentication
    path('api/login/', auth_views.login_view, name='login'),
    path('api/logout/', auth_views.logout_view, name='logout'),
    path('api/register/', register_user, name='register'),
    path('api/profile/', get_profile, name='get_profile'),
    path('api/profile/update/', update_profile, name='update_profile'),
    path('api/csrf/', auth_views.get_csrf_token),
    path('api/user/', auth_views.current_user_view),

    # Password Flow (Custom)
    path('api/password/reset/', password_views.api_password_reset_request, name='api_password_reset'),
    path('api/password/reset-confirm/<uidb64>/<token>/', password_views.api_password_reset_confirm, name='api_password_reset_confirm'),
    path('api/password/change/', password_views.api_change_password, name='api_password_change'),

    # --------------------
    # Custom Admin (Changed prefix to dashboard/ to avoid Django admin conflict)
    # --------------------
    path('admin-panel/', admin_views.admin_login, name='admin_login'),
    path('dashboard/admin/', admin_views.admin_dashboard, name='admin_dashboard'),
    path('dashboard/logout/', admin_views.admin_logout, name='admin_logout'),
    path('dashboard/home/', admin_views.admin_dashboard, name='admin_dashboard'),
    path('dashboard/users/', admin_views.manage_users, name='manage_users'),
    path('dashboard/products/', product_management_views.manage_products, name='manage_products'),
    path('dashboard/orders/', order_management_views.order_list, name='admin_order_list'),
    path('dashboard/orders/<int:order_id>/', order_management_views.order_detail, name='admin_order_detail'),
    path('dashboard/products/<int:product_id>/update/', product_management_views.product_update, name='product_update'),
    path("dashboard/va/", va_admin_page, name="va_admin"),
    path("api/admin/va-chat/", admin_va_chat, name="admin_va_chat"),

    # User Account Management
    path('dashboard/users/all/', user_account_management_views.user_list, name='user_list'),
    path('dashboard/users/<int:user_id>/', user_account_management_views.user_detail, name='user_detail'),
    path('dashboard/users/<int:user_id>/delete/', user_account_management_views.user_delete, name='user_delete'),
    path('dashboard/users/create/', user_account_management_views.user_create, name='user_create'),

    # Product Management (CRUD)
    path('dashboard/products/all/', product_management_views.product_list, name='admin_product_list'),
    path('dashboard/products/create/', product_management_views.product_create, name='product_create'),
    path('dashboard/products/<int:product_id>/', product_management_views.product_detail, name='product_detail'),
    path('dashboard/products/<int:product_id>/delete/', product_management_views.product_delete, name='product_delete'),
    path('dashboard/products/<int:product_id>/edit/', product_management_views.product_update, name='product_update'),
    path('dashboard/products/add/', product_management_views.product_add_view, name='product_add'),

    # Order Management (CRUD)
    path('dashboard/orders/all/', order_management_views.order_list, name='order_list'),
    path('dashboard/orders/<int:order_id>/', order_management_views.order_detail, name='order_detail'),

    # Vendor Management (CRUD)
    path('dashboard/vendors/', vendor_management_views.manage_vendor, name='vendor_list'),
    path('dashboard/vendors/<int:vendor_id>/', vendor_management_views.vendor_detail, name='vendor_detail'),
    path('dashboard/vendors/<int:vendor_id>/delete/', vendor_management_views.vendor_delete, name='vendor_delete'),
    path('vendors/add/', vendor_management_views.add_vendor, name='vendor_add'),
    
    # Sales Analytic (Views)
    path('dashboard/admin/sales/', admin_sales_views.admin_sales_dashboard, name='admin_sales_dashboard'),

    # CSV Upload
    path('dashboard/upload-products/', upload_products_csv, name='upload_products_csv'),

    # --------------------
    # Custom Vendor (Changed prefix to dashboard/ to avoid Django admin conflict)
    # --------------------
    path('vendor/dashboard/', vendor_views.vendor_dashboard, name='vendor_dashboard'),    
    path('products/', vendor_product_views.manage_product, name='vendor_product_list'),
    path('products/<int:product_id>/', vendor_product_views.product_detail, name='vendor_product_detail'),
    path('vendor/products/create/', vendor_product_views.vendor_product_create, name='vendor_product_create'),
    path('products/<int:product_id>/delete/', vendor_product_views.delete_product, name='vendor_product_delete'),
    path('products/<int:product_id>/edit/', vendor_product_views.edit_product, name='vendor_product_edit'),
    path('orders/', vendor_order_views.manage_order, name='vendor_order_list'),
    path('orders/<int:order_id>/', vendor_order_views.order_detail, name='vendor_order_detail'),
    path('deliveries/', vendor_delivery_views.delivery_management, name='vendor_delivery_list'),
    path('deliveries/<int:delivery_id>/', vendor_delivery_views.delivery_detail, name='vendor_delivery_detail'),
    path('customers/', vendor_customer_views.manage_customer, name='vendor_customer_list'),
    path('customers/<int:user_id>/', vendor_customer_views.customer_detail, name='vendor_customer_detail'),
    path('vendor-panel/', vendor_views.vendor_login, name='vendor_login'),
    path('vendor/logout/', vendor_views.vendor_logout, name='vendor_logout'),
    path('vendor/sales/', vendor_sales_views.vendor_sales_dashboard, name='vendor_sales_dashboard'),
    path('vendor/login/', vendor_views.vendor_login, name='vendor_login'),
    path('vendor/register/', vendor_views.vendor_register, name='vendor_register'),
    path('vendor/reset-password/', vendor_views.vendor_reset_password, name='vendor_reset_password'),
    path('vendor/profile/', vendor_views.update_vendor_profile, name='vendor_profile_edit'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
