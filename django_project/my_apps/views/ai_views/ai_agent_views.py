#add ai_agnet_views.py, chain folder, AiAgent.js, custom_login_required.py, updte requirements.txt

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q, Sum
from my_apps.models import Order, Product, UserProfile
from my_apps.chains.product_recommender import chain
from ...utils.custom_login_required import custom_login_required
import spacy, traceback, re, json
from django.http import JsonResponse
from functools import wraps

def custom_login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        print("🔒 custom_login_required triggered")  # <-- ADD THIS

        if not request.user.is_authenticated:
            print("❌ User not authenticated")
            return JsonResponse({"error": "Unauthorized"}, status=401)

        print("✅ User authenticated")
        return view_func(request, *args, **kwargs)

    return wrapper

# Load spaCy model globally
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    raise RuntimeError("spaCy model 'en_core_web_sm' is not installed. Run: python -m spacy download en_core_web_sm")

# Profanity filtering
use_profanity_filter = True
try:
    from better_profanity import profanity
    profanity.load_censor_words()
except ImportError:
    use_profanity_filter = False
    PROFANITY_LIST = [
        "fuck", "shit", "wtf", "bitch", "asshole", "dick", "cunt", "pussy", "idiot", "dumb ass", "stupid"
    ]


def is_relevant_product(product, pet_type):
    """
    Filters out unsuitable products based on pet type.
    Dogs and cats should not get hay, rodent food, or small animal treats.
    """
    name = product.name.lower()
    desc = product.description.lower()
    pet_type = pet_type.lower()

    exclude_keywords = ['hay', 'alfalfa', 'hedgehog', 'rabbit', 'guinea pig', 'small pet', 'rodent']

    if pet_type in ['dog', 'cat']:
        if any(keyword in name or keyword in desc for keyword in exclude_keywords):
            return False
    return True

@csrf_exempt
@custom_login_required
def ai_agent_view(request):
    print("✅ ai_agent_view reached")

    if request.method != "POST":
        return JsonResponse({"error": "❌ POST method required."}, status=405)

    try:
        # ✅ Initialize msg
        msg = ""

        # ✅ Parse JSON or FormData
        if request.content_type.startswith("application/json"):
            try:
                data = json.loads(request.body)
                msg = data.get("message", "").strip().lower()
            except Exception as parse_error:
                return JsonResponse({"error": f"Invalid JSON: {str(parse_error)}"}, status=400)
        else:
            msg = request.POST.get("message", "").strip().lower()

        uploaded_file = request.FILES.get("file")
        user = request.user

        if not msg and not uploaded_file:
            return JsonResponse({"error": "Please enter a message or upload a file."}, status=400)

        # ✅ Handle greetings gracefully
        if re.match(r"^(hi|hello|hey|greetings|good morning|good afternoon)", msg, re.I):
            return JsonResponse({
                "reply": "👋 Hello! I'm Dr.AI. Tell me about your pet or their diet so I can help you better 🐾"
            })

        # ✅ Profanity filter
        if (use_profanity_filter and profanity.contains_profanity(msg)) or \
           (not use_profanity_filter and any(word in msg for word in PROFANITY_LIST)):
            return JsonResponse({"reply": "⚠️ That’s not a polite message. Please ask respectfully."})
        
        # ✅ 🧠 Check for customer lookup
        if re.search(r"(customer|user).*(named|called)?\s*(\w+)", msg):
            name_match = re.search(r"(customer|user).*(named|called)?\s*(\w+)", msg)
            search_name = name_match.group(3)
            customer = UserProfile.objects.filter(
                Q(user__username__icontains=search_name) |
                Q(user__first_name__icontains=search_name) |
                Q(user__last_name__icontains=search_name)
            ).first()
            if customer:
                return JsonResponse({
                    "reply": f"✅ Found customer: {customer.user.get_full_name()} – Email: {customer.user.email}"
                })
            else:
                return JsonResponse({
                    "reply": f"❌ No customer named {search_name} found."
                })
            
        if "who purchased the most" in msg or "top buyer" in msg:
            from django.utils.timezone import now
            from datetime import timedelta

            recent_days = now() - timedelta(days=7)

            top_customer = (
            UserProfile.objects
            .filter(user__order__date__gte=recent_days)
            .annotate(total_quantity=Sum("user__order__orderitem__quantity"))
            .order_by("-total_quantity")
            .first()
            )

            if top_customer and top_customer.total_quantity:
                return JsonResponse({
                    "reply": f"🛍️ In the past 7 days, {top_customer.user.get_full_name()} purchased the most products — {top_customer.total_quantity} items total."
                })
            else:
                return JsonResponse({"reply": "No purchase data found in the last few days."})
            
        if "top-selling" in msg or "most popular product" in msg or "best-selling" in msg:
            top_product = (
                Product.objects
                .annotate(total_sales=Sum("orderitem__quantity"))
                .order_by("-total_sales")
                .first()
            )

            if top_product and top_product.total_sales:
                return JsonResponse({
                    "reply": f"🔥 Our most popular product is '{top_product.name}' with {top_product.total_sales} units sold."
                })
            else:
                return JsonResponse({"reply": "No sales data available yet to determine a top-selling product."})
            
        if "recent orders" in msg or "latest orders" in msg or "recent sales" in msg:
            recent_orders = Order.objects.select_related("user").order_by("-date")[:5]
            if not recent_orders:
                return JsonResponse({"reply": "There are no recent orders."})

            order_data = [
                {
                    "order_id": o.id,
                    "customer": o.user.get_full_name(),
                    "date": o.date.strftime("%Y-%m-%d"),
                    "status": o.status
                }
                for o in recent_orders
            ]

            return JsonResponse({
                "reply": f"📦 Here are the {len(order_data)} most recent orders:",
                "orders": order_data
            })

        # ✅ Fetch latest order context
        order = Order.objects.filter(user=user).order_by('-date').first()
        context_info = (
            f"User's latest order: #{order.id} – Status: {order.status}"
            if order else "No order found."
        )

        user_input = msg or f"A file was uploaded: {uploaded_file.name}"

        # ✅ LangChain call
        try:
            langchain_result = chain.invoke({"user_input": user_input})
            langchain_output = langchain_result.dict() if hasattr(langchain_result, "dict") else langchain_result
            print("🧠 LangChain Output:", langchain_output)
        except Exception as chain_error:
            print("❌ LangChain Error:", chain_error)
            traceback.print_exc()
            return JsonResponse({"error": "Dr.AI failed to understand the query."}, status=500)

        if not isinstance(langchain_output, dict):
            return JsonResponse({"error": "AI output format was invalid."}, status=500)

        # ✅ Handle pet_type and keywords
        pet_type = langchain_output.get("pet_type")
        if not pet_type or pet_type.lower() == "n/a":
            pet_type = "your pet"

        keywords = langchain_output.get("recommended_products", [])
        if not keywords:
            return JsonResponse({
                "reply": f"Sorry, I couldn’t find any product suggestions for your query about {pet_type}.",
                "products": [],
                "entities": [],
                "context": context_info
            })

        # ✅ Product search
        query = Q()
        for kw in keywords:
            query |= Q(name__icontains=kw) | Q(description__icontains=kw)
        recommended_products = Product.objects.filter(query).distinct()

        # ✅ Fallback if not enough
        if recommended_products.count() < 8:
            fallback_products = Product.objects.exclude(id__in=recommended_products).order_by('?')[:8 - recommended_products.count()]
            recommended_products = list(recommended_products) + list(fallback_products)

        # ✅ Filter unsuitable products
        filtered_products = [
            p for p in recommended_products
            if is_relevant_product(p, pet_type)
        ]

        # ✅ Serialize results
        product_list = [
            {
                "name": p.name,
                "price": str(p.price),
                "description": p.description,
            }
            for p in filtered_products
        ]

        # ✅ Named Entity Recognition
        doc = nlp(msg)
        named_entities = [(ent.text, ent.label_) for ent in doc.ents]

        return JsonResponse({
            "reply": f"Here are some recommended products for your {pet_type}:",
            "products": product_list,
            "entities": named_entities,
            "context": context_info,
            "pet_summary": langchain_output.get("pet_summary", ""),
            "care_tips": langchain_output.get("care_tips", [])
        })

    except Exception as e:
        print("❌ AI Agent Error:", e)
        traceback.print_exc()
        return JsonResponse({"error": f"Unhandled error: {str(e)}"}, status=500)