from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq()

models = client.models.list()

print("Available Groq models:\n")

for model in models.data:
    print(model.id)