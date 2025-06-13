from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from openai import OpenAI
from ...models import Order
import json, re, spacy, traceback
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Initialize GPT and sentiment models
client = OpenAI(api_key=settings.OPENAI_API_KEY)
nlp = spacy.load("en_core_web_sm")
analyzer = SentimentIntensityAnalyzer()

# Frontend URL
REACT_URL = settings.REACT_URL_DEV if getattr(settings, "DEBUG", True) else settings.REACT_URL_PROD


@csrf_exempt
def nova_chatbot(request):
    print("👤 User:", request.user, "| Authenticated:", request.user.is_authenticated)
    try:
        return nova_chatbot_internal(request)
    except Exception as e:
        print("❌ Nova crashed unexpectedly:", str(e))
        traceback.print_exc()
        return JsonResponse({"reply": "❌ Nova crashed unexpectedly."}, status=500)


def nova_chatbot_internal(request):
    # ✅ GPT Health Test
    try:
        test = client.models.list()
        print("✅ GPT is reachable!")
    except Exception as e:
        print("❌ GPT unreachable:", e)
        return JsonResponse({
            "reply": "⚠️ Nova is currently down. Please try again later."
        }, status=503)

    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed."}, status=405)

    try:
        data = json.loads(request.body)
        user_input = data.get("message", "").strip()
    except Exception as e:
        print("❌ Invalid JSON:", str(e))
        return JsonResponse({"reply": "Invalid input received."}, status=400)

    if not user_input:
        return JsonResponse({"reply": "👋 Hi! I'm Nova. How can I help with your order today?"})

    # 🔍 Sentiment + NER
    sentiment_score = analyzer.polarity_scores(user_input)
    sentiment = sentiment_score["compound"]
    doc = nlp(user_input)
    entities = [ent.text for ent in doc.ents]

    # 🚨 Escalation
    if (
        sentiment <= -0.4 or
        re.search(r"(talk to (agent|human)|speak to (someone|rep|staff))", user_input, re.IGNORECASE)
    ):
        print("🚨 Escalation triggered")
        return JsonResponse({
            "reply": (
                "⚠️ I'm sorry I couldn't help. Let me connect you with a human agent. <br><br>"
                "💬 <a href='https://wa.me/6592702017' target='_blank'>Chat on WhatsApp</a><br>"
                "💬 <a href='https://m.me/yourpageid' target='_blank'>Continue on Messenger</a>"
            ),
            "sentiment": sentiment,
            "entities": entities,
            "whatsapp": "https://wa.me/6592702017",
            "messenger": "https://m.me/yourpageid"
        })

    # 🛍️ Product query redirect
    product_keywords = r"(recommend|suggest|food|product|treat|toy|which brand|what should i get|buy)"
    if re.search(product_keywords, user_input, re.IGNORECASE):
        return JsonResponse({
            "reply": (
                "🧾 I'm here to help with your orders, deliveries, and tracking.<br><br>"
                f"🔍 For product help, browse our <a href='{REACT_URL}/catalogue' target='_blank'>Catalogue</a>.<br>"
                f"👨🏿‍⚕️ Or talk to <a href='{REACT_URL}/ai-agent' target='_blank'>Dr.AI</a>!"
            )
        })

    # 📦 Order check
    latest_order = None
    if request.user.is_authenticated:
        latest_order = Order.objects.filter(user=request.user).order_by('-date').first()
        print("📦 Latest Order:", latest_order)

    try:
        order_status = latest_order.status.lower() if latest_order and latest_order.status else "processing"
    except Exception as e:
        print("❌ Error reading order:", e)
        order_status = "processing"

    # 🗺️ Mock location data
    mock_tracking_data = {
        "processing": {
            "location": "Warehouse A - West Coast",
            "latitude": 1.3000,
            "longitude": 103.8000,
            "eta": "Tomorrow, 5:00 PM",
            "agent": None,
            "status": "Preparing your order"
        },
        "shipped": {
            "location": "Singapore Port – Pasir Panjang",
            "latitude": 1.2644,
            "longitude": 103.8201,
            "eta": "Today, 7:00 PM",
            "agent": None,
            "status": "Arrived at Singapore Port – clearing customs"
        },
        "out_for_delivery": {
            "location": "Near Sembawang MRT",
            "latitude": 1.4510,
            "longitude": 103.8208,
            "eta": "3:30 PM",
            "agent": "John Doe",
            "status": "Out for delivery"
        },
        "delivered": {
            "location": "Delivered to your doorstep",
            "latitude": None,
            "longitude": None,
            "eta": "Delivered at 2:45 PM",
            "agent": "John Doe",
            "status": "Delivered"
        }
    }

    tracking = mock_tracking_data.get(order_status, mock_tracking_data["processing"])

    # 🛰️ Delivery check
    if re.search(r"(track|delivery|status|where|order id|when.*arrive)", user_input, re.IGNORECASE):
        if latest_order:
            return JsonResponse({
                "reply": (
                    f"🛰️ <b>Order Tracking for Order #{latest_order.id}</b><br>"
                    f"📍 <b>Location:</b> {tracking['location']}<br>"
                    f"📦 <b>Status:</b> {tracking['status']}<br>"
                    f"⏰ <b>ETA:</b> {tracking['eta']}<br>"
                    (f"👤 <b>Agent:</b> {tracking['agent']}" if tracking['agent'] else '')
                ),
                "latitude": tracking["latitude"],
                "longitude": tracking["longitude"]
            })
        else:
            return JsonResponse({
                "reply": "❌ I couldn’t find any recent orders under your account. Please make sure you're logged in and have placed an order."
            })

    # 🤖 GPT fallback
    messages = [
        {
            "role": "system",
            "content": (
                "You are Nova, a friendly order support assistant. You help users with delivery updates, order tracking, "
                "and order-related issues. You do not answer product or food questions. Escalate to human agent if needed."
            )
        },
        {"role": "user", "content": user_input}
    ]

    try:
        print("🧠 GPT fallback triggered with:", messages)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        if hasattr(response, "choices") and response.choices:
            reply = response.choices[0].message.content.strip()
            print("✅ GPT reply:", reply)
        else:
            reply = "⚠️ Nova is having trouble generating a response right now."

        return JsonResponse({ "reply": reply })

    except Exception as e:
        print("❌ GPT fallback error:", str(e))
        traceback.print_exc()
        return JsonResponse({
            "reply": "⚠️ Nova encountered an error and cannot respond right now."
        }, status=500)
