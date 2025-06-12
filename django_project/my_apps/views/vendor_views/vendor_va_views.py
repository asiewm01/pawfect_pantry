from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from django.shortcuts import render
from ...models import Product, Vendor
from django.db.models import Q
from django.utils.timezone import now
import openai
import os
import json
import re

# ✅ Load OpenAI API key from environment
openai_key = os.environ.get("OPENAI_API_KEY", "")
client = openai.OpenAI(api_key=openai_key)
print("🔑 Using OpenAI Key:", openai_key[:10])


def va_vendor_page(request):
    print("✅ va_vendor_page view called (no login required)")
    return render(request, 'vendor/va_vendor.html')


@csrf_exempt
def vendor_va_chat(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed."}, status=405)

    try:
        data = json.loads(request.body)
        user_input = data.get("message", "").strip()

        if not user_input:
            return JsonResponse({"reply": "Please enter a message."})

        # ✅ Get the current vendor
        try:
            vendor = Vendor.objects.get(user=request.user)
        except Vendor.DoesNotExist:
            return JsonResponse({"reply": "❌ Vendor not found for this user."}, status=403)

        match_context = ""

        # 🎯 Intent 1: Count products
        if re.search(r"(how many|total|number).*(products|inventory)", user_input, re.I):
            product_count = Product.objects.filter(vendor=vendor).count()
            match_context = f"You currently have {product_count} product{'s' if product_count != 1 else ''} in your inventory."

        # 🎯 Intent 2: List or refer to product inventory
        elif re.search(r"(what|which|list).*(products|items|inventory|have)", user_input, re.I) or \
             re.search(r"\b(they|those|them)\b", user_input, re.I):
            vendor_products = Product.objects.filter(vendor=vendor)
            if vendor_products.exists():
                product_list = ", ".join([f"{p.name} (${p.price})" for p in vendor_products])
                match_context = f"You have the following products: {product_list}."
            else:
                match_context = "You don't currently have any products in your inventory."

        # 🎯 Intent 3: Order count for this month
        elif re.search(r"(orders|sales).*(this|current).*(month)", user_input, re.I):
            from ...models import Order  # only import if this check triggers
            order_count = Order.objects.filter(
                vendor=vendor,
                created_at__month=now().month,
                created_at__year=now().year
            ).count()
            match_context = f"You have {order_count} order{'s' if order_count != 1 else ''} this month."

        # 🎯 Intent 4: Keyword-based stock/product search
        elif re.search(r"stock|inventory|available|products", user_input, re.I):
            keywords = [w for w in user_input.split() if len(w) > 3]
            query = Q()
            for kw in keywords:
                query |= Q(name__icontains=kw) | Q(description__icontains=kw)

            matching_products = Product.objects.filter(query, vendor=vendor).distinct()
            if matching_products.exists():
                match_context = "Your matching products: " + ", ".join(
                    [f"{p.name} (${p.price})" for p in matching_products[:5]]
                )
            else:
                match_context = "No matching products found in your inventory."

        # 🎯 Default fallback
        else:
            match_context = (
                "This assistant helps vendors like you manage product listings, check inventory, and review order activity."
            )

        # ✅ Call OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"You are Hera, a helpful assistant for vendor '{vendor.user.username}'. {match_context}"},
                {"role": "user", "content": user_input}
            ]
        )

        assistant_reply = response.choices[0].message.content.strip()
        return JsonResponse({"reply": assistant_reply})

    except openai.AuthenticationError:
        return JsonResponse({"reply": "⚠️ Invalid OpenAI API key."}, status=401)

    except Exception as e:
        return JsonResponse({"reply": f"❌ Error: {str(e)}"}, status=500)
