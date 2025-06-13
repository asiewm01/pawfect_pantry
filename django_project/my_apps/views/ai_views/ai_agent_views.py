
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from my_apps.models import Order, Product
from my_apps.chains.product_recommender import chain
from ...utils.custom_login_required import custom_login_required
import spacy
from django.conf import settings


REACT_URL = (
    settings.REACT_URL_DEV
    if getattr(settings, "DEBUG", True)
    else settings.REACT_URL_PROD
)

# Load spaCy model globally
nlp = spacy.load("en_core_web_sm")

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
    if request.method != "POST":
        return JsonResponse({"error": "❌ POST method required."}, status=405)

    try:
        msg = request.POST.get("message", "").strip().lower()
        uploaded_file = request.FILES.get("file")
        user = request.user

        if not msg and not uploaded_file:
            return JsonResponse({"error": "Please enter a message or upload a file."}, status=400)

        # Handle greetings
        if msg in ["hello", "hi", "hey"]:
            return JsonResponse({
                "reply": "👋 Hello there! I'm Dr.AI – your virtual pet nutrition assistant. Ask me anything about pet food or dietary needs!",
                "products": [],
                "entities": [],
                "context": "Greeting received.",
                "pet_summary": "",
                "care_tips": []
            })

        # Redirect order/cart queries to Nova
        if any(keyword in msg for keyword in ["order", "cart", "track", "status", "delivery", "shipping"]):
            return JsonResponse({
                "reply": (
                    f"📦 This sounds like an order or delivery question.<br>"
                    f"👉 Please visit <a href='{REACT_URL}/nova' target='_blank'><strong>Nova</strong></a> – "
                    "our order assistant – for help with tracking, cart issues, or delivery updates."
                ),
                "products": [],
                "entities": [],
                "context": "Redirected to Nova",
                "pet_summary": "",
                "care_tips": []
            })
        
        # Profanity check
        if (use_profanity_filter and profanity.contains_profanity(msg)) or            (not use_profanity_filter and any(word in msg for word in PROFANITY_LIST)):
            return JsonResponse({"reply": "⚠️ That’s not a polite message. Please ask respectfully."})

        order = Order.objects.filter(user=user).order_by('-date').first()
        context_info = f"User's latest order: #{order.id} – Status: {order.status}" if order else "No order found."
        user_input = msg or f"A file was uploaded: {uploaded_file.name}"

        try:
            langchain_result = chain.invoke({"user_input": user_input})
            langchain_output = langchain_result.dict()
            print("🧠 LangChain Output:", langchain_output)
        except Exception as chain_error:
            print("❌ LangChain Error:", chain_error)
            return JsonResponse({"error": "Dr.AI failed to understand the query."}, status=500)

        if not isinstance(langchain_output, dict):
            return JsonResponse({"error": "AI output format was invalid."}, status=500)

        pet_type = langchain_output.get("pet_type", "your pet")
        keywords = langchain_output.get("recommended_products", [])

        if not keywords:
            return JsonResponse({
                "reply": f"Sorry, I couldn’t find any product suggestions for your query about {pet_type}.",
                "products": [],
                "entities": [],
                "context": context_info,
                "pet_summary": langchain_output.get("pet_summary", ""),
                "care_tips": langchain_output.get("care_tips", [])
            })

        query = Q()
        for kw in keywords:
            query |= Q(name__icontains=kw) | Q(description__icontains=kw)

        recommended_products = Product.objects.filter(query).distinct()

        if recommended_products.count() < 8:
            fallback_products = Product.objects.exclude(id__in=recommended_products).order_by('?')[:8 - recommended_products.count()]
            recommended_products = list(recommended_products) + list(fallback_products)

        filtered_products = [p for p in recommended_products if is_relevant_product(p, pet_type)]

        product_list = [
            {
                "name": p.name,
                "price": str(p.price),
                "description": p.description,
            }
            for p in filtered_products
        ]

        doc = nlp(msg or "")
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
        return JsonResponse({"error": str(e)}, status=500)
