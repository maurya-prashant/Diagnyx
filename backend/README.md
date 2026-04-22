# 🧠 MEDIFY (Diagnyx)

## Multi-Agent Medical Report Interpretation System

MEDIFY is an AI-powered backend system that processes medical reports (PDF, DOCX, Images) and converts them into **structured, explainable, and actionable insights** using a **multi-agent architecture**.

Instead of relying on a single LLM response, MEDIFY uses **specialized agents (nodes)** that work sequentially and in parallel to ensure **accuracy, safety, and interpretability**.

---

# 🚀 Features

* 📄 Accepts PDF, DOCX, JPG, PNG medical reports
* 🧠 Multi-agent pipeline (LangGraph-based)
* 🔍 Structured data extraction
* 🗣️ Patient-friendly explanations
* 🧬 Root cause analysis
* 🥗 Diet recommendations
* ⚠️ Safety critic to validate outputs
* ⚡ Parallel execution for faster response

---

# 🏗️ Architecture Overview

```
Upload → Ingestion → Gate → Extraction
                         ↓
              ┌───────────────┐
              ↓               ↓
        Explanation      Root Cause
              ↓               ↓
                 Diet Recommendation
                         ↓
                      Critic
                         ↓
                    Synthesis
                         ↓
                      Output
```

---

# 📁 Project Structure

```
backend/
│
├── main.py                  # FastAPI entry point
│
├── graph/
│   ├── workflow.py         # LangGraph workflow definition
│   └── state.py            # Shared state across nodes
│
├── nodes/
│   ├── ingestion_node.py
│   ├── gate_node.py
│   ├── extraction_node.py
│   ├── explanation_node.py
│   ├── rootcause_node.py
│   ├── diet_node.py
│   ├── critic_node.py
│   └── synthesis_node.py
│
├── models/
│   ├── medical.py          # Pydantic schemas
│
├── services/
│   ├── document_ingestion.py  # PDF/DOCX/Image processing
│
├── uploads/               # Temporary file storage
│
├── .env                   # API keys
├── requirements.txt
└── README.md
```

---

# ⚙️ Installation

## 1. Clone repo

```bash
git clone https://github.com/your-username/medify.git
cd medify/backend
```

## 2. Create virtual environment

```bash
python -m venv venv
venv\Scripts\activate   # Windows
```

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

# 🔑 Environment Variables

Create `.env` file:

```env
GROQ_API_KEY=your_groq_key
```

(Optional for multi-model setup)

```env
GEMINI_API_KEY=your_gemini_key
TOGETHER_API_KEY=your_together_key
```

---

# ▶️ Run the Server

```bash
uvicorn main:app --reload
```

Open:

```
http://127.0.0.1:8000/docs
```

---

# 📤 API Usage

## Upload Medical Report

**POST** `/upload`

### Request:

* Form-data → file (PDF/DOCX/JPG/PNG)

### Response:

```json
{
  "status": "accepted",
  "report": { ...structured output... }
}
```

---

# 🧠 Core Concepts

## 1. State (graph/state.py)

Shared dictionary passed across all nodes:

```python
class MedifyState(TypedDict):
    file_path: str
    raw_text: str
    extraction_result: dict
    explanation_result: str
    rootcause_result: str
    diet_result: str
    critic_result: dict
    final_report: dict
```

---

## 2. Nodes (Agents)

Each node = **one responsibility + one LLM call**

### 🔹 ingestion_node

* Extracts text from PDF/DOCX/Image

### 🔹 gate_node

* Validates if document is a medical report

### 🔹 extraction_node

* Converts raw text → structured JSON

### 🔹 explanation_node

* Generates patient-friendly explanation

### 🔹 rootcause_node

* Finds possible medical causes

### 🔹 diet_node

* Suggests diet plan

### 🔹 critic_node

* Validates entire pipeline
* Detects hallucinations / unsafe advice

### 🔹 synthesis_node

* Combines everything into final output

---

## 3. Workflow (graph/workflow.py)

LangGraph-based execution:

* Sequential start (ingestion → gate → extraction)
* Parallel execution (explanation + rootcause + diet)
* Conditional routing (critic → revise or finalize)

---

# ⚡ Parallel Execution

To improve performance:

* Explanation, Root Cause, and Diet nodes run in parallel
* Reduces total response time significantly

---

# ⚠️ Error Handling

Handled cases:

* Invalid file type
* Non-medical document rejection
* JSON parsing errors
* API rate limits (retry logic recommended)

---

# 🔌 Supported File Types

* PDF
* DOCX
* JPG / PNG (OCR required)

---

# 🧪 Future Improvements

* 🔁 Retry + backoff for LLM calls
* 🤖 Multi-model routing (Groq + Gemini + Qwen)
* 🧠 Memory layer for patient history
* 📊 UI dashboard (React frontend)
* 🔐 HIPAA-compliant storage

---

# 💡 Design Principles

```
1 Node = 1 Responsibility = 1 LLM Call
```

* Modular
* Explainable
* Safe
* Scalable

---

# 🧑‍💻 Tech Stack

* FastAPI
* LangGraph
* LangChain
* Groq API
* Pydantic
* Python

---

# 📌 Notes

* This is a backend system (no frontend yet)
* Not a replacement for medical professionals
* Designed for educational and assistive purposes

---

# 👨‍💻 Author

Prashant Maurya

---

# ⭐ Contribute

Pull requests are welcome. For major changes, open an issue first.

---

# 📜 License

MIT License
