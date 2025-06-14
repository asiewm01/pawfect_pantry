from langchain_openai import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from ...models import Order
import json, re, spacy, traceback
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# LangChain LLM
llm = ChatOpenAI(
    model_name="gpt-3.5-turbo",
    openai_api_key=settings.OPENAI_API_KEY,
    temperature=0.7
)

# NLP tools
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

    # 🔍 Sentiment & Entities
    sentiment_score = analyzer.polarity_scores(user_input)
    sentiment = sentiment_score["compound"]
    doc = nlp(user_input)
    entities = [ent.text for ent in doc.ents]

    # 🚨 Escalation logic
    if sentiment <= -0.4 or re.search(r"(talk to (agent|human)|speak to (someone|rep|staff))", user_input, re.IGNORECASE):
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

    # 🛍️ Product redirect
    if re.search(r"(recommend|suggest|food|product|treat|toy|which brand|what should i get|buy)", user_input, re.IGNORECASE):
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

    # 🗺️ Mock tracking info
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

    # 📦 Direct delivery tracking response
    if re.search(r"(track|delivery|status|where|order id|when.*arrive)", user_input, re.IGNORECASE):
        if latest_order:
            reply_text = (
                "🧾 Hold on, I got something. Based on the satellite images from my system, this is what I got! <br><br>"
                f"🛰️ <b>Order Tracking for Order #{latest_order.id}</b><br>"
                f"📍 <b>Location:</b> {tracking['location']}<br>"
                f"📦 <b>Status:</b> {tracking['status']}<br>"
                f"⏰ <b>ETA:</b> {tracking['eta']}<br>"
                + (f"👤 <b>Agent:</b> {tracking['agent']}" if tracking['agent'] else '')
            )
            return JsonResponse({
                "reply": reply_text,
                "latitude": tracking["latitude"],
                "longitude": tracking["longitude"]
            })
        else:
            return JsonResponse({
                "reply": "❌ I couldn’t find any recent orders under your account. Please make sure you're logged in and have placed an order."
            })

    # 🧠 LangChain GPT fallback
    chat_history = [
        SystemMessage(content="You are Nova, a friendly order support assistant. You help users with delivery updates, order tracking, and order-related issues. You do not answer product or food questions. Escalate to human agent if needed."),
        HumanMessage(content=user_input)
    ]

    try:
        print("🧠 LangChain GPT fallback triggered with:", chat_history)
        response = llm.invoke(chat_history)
        reply = response.content.strip()
        print("✅ GPT reply:", reply)

        return JsonResponse({"reply": reply})
    except Exception as e:
        print("❌ LangChain GPT error:", str(e))
        traceback.print_exc()
        return JsonResponse({
            "reply": "⚠️ Nova encountered an error using LangChain and cannot respond right now."
        }, status=500)
