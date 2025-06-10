from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from ...models import Order, Product
import json, spacy, re
from django.db.models import Q
from openai import OpenAI

REACT_URL = (
    settings.REACT_URL_DEV if getattr(settings, "DEBUG", True)
    else settings.REACT_URL_PROD
)

# Optional profanity filter
try:
    from better_profanity import profanity
    profanity.load_censor_words()
    use_profanity_filter = True
except ImportError:
    use_profanity_filter = False
    PROFANITY_LIST = [
        "fuck", "shit", "wtf", "bitch", "asshole", "dick", "cunt", "pussy", "idiot", "dumb ass", "stupid"
    ]

# Nutrition facts
species_nutrition = {
    "ferret": "Obligate carnivore – needs high fat and protein, no carbs.",
    "cat": "Obligate carnivore – similar to ferrets, thrives on meat-based diets.",
    "husky": "High-energy breed – does well on a high-protein, high-fat diet but low carbs diet.",
    "sheepdog": "Herding breed – higher tolerant of carbs and plant-based protein due to their agriculture work ancestry."
}

product_types = [
    "Game Meat (e.g. venison, rabbit)",
    "Sustainable Seafood (e.g. sardines, salmon)",
    "Dairy Treats (e.g. goat milk bites, cheese)",
    "Artisanal Meats (e.g. blood sausage, camel jerky)"
]

client = OpenAI(api_key=settings.OPENAI_API_KEY)

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
def ai_agent_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "❌ POST method required."}, status=405)

    try:
        data = json.loads(request.body)
        msg = data.get("message", "").strip().lower()
        user = request.user

        if not msg:
            return JsonResponse({"error": "Message cannot be empty."}, status=400)

        # 🔒 Profanity filter
        if (use_profanity_filter and profanity.contains_profanity(msg)) or \
           (not use_profanity_filter and any(word in msg for word in PROFANITY_LIST)):
            return JsonResponse({"reply": "⚠️ That’s not a polite message. Please ask respectfully."})

        # 🔁 Context: recent order
        order = Order.objects.filter(user=user).order_by('-date').first()
        context_info = f"User's order: #{order.id}, status: {order.status}" if order else "No order yet."

        # 🧐 Build system prompt
        system_prompt = (
            "You are a knowledgeable pet nutrition assistant for an online store. "
            "You help pet owners understand the dietary needs of different species and breeds. "
            "Ferrets and cats are obligate carnivores — they require high protein and fat with minimal carbs. "
            "Some dog breeds like huskies have similar needs, while herding dogs like sheepdogs tolerate more carbs. "
            "You also explain our product catalog: game meat, seafood, dairy-based treats, artisanal meats, etc. "
            f"Use this context to assist users. {context_info}"
        )

        # 🎯 Send to GPT
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": msg}
            ]
        )

        gpt_reply = response.choices[0].message.content
        return JsonResponse({
            "reply": gpt_reply,
            "entities": [(ent.text, ent.label_) for ent in nlp(msg).ents]
        })

    except Exception as e:
        print("❌ OpenAI Error:", e)
        return JsonResponse({"error": str(e)}, status=500)
