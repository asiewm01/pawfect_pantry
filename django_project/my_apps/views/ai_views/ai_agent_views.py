from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.conf import settings
from ...models import Order, Product
import spacy, re
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
    "hedgehog": "Insectivore and Omnivore – thrives on mix of insect, fruits, starch and animal protein. More tolerant of fiber compared to other carnivore.",
    "fennec fox": "Insectivore and Omnivore – similar to hedgehog and domestic dogs, thrives on mix of insect, fruits, starch and animal protein.",
    "husky": "High-energy breed – does well on a high-protein, high-fat diet but low carbs.",
    "sheepdog": "Herding breed – tolerant of carbs and plant protein. Lower fat tolerance, can handle protein as low as 25%."
}

product_types = [
    "Game Meat (e.g. venison, rabbit, crocodile, kangaroo)",
    "Insect (e.g. black soldierfly larvae, mealworm larvae, crickets)",
    "Whole Prey (e.g. frozen quails, frozen mice, pinkies)",
    "Sustainable Seafood (e.g. sardines, salmon, trout, cod, fish trimmings)",
    "Dairy Treats (e.g. goat milk bites, cheese, ice cream)",
    "Artisanal Meats (e.g. blood sausage, camel jerky, artisanal ham)"
]

# Load NLP model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

client = OpenAI(api_key=settings.OPENAI_API_KEY)

# Login-required wrapper
def custom_login_required(view_func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Authentication required."}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper

# Main AI Agent View
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

        # Profanity filter
        if (use_profanity_filter and profanity.contains_profanity(msg)) or \
           (not use_profanity_filter and any(word in msg for word in PROFANITY_LIST)):
            return JsonResponse({"reply": "⚠️ That’s not a polite message. Please ask respectfully."})

        # Get user context (latest order)
        order = Order.objects.filter(user=user).order_by('-date').first()
        context_info = f"User's latest order: #{order.id} – Status: {order.status}" if order else "No order found."

        # System prompt
        system_prompt = (
            "You are Dr.AI, a knowledgeable and friendly pet nutrition assistant for an ethical online pet food store. "
            "You help users understand dietary needs based on their pet’s species or breed. "
            "Nutrition facts:\n"
            "- Ferrets & cats are obligate carnivores: high fat/protein, zero carbs.\n"
            "- Hedgehogs & fennec foxes are insectivore-omnivores: can tolerate insects, fruit, starch.\n"
            "- Huskies need high-protein, high-fat, low-carb diets.\n"
            "- Sheepdogs tolerate higher grain, soy, and carb but less fat, and 25%+ protein.\n"
            "We also sell products like game meat, seafood, dairy-based treats, insects, and artisanal meats.\n"
            f"{context_info}"
        )

        # Message to GPT (default to file name if no message)
        user_input = msg or f"A file was uploaded: {uploaded_file.name}"

        # Send to GPT
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ]
        )

        gpt_reply = response.choices[0].message.content

        return JsonResponse({
            "reply": gpt_reply,
            "entities": [(ent.text, ent.label_) for ent in nlp(msg or "") if ent.text]
        })

    except Exception as e:
        print("❌ AI Agent Error:", e)
        return JsonResponse({"error": str(e)}, status=500)
