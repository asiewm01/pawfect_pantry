from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from ...models import Order, Product
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import openai, json, spacy
import re
from django.db.models import Q


REACT_URL = (
    settings.REACT_URL_DEV
    if getattr(settings, "DEBUG", True)
    else settings.REACT_URL_PROD
)

# Optional profanity filter
try:
    from better_profanity import profanity
    profanity.load_censor_words()
    use_profanity_filter = True
except ImportError:
    use_profanity_filter = False
    PROFANITY_LIST = ["fuck", "shit", "wtf", "bitch", "asshole", "dick", "cunt", "pussy", "idiot", "dumb ass"]

# Load models
openai.api_key = settings.OPENAI_API_KEY
analyzer = SentimentIntensityAnalyzer()

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def custom_login_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required."}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper

@csrf_exempt
@custom_login_required
def chatbot_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "❌ POST method required."}, status=405)

    try:
        data = json.loads(request.body)
        msg = data.get("message", "").strip().lower()

        if not msg:
            return JsonResponse({"error": "Message cannot be empty."}, status=400)

        user = request.user

        # 🔒 Profanity check
        if (use_profanity_filter and profanity.contains_profanity(msg)) or \
           (not use_profanity_filter and any(word in msg for word in PROFANITY_LIST)):
            return JsonResponse({"reply": "⚠️ That’s not a polite message. Please ask respectfully."})

        # ✅ RULE-BASED RESPONSES
        # 🛒 Cart-related message check
        if any(w in msg for w in ["cart", "shopping cart", "my cart", "check cart"]):
            order = Order.objects.filter(user=user).order_by('-date').first()
            if order:
                reply = (
                    f"🛒 Your latest order (#{order.id}) is <strong>'{order.status}'</strong>. "
                    f"Total: <strong>${order.total:.2f}</strong>. ETA: 3–5 business days.<br><br>. "
                    f"🧾 View your cart and checkout details here: "
                    f"<a href='{REACT_URL}/cart' target='_blank'>Check and Go to Cart</a>. "
                    f"Also Remember to refresh the website in order to view your cart, order and dashboard. "

                )
            else:
                reply = (
                    "🛍️ You currently have no items in your cart or no recent orders.<br>"
                    f"Browse products here: <a href='{REACT_URL}/catalogue' target='_blank'>Catalogue</a>"
                )
            return JsonResponse({"reply": reply})

        # 📦 Order tracking/status
        if any(w in msg for w in ["order", "track", "tracking", "status", "delivery"]):
            order = Order.objects.filter(user=user).order_by('-date').first()
            if order:
                reply = (
                    f"🧾 Your latest order (#{order.id}) is <strong>'{order.status}'</strong>. "
                    f"Total: <strong>${order.total:.2f}</strong>. ETA: 3–5 business days.<br><br>. "
                    f"📦 View full order history: "
                    f"<a href='{REACT_URL}/orders/history' target='_blank'>Order History</a>"
                )
            else:
                reply = (
                    "🕵️ No orders found yet.<br>"
                    f"You can view your order history once you’ve placed an order: "
                    f"<a href='{REACT_URL}/orders/history' target='_blank'>Order History</a>"
                )
            return JsonResponse({"reply": reply})

        elif "payment" in msg and any(w in msg for w in ["status", "did", "pay", "check"]):
            order = Order.objects.filter(user=user).order_by('-date').first()
            reply = (
                f"✅ Payment of ${order.total:.2f} received for order #{order.id}."
                if order else "❌ No payment found."
            )
            return JsonResponse({"reply": reply})

        elif any(w in msg for w in ["cat", "kitten"]):
            products = Product.objects.filter(species__icontains="cat")[:3]
            if products:
                reply = "🐱 Cat picks:<br>" + "<br>".join(
                    [f'<a href="{REACT_URL}/catalogue/{p.id}/">{p.name} - ${p.price}</a>' for p in products]
                )
            else:
                reply = "😿 No cat products found."
            return JsonResponse({"reply": reply})

        elif any(w in msg for w in ["dog", "puppy"]):
            products = Product.objects.filter(species__icontains="dog")[:3]
            if products:
                reply = "🐶 Dog picks:<br>" + "<br>".join(
                    [f'<a href="{REACT_URL}/catalogue/{p.id}/">{p.name} - ${p.price}</a>' for p in products]
                )
            else:
                reply = "🐾 No dog products found."
            return JsonResponse({"reply": reply})

        elif any(w in msg for w in ["jerky", "dried"]):
            products = Product.objects.filter(food_type__icontains="dried")[:3]
            if products:
                reply = "🥓 Jerky picks:<br>" + "<br>".join(
                    [f'<a href="{REACT_URL}/catalogue/{p.id}/">{p.name} - ${p.price}</a>' for p in products]
                )
            else:
                reply = "🚫 No jerky or dried meat available."
            return JsonResponse({"reply": reply})

        elif re.search(r"\b(hello|hi|help)\b", msg):
            return JsonResponse({"reply": "👋 Hi there! How can I assist you today?"})
        
        # NEW: Keyword search through SQL if message contains product keywords
        product_keywords = msg.lower().split()
        query = Q()
        for kw in product_keywords:
            query |= Q(description__icontains=kw) | Q(species__icontains=kw) | Q(food_type__icontains=kw)

        matched_products = Product.objects.filter(query)

        if matched_products.exists():
            results = matched_products.distinct()[:5]
            reply = "🔎 Here’s what I found based on your search:<br>" + "<br>".join(
                [f'<a href="{REACT_URL}/catalogue/{p.id}/">{p.name} - ${p.price}</a>' for p in results]
            )   
            return JsonResponse({"reply": reply})

        # ✅ NLP fallback if no rule matched
        doc = nlp(msg)
        entities = [(ent.label_, ent.text) for ent in doc.ents]
        sentiment_score = analyzer.polarity_scores(msg)
        sentiment = (
            "positive" if sentiment_score["compound"] >= 0.3 else
            "negative" if sentiment_score["compound"] <= -0.0 else
            "neutral"
        )

        # ✅ Manual frustration detection (before sentiment fallback)
        if re.search(r"\b(cannot find|can\'t find|no products|nothing|not found|empty|search fail|nothing here)\b", msg):
            return JsonResponse({
                    "reply": (
                    "😞 Sorry you're having trouble finding what you need. "
                    "Please click here to chat with support: "
                    "<a href='https://wa.me/+6592702017' target='_blank'>WhatsApp Support</a> or <a href='https://www.messenger.com' target='_blank'>Messenger Support</a>"                ),
                "sentiment": sentiment,
                "entities": entities
            })

        # Sentiment-based fallback
        if sentiment == "positive":
            return JsonResponse({
                "reply": "🎉 Thanks for the positive feedback!",
                "sentiment": sentiment,
                "entities": entities
            })
        elif sentiment == "negative":
                return JsonResponse({
                "reply": (
                    "😞 Sorry to hear that. Chat with support: "
                    "<a href='https://wa.me/+6592702017' target='_blank'>WhatsApp</a>"
                ),
                "sentiment": sentiment,
                "entities": entities
            })

        # ✅ OpenAI GPT fallback if nothing else matched
        order = Order.objects.filter(user=user).order_by('-date').first()
        context_info = f"User's order: #{order.id}, status: {order.status}" if order else "No order yet."

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"You are a helpful assistant. Context: {context_info}"},
                {"role": "user", "content": msg},
            ]
        )
        gpt_reply = response['choices'][0]['message']['content']

        return JsonResponse({
            "reply": gpt_reply,
            "sentiment": sentiment,
            "entities": entities
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
