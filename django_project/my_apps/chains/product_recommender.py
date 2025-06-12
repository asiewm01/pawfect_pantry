from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.output_parsers import StructuredOutputParser, ResponseSchema
from langchain_core.runnables import RunnableSequence
from langchain.output_parsers import PydanticOutputParser
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List

# Define expected structure of AI output
class PetAdviceOutput(BaseModel):
    pet_type: str
    pet_summary: str
    care_tips: List[str]
    recommended_products: List[str]

# Load environment variables
load_dotenv()

# Initialize LLM
llm = ChatOpenAI(
    model="gpt-3.5-turbo",
    temperature=0,
    api_key=os.getenv("OPENAI_API_KEY")
)

# Define expected response schemas
response_schemas = [
    ResponseSchema(
        name="pet_type",
        description="The specific pet species or breed mentioned by the user, such as 'husky' or 'cat'."
    ),
    ResponseSchema(
        name="recommended_products",
        description="A list of keywords for recommended product types based on the pet’s dietary needs (e.g., game meat, dairy, insects)."
    ),
    ResponseSchema(
        name="pet_summary",
        description="A short paragraph explaining the pet breed's origin, personality, and dietary needs."
    ),
    ResponseSchema(
        name="care_tips",
        description="3-5 concise care tips specific to the pet breed, formatted as bullet points."
    ),
]

# Create parser from schema
parser = PydanticOutputParser(pydantic_object=PetAdviceOutput)

# Compose prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system",
     "You are Dr.AI – a friendly and knowledgeable veterinary nutritionist.\n"
     "Use clear, concise language suitable for pet owners with no veterinary background.\n"
     "Your job is to:\n"
     "1. Identify the breed or species of the pet\n"
     "2. Explain the breed’s history, temperament, common health concerns\n"
     "3. Provide macronutrient breakdown as approximate percentages (e.g., Protein: 35%, Fat: 25%, Carbs: 10%)\n"
     "4. Recommend 3 to 6 product **tags or categories** (e.g., 'joint support chews', 'low-fat treats', 'high-protein meals')\n"
     "5. Offer 3–5 clear care tips as a bullet list\n\n"
     "Use this known info:\n"
     "- Ferrets & cats: obligate carnivores – high protein/fat, low carbs\n"
     "- Hedgehogs & fennec foxes: insectivore/omnivore – tolerate insects, fruits, starch. Would still prefer insect and animal protien. Can tolerate carbohydrate but protein and fats is more preferred in most cases.\n"
     "- Sheepdogs and Livestock Guardian Dogs: bred for endurance and long working hours. Can tolerate higher carbohydrate and moderate fat intake. Prefer at least 25% protein but can function on slightly lower protein levels. Avoid excessively high fat. Tolerant of grains and soy due to their agricultural background."
     "- Huskies: high-protein, high-fat, low-carb. As a northern dogs breed, it originated from places where agriculture activity is limited and often dependent on animal fats and protein. More carnivorous than other dogs\n"
     "- Border Collies: herding breed originally used in agriculture – moderately active with high intelligence. Require a balanced diet with 25–30% protein, 10–15% fat, and tolerate higher carbohydrate content (30–45%) compared to sled dogs like Huskies.\n\n"
     "- Herbiovre: Rabbits, Guinea Pigs and pet herbivores will prefer a lot of fiber, some carbs and proteins. Fats should be minimal if non-active.\n\n"
     "{format_instructions}"
    ),
    ("human", "Query: {user_input}")
]).partial(format_instructions=parser.get_format_instructions())

# Chain execution
chain = prompt | llm | parser

# Safe execution function
def run_ai_agent(user_input):
    try:
        # Prepare formatted prompt
        formatted_prompt = prompt.invoke({"user_input": user_input})

        # Get raw LLM output
        raw_output = llm.invoke(formatted_prompt)
        print("\U0001F9FE Raw Output Before Parsing:\n", raw_output.content)

        # Parse response
        result = parser.invoke(raw_output)
        print("✅ Parsed Output:\n", result)
        return result

    except Exception as e:
        print("❌ LangChain Parsing Error:", str(e))

        if hasattr(e, "response"):
            print("\U0001F9FE Raw LLM Output from Error Object:\n", e.response)

        return {
            "error": "Failed to parse AI response.",
            "details": str(e)
        }