#Update ai_admin_views.py, urls.py, va_admin.html, admin_base.html

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from ...models import Order, Product, UserProfile, Vendor
import openai, json, datetime, re
from django.db.models import Sum, Count
from django.shortcuts import render
from openai import OpenAI
from django.db.models import Q

def va_admin_page(request):
    print("✅ va_admin_page view called")
    return render(request, "admin/va_admin.html")

@csrf_exempt
def admin_va_chat(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed."}, status=405)

    data = json.loads(request.body) 
    user_input = data.get("message", "").strip()
    if not user_input:
        return JsonResponse({"reply": "Please enter a message."})

    openai.api_key = settings.OPENAI_API_KEY
    today = datetime.date.today()
    first_day_month = today.replace(day=1)

    # 1️⃣ — Pattern matching (simplified for MVP)
    match_context = ""
    try:
        if re.search(r"sales.*(month|total)", user_input, re.I):
            total_sales = Order.objects.filter(date__gte=first_day_month).aggregate(Sum("total_price"))["total_price__sum"] or 0
            match_context = f"This month's total sales are ${total_sales:.2f}."

        elif re.search(r"(top|most).*products", user_input, re.I):
            top_products = (
                Product.objects.annotate(order_count=Count("orderitem"))
                .order_by("-order_count")[:5]
            )
            product_summary = ", ".join([f"{p.name} ({p.order_count} orders)" for p in top_products])
            match_context = f"Top 5 products: {product_summary}"

        elif re.search(r"low.*stock", user_input, re.I):
            low_stock_products = Product.objects.filter(stock__lte=5)
            if low_stock_products.exists():
                match_context = "Low-stock products: " + ", ".join(p.name for p in low_stock_products)
            else:
                match_context = "No low-stock products at the moment."

        elif re.search(r"new customers|customers.*(joined|signup)", user_input, re.I):
            recent_customers = UserProfile.objects.filter(date_joined__gte=first_day_month).count()
            match_context = f"{recent_customers} new customers joined this month."

        elif re.search(r"vendor.*missing", user_input, re.I):
            vendors_missing = Vendor.objects.filter(contact_email__isnull=True).count()
            match_context = f"There are {vendors_missing} vendors missing contact email."

        elif re.search(r"(most|top).*customers", user_input, re.I):
            from django.contrib.auth import get_user_model
            User = get_user_model()

            top_customers = (
                User.objects.annotate(order_count=Count("order"))
                .order_by("-order_count")[:5]
            )

            if top_customers:
                customer_summary = ", ".join([f"{c.username} ({c.order_count} orders)" for c in top_customers])
                match_context = f"Top 5 frequent customers by number of orders: {customer_summary}"
            else:
                match_context = "No customer order data found."

        elif re.search(r"(latest|recent).*orders.*month", user_input, re.I):
            recent_orders = Order.objects.filter(date__gte=first_day_month).order_by("-date")[:5]

            if recent_orders.exists():
                order_summary = ", ".join([f"#{o.id} ({o.status})" for o in recent_orders])
                match_context = f"The latest orders this month are: {order_summary}."
            else:
                match_context = "There are no orders for this month yet."

        elif re.search(r"(have|any|carry|sell).*(items|products|stock|things|stuff)?", user_input, re.I):
            # Extract possible keywords from user input
            keywords = [word for word in user_input.split() if len(word) > 3]  # crude keyword filter

            # Build a flexible Q object
            query = Q()
            for kw in keywords:
                query |= Q(name__icontains=kw) | Q(description__icontains=kw)

            matching_products = Product.objects.filter(query).distinct()

            if matching_products.exists():
                match_context = "Matching products: " + ", ".join([f"{p.name} (${p.price})" for p in matching_products[:5]])
            else:
                match_context = "I couldn't find any matching items in your product inventory."

        else:
            match_context = (
            "This is a pet e-commerce dashboard assistant. You can ask about sales, products, "
            "orders, customers, and vendors. If your question is unclear, I may not find an answer."
            )

        # 2️⃣ — GPT formatting
        client = OpenAI(api_key=settings.OPENAI_API_KEY)

        response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # or "gpt-4" if you’re authorized
            messages=[
                {"role": "system", "content": f"You are an admin assistant for a pet store. {match_context}"},
                {"role": "user", "content": user_input}
            ]
        )
        assistant_reply = response.choices[0].message.content
        return JsonResponse({"reply": assistant_reply})

    except Exception as e:
        return JsonResponse({"reply": f"Error: {str(e)}"}, status=500)
