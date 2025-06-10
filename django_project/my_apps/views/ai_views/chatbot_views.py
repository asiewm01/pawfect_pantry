from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from ...models import Order, Product
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import json, spacy
import re
from django.db.models import Q
from openai import OpenAI

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
    PROFANITY_LIST = ["fuck", "shit", "wtf", "bitch", "asshole", "dick", "cunt", "pussy", "idiot", "dumb ass", "stupid"]

# Load models
client = OpenAI(api_key=settings.OPENAI_API_KEY)
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
        user = request.user

        if not msg:
            return JsonResponse({"error": "Message cannot be empty."}, status=400)

        # 🔒 Profanity check
        if (use_profanity_filter and profanity.contains_profanity(msg)) or \
           (not use_profanity_filter and any(word in msg for word in PROFANITY_LIST)):
            return JsonResponse({"reply": "⚠️ That’s not a polite message. Please ask respectfully."})
        
        # 👋 Greeting / Welcome message rule
        if re.match(r"^(hi|hello|hey|good morning|good afternoon|good evening)\b", msg):
            reply = (
                "👋 Hello! How can I assist you today?<br><br>"
                "Here are some helpful links to get you started:<br><br>"
                "🧭 <a href='/sitemap' target='_blank'>Sitemap</a><br>"
                "📦 <a href='/track-order' target='_blank'>Track Your Order</a><br>"
                "🛒 <a href='/catalogue' target='_blank'>Shop Products</a><br>"
                "📞 <a href='/support' target='_blank'>Customer Support</a> & <a href='/faq' target='_blank'>FAQ</a><br>"
                "👤 <a href='/account' target='_blank'>My Account</a><br>"
            )
            return JsonResponse({"reply": reply})
        
        # Analyze sentiment early
        sentiment_score = analyzer.polarity_scores(msg)
        compound = sentiment_score["compound"]
        sentiment = (
            "positive" if compound >= 0.3 else
            "negative" if compound <= -0.3 else
            "neutral"
        )

        # If positive sentiment and includes praise, skip product match and go to GPT
        is_praise = sentiment == "positive" and any(word in msg for word in ["like", "love", "great", "awesome", "thank", "nice", "best"])
        print("🧠 Sentiment is positive — defer to ChatGPT")

        # ✅ RULE-BASED RESPONSES
        # 🛒 Cart-related message check
        if not is_praise and any(w in msg for w in ["cart", "shopping cart", "my cart", "check cart"]):
            order = Order.objects.filter(user=user).order_by('-date').first()
            if order:
                reply = (
                    f"🛒 Your latest order (#{order.id}) is <strong>'{order.status}'</strong>.<br><br> "
                    f"Total: <strong>${order.total:.2f}</strong>. ETA: 3–5 business days.<br><br>. "
                    f"🧾 View your cart and checkout details here: "
                    f"<a href='{REACT_URL}/cart' target='_blank'>Check and Go to Cart</a>.<br><br> "
                    f"Also Remember to refresh the website in order to view your cart, order and dashboard. "

                )
            else:
                reply = (
                    "🛍️ You currently have no items in your cart or no recent orders.<br><br>"
                    f"Browse products here: <a href='{REACT_URL}/catalogue' target='_blank'>Catalogue</a>"
                )
            return JsonResponse({"reply": reply})
        
        # 📦 Order tracking/status
        if not is_praise and any(w in msg for w in ["order", "track", "tracking", "status", "delivery"]):
            order = Order.objects.filter(user=user).order_by('-date').first()
            if order:
                reply = (
                    f"🧾 Your latest order (#{order.id}) is <strong>'{order.status}'</strong>. <br><br>"
                    f"Total: <strong>${order.total:.2f}</strong>. ETA: 3–5 business days.<br><br>. "
                    f"📦 View full order history: <br><br>"
                    f"<a href='{REACT_URL}/orders/history' target='_blank'>Order History</a>"
                )
            else:
                reply = (
                    "🕵️ No orders found yet.<br>"
                    f"You can view your order history once you’ve placed an order: <br><br>"
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

        # ✅ NLP fallback if no rule matched
        print("🧠 Entering NLP fallback...")

        doc = nlp(msg)
        entities = [(ent.label_, ent.text) for ent in doc.ents]
        print(f"📦 Extracted entities: {entities}")

        sentiment_score = analyzer.polarity_scores(msg)
        print(f"🎯 Sentiment score: {sentiment_score}")

        compound = sentiment_score["compound"]
        sentiment = (
            "positive" if compound >= 0.3 else
            "negative" if compound <= -0.0 else
            "neutral"
        )
        print(f"🧪 Classified sentiment: {sentiment}")

        # 🔍 Keyword search through SQL if message contains product-related keywords
        if not is_praise:
            product_keywords = msg.lower().split()
            query = Q()
            for kw in product_keywords:
                query |= (
                    Q(name__icontains=kw) |
                    Q(description__icontains=kw) |
                    Q(species__icontains=kw) |
                    Q(food_type__icontains=kw)
                )

            matched_products = Product.objects.filter(query).distinct()

            if matched_products.exists():
                results = matched_products[:5]
                reply = "🔎 Here’s what I found based on your search:<br><br>" + "<br>".join(
                    [f'<a href="{REACT_URL}/catalogue/{p.id}/">{p.name} - ${p.price:.2f}</a>' for p in results]
                )
                return JsonResponse({"reply": reply})

        # 🚨 Escalation logic
        frustration_keywords = [
            "can't find", "cannot find", "not helpful", "nothing here",
            "waste of time", "useless", "not working", "no help", "frustrated"
        ]
        trigger_escalation = sentiment == "negative" or any(kw in msg for kw in frustration_keywords)

        if trigger_escalation:
            print("🚨 Escalation triggered: forwarding to human agent")
            return JsonResponse({
                "reply": (
                    "⚠️ I'm sorry I couldn't help. Let me connect you with a human agent. <br><br>"
                    "💬 <a href='https://wa.me/6592702017' target='_blank'>Chat on WhatsApp. </a><br>"
                    "💬 <a href='https://m.me/yourpageid' target='_blank'>Continue on Messenger. </a>"
                ),
                "sentiment": sentiment,
                "entities": entities,
                "whatsapp": "https://wa.me/+6592702017",
                "messenger": "https://m.me/yourpageid"
            })
                
        # ✅ Context
        order = Order.objects.filter(user=user).order_by('-date').first()
        context_info = f"User's order: #{order.id}, status: {order.status}" if order else "No order yet."

        # ✅ Use OpenAI (v1+ syntax)
        client = OpenAI(api_key=settings.OPENAI_API_KEY)

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful AI assistant for a pet food e-commerce store. "
                        "The store specializes in premium and diverse food options for a wide range of species, including dogs, cats, ferrets, rabbits, hedgehogs, birds, pigs, sugar gliders, and primates. "
                        "The product catalog includes frozen prey, dried exotic meats from feral animals, jerky, sustainable seafood, herbivore hay, dairy-based treats, insect-based snacks, dried fruits, and natural formulations tailored for obligate carnivores, facultative carnivores, omnivores, and herbivores. "
                        f"Use this context to guide your responses. {context_info}"
                    )
                },
                {
                    "role": "user",
                    "content": msg
                }
            ]
        )

        gpt_reply = response.choices[0].message.content

        return JsonResponse({
            "reply": gpt_reply,
            "sentiment": sentiment,
            "entities": entities
        })

    except Exception as e:
        print("❌ OpenAI Error:", e)
        return JsonResponse({"error": str(e)}, status=500)