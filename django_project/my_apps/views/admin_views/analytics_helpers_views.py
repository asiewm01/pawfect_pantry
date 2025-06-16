from django.db.models import Sum
from django.db.models.functions import TruncDate, TruncMonth
from my_apps.models import Order, OrderItem, Feedback, CartItem, Vendor, Product

def generate_sales_data(role='admin', user=None):
    if role == 'vendor' and user:
        try:
            vendor = Vendor.objects.get(user=user)
            vendor_products = Product.objects.filter(vendor=vendor)  # Moved up before use

            print("✅ Vendor found:", vendor.business_name or vendor.user.username)
            print("✅ Vendor products:", list(vendor_products.values_list('name', flat=True)))

            daily_sales = (
                OrderItem.objects
                .filter(product__in=vendor_products)
                .annotate(day=TruncDate('order__date'))
                .values('day')
                .annotate(revenue=Sum('price'))
                .order_by('day')
            )

            monthly_sales = (
                OrderItem.objects
                .filter(product__in=vendor_products)
                .annotate(month=TruncMonth('order__date'))
                .values('month')
                .annotate(revenue=Sum('price'))
                .order_by('month')
            )

            top_products = (
                OrderItem.objects
                .filter(product__in=vendor_products)
                .values('product__name')
                .annotate(quantity=Sum('quantity'))
                .order_by('-quantity')[:5]
            )

            feedback_counts = {
                'positive': Feedback.objects.filter(product__in=vendor_products, sentiment='positive').count(),
                'neutral': Feedback.objects.filter(product__in=vendor_products, sentiment='neutral').count(),
                'negative': Feedback.objects.filter(product__in=vendor_products, sentiment='negative').count(),
            }

            total_revenue = (
                OrderItem.objects
                .filter(product__in=vendor_products)
                .aggregate(total=Sum('price'))['total'] or 0
            )

            total_orders = (
                Order.objects
                .filter(items__product__in=vendor_products)
                .distinct()
                .count()
            )

            abandoned_cart_items = (
                CartItem.objects
                .filter(product__in=vendor_products)
                .count()
            )

        except Vendor.DoesNotExist:
            daily_sales = []
            monthly_sales = []
            top_products = []
            feedback_counts = {'positive': 0, 'neutral': 0, 'negative': 0}
            total_revenue = 0
            total_orders = 0
            abandoned_cart_items = 0

    else:
        daily_sales = (
            Order.objects
            .annotate(day=TruncDate('date'))
            .values('day')
            .annotate(revenue=Sum('total'))
            .order_by('day')
        )

        monthly_sales = (
            Order.objects
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(revenue=Sum('total'))
            .order_by('month')
        )

        top_products = (
            OrderItem.objects
            .values('product__name')
            .annotate(quantity=Sum('quantity'))
            .order_by('-quantity')[:5]
        )

        feedback_counts = {
            'positive': Feedback.objects.filter(sentiment='positive').count(),
            'neutral': Feedback.objects.filter(sentiment='neutral').count(),
            'negative': Feedback.objects.filter(sentiment='negative').count(),
        }

        total_revenue = Order.objects.aggregate(total=Sum('total'))['total'] or 0
        total_orders = Order.objects.count()
        abandoned_cart_items = CartItem.objects.count()

    # Final debug output (inside the function)
    print("✅ Sales data being returned:", {
        'role': role,
        'daily_sales': list(daily_sales),
        'monthly_sales': list(monthly_sales),
        'top_products': list(top_products),
        'feedback_counts': feedback_counts,
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'abandoned_cart_items': abandoned_cart_items,
    })

    return {
        'role': role,
        'daily_sales': daily_sales,
        'monthly_sales': monthly_sales,
        'top_products': top_products,
        'feedback_counts': feedback_counts,
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'abandoned_cart_items': abandoned_cart_items,
    }
