import os
import time
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

MODELS = [
    "llama-3.3-70b-versatile",   # primary
    "mixtral-8x7b-32768",        # backup 1
    "llama-3.1-8b-instant",      # backup 2
    "llama-3.2-3b-preview",      # backup 3
    "gemma2-9b-it"               # backup 4
]

def call_llm(prompt: str) -> str:
    for model in MODELS:
        try:
            llm = ChatGroq(
                model=model,
                api_key=os.getenv("GROQ_API_KEY")
            )

            res = llm.invoke(prompt)
            print(f"Used model: {model}")
            return res.content

        except Exception as e:
            print(f"Model {model} failed:", e)
            time.sleep(1)

    return "Error: All models failed"