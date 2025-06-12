from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from django.shortcuts import render
from ...models import Order, Product, UserProfile, Vendor
from django.db.models import Q, Sum, Count
from django.utils.timezone import now
from openai import OpenAI
import json, re, spacy, traceback

nlp = spacy.load("en_core_web_sm")

def va_admin_page(request):
    print("✅ va_admin_page view called")
    return render(request, "admin/va_admin.html")


@csrf_exempt
def admin_va_chat(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed."}, status=405)

    try:
        data = json.loads(request.body)
        user_input = data.get("message", "").strip()
        if not user_input:
            return JsonResponse({"reply": "Please enter a message."})

        today = now().date()
        first_day_month = today.replace(day=1)
        match_context = ""

        # Named Entity Recognition (extract names)
        doc = nlp(user_input)
        person_names = [ent.text for ent in doc.ents if ent.label_ == "PERSON"]

        # 1️⃣ Monthly sales total
        if re.search(r"(sales|revenue).*(month|total)", user_input, re.I):
            total_sales = Order.objects.filter(date__gte=first_day_month).aggregate(Sum("total_price"))["total_price__sum"] or 0
            match_context = f"This month's total sales are ${total_sales:.2f}."

        # 2️⃣ Top 5 products
        elif re.search(r"(top|most).*products", user_input, re.I):
            top_products = (
                Product.objects.annotate(order_count=Count("orderitem"))
                .order_by("-order_count")[:5]
            )
            if top_products:
                product_summary = ", ".join([f"{p.name} ({p.order_count} orders)" for p in top_products])
                match_context = f"Top 5 products: {product_summary}."
            else:
                match_context = "No product order data available."

        # 3️⃣ Low-stock products
        elif re.search(r"low.*stock", user_input, re.I):
            low_stock = Product.objects.filter(stock__lte=5)
            if low_stock.exists():
                match_context = "Low-stock products: " + ", ".join(p.name for p in low_stock)
            else:
                match_context = "No low-stock products currently."

        # 4️⃣ New customers
        elif re.search(r"new customers|customers.*(joined|signup)", user_input, re.I):
            recent_customers = UserProfile.objects.filter(date_joined__gte=first_day_month).count()
            match_context = f"{recent_customers} new customers joined this month."

        # 5️⃣ Vendors missing emails
        elif re.search(r"vendor.*missing", user_input, re.I):
            missing_emails = Vendor.objects.filter(contact_email__isnull=True).count()
            match_context = f"There are {missing_emails} vendors missing contact emails."

        # 6️⃣ Top 5 customers
        elif re.search(r"(most|top).*customers", user_input, re.I):
            from django.contrib.auth import get_user_model
            User = get_user_model()
            top_customers = (
                User.objects.annotate(order_count=Count("order"))
                .order_by("-order_count")[:5]
            )
            if top_customers:
                customer_summary = ", ".join([f"{u.username} ({u.order_count} orders)" for u in top_customers])
                match_context = f"Top 5 customers this month: {customer_summary}."
            else:
                match_context = "No customer order data found."

        # 7️⃣ Most active customer this month
        elif re.search(r"(who|which).*customer.*(order|bought|purchase).*(most|highest).*(month|recent|latest)", user_input, re.I):
            from django.contrib.auth import get_user_model
            User = get_user_model()
            top_customer = (
                User.objects.filter(order__date__gte=first_day_month)
                .annotate(order_count=Count("order"))
                .order_by("-order_count")
                .first()
            )
            if top_customer:
                match_context = f"The most active customer this month is {top_customer.username} with {top_customer.order_count} orders."
            else:
                match_context = "No customer has placed orders this month."

        # 8️⃣ Recent orders
        elif re.search(r"(latest|recent).*orders.*month", user_input, re.I):
            recent_orders = Order.objects.filter(date__gte=first_day_month).order_by("-date")[:5]
            if recent_orders.exists():
                order_summary = []
                for o in recent_orders:
                    product_names = [item.product.name for item in o.orderitem_set.all()]
                    summary = f"#{o.id} ({o.status}) – " + ", ".join(product_names)
                    order_summary.append(summary)
                match_context = "Recent orders this month: " + " | ".join(order_summary)
            else:
                match_context = "No orders found for this month."

        # 9️⃣ Inventory count
        elif re.search(r"how many.*(products|items|stock|inventory)", user_input, re.I):
            product_count = Product.objects.count()
            match_context = f"You currently have {product_count} product{'s' if product_count != 1 else ''} in your database."

        # 🔟 Keyword-based product search
        elif re.search(r"(have|any|carry|sell).*(items|products|stock|things|stuff)?", user_input, re.I):
            keywords = [word for word in user_input.split() if len(word) > 3]
            query = Q()
            for kw in keywords:
                query |= Q(name__icontains=kw) | Q(description__icontains=kw)
            matches = Product.objects.filter(query).distinct()
            if matches.exists():
                match_context = "Matching products: " + ", ".join([f"{p.name} (${p.price})" for p in matches[:5]])
            else:
                match_context = "No matching products found in the database."

        # 🔍 Check for named customer query like “Mabel”
        elif person_names:
            person_name = person_names[0]
            matched_customer = UserProfile.objects.filter(full_name__icontains=person_name).first()
            if matched_customer:
                order_count = matched_customer.order_set.count()
                match_context = f"Customer {matched_customer.full_name} has placed {order_count} orders in total."
            else:
                match_context = f"Sorry, I couldn't find a customer named {person_name}."

        # 🧭 Default fallback
        else:
            match_context = (
                "You can ask me about product stock, top-selling items, total sales, recent orders, "
                "low-stock alerts, customer counts, or vendor data. Try something like 'top products this month' or 'total sales'."
            )

        # 💬 OpenAI GPT Assistant
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": f"You are an intelligent admin assistant for a pet e-commerce platform. "
                               f"ONLY respond based on the following real-time store data: {match_context}. "
                               f"Do not invent data. Keep your reply concise and natural.",
                },
                {"role": "user", "content": user_input},
            ],
        )
        assistant_reply = response.choices[0].message.content.strip()
        return JsonResponse({"reply": assistant_reply})

    except Exception as e:
        traceback.print_exc()
        return JsonResponse({"reply": f"❌ Error: {str(e)}"}, status=500)
