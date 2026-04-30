
import os
import time
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from pydantic import ValidationError

load_dotenv()

MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it"]

def call_llm(prompt: str) -> str:
    # ... (keep your existing call_llm code here) ...
    for model in MODELS:
        try:
            llm = ChatGroq(model=model, api_key=os.getenv("GROQ_API_KEY"))
            res = llm.invoke(prompt)
            return res.content
        except Exception as e:
            print(f"Model {model} failed: {e}")
    return "Error: All models failed"

def call_llm_structured(prompt: str, model_class):
    """
    Forces the LLM to return JSON and parses it into the provided Pydantic model.
    """
    # We add a system instruction to force JSON
    structured_prompt = f"""
    {prompt}
    
    IMPORTANT: Return ONLY a valid JSON object that matches this schema:
    {model_class.schema_json()}
    Do not include markdown fences (```json). Just the raw JSON.
    """
    
    raw_res = call_llm(structured_prompt)
    
    # Clean potential markdown fences
    cleaned = raw_res.replace("```json", "").replace("```", "").strip()
    
    try:
        data = json.loads(cleaned)
        return model_class(**data) # Validate with Pydantic
    except (json.JSONDecodeError, ValidationError) as e:
        print(f"Structured Parsing Error: {e}")
        # Return an empty instance of the model as a fallback
        return model_class()