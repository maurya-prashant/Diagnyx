# Diagnyx

Diagnyx is a full-stack medical report interpretation app. It pairs a
`React + Vite` frontend with a `FastAPI` backend that runs an agentic
`LangGraph` workflow over uploaded medical reports.

The app accepts a report file, extracts text, checks whether the file appears
to be medical, extracts structured clinical data, generates patient-friendly
explanations, proposes possible root causes, builds nutrition guidance, checks
the diet plan for safety issues, audits the output, and returns a synthesized
JSON report for the frontend to render.

> Medical disclaimer: Diagnyx is an assistive interpretation tool, not a
> diagnostic system. Do not use it as the sole basis for medical decisions,
> treatment, or emergency care. Outputs should be reviewed by a qualified
> healthcare professional.

## Repository Map

```text
Diagnyx/
|-- README.md
|-- backend/
|   |-- .env                         # local secrets, ignored by backend/.gitignore
|   |-- .gitignore
|   |-- main.py                      # FastAPI app and upload endpoint
|   |-- requirements.txt             # Python dependencies
|   |-- graph/
|   |   |-- state.py                 # LangGraph state shape
|   |   `-- workflow.py              # LangGraph node wiring and loop routing
|   |-- models/
|   |   |-- medical.py               # Pydantic clinical and critic models
|   |   `-- responses.py             # Pydantic response models
|   |-- nodes/
|   |   |-- ingestion_node.py         # active file text extraction node
|   |   |-- gate_node.py              # medical-report gate
|   |   |-- extraction_node.py        # structured extraction
|   |   |-- explanation_node.py       # patient-friendly explanation
|   |   |-- rootcause_node.py         # possible root causes
|   |   |-- diet_node.py              # diet guidance
|   |   |-- safety_node.py            # rule-based safety check
|   |   |-- critic_node.py            # LLM audit and revision feedback
|   |   `-- synthesis_node.py         # final report assembly
|   |-- services/
|   |   |-- document_ingestion.py     # alternate extraction helper using PyMuPDF
|   |   |-- llm_provider.py           # Groq LLM calls and structured JSON parsing
|   |   |-- safety_rules.py           # contraindication rules for diet safety
|   |   `-- utils.py                  # safe JSON parsing helper
|   `-- uploads/                     # local uploaded files, ignored by backend/.gitignore
`-- frontend/
    |-- index.html
    |-- package.json
    |-- package-lock.json
    |-- vite.config.js               # dev server and /api proxy
    `-- src/
        |-- main.jsx                 # React entry point
        |-- App.jsx                  # upload UI and results dashboard
        `-- styles.css               # app styling
```

## Tech Stack

### Frontend

- React 18
- Vite 5
- Plain CSS
- Browser `fetch` API for uploads

### Backend

- Python
- FastAPI
- Uvicorn
- LangGraph
- LangChain
- `langchain-groq`
- Pydantic
- `python-dotenv`
- `python-multipart`
- Pillow
- Tesseract OCR through `pytesseract`
- `python-docx`
- PyMuPDF through `fitz` in `services/document_ingestion.py`
- `pypdf` in the active `nodes/ingestion_node.py` PDF path

## Prerequisites

- Python 3.10+
- Node.js 18+
- A Groq API key
- Tesseract OCR installed locally if image uploads should be processed

The backend reads `GROQ_API_KEY` from `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

## Local Setup

### Backend

Run the backend from inside the `backend/` directory because imports are
written relative to that folder.

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend URLs:

- API root: `http://127.0.0.1:8000/`
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

Note: the current active PDF ingestion code imports `pypdf.PdfReader`, while
`requirements.txt` currently lists `pymupdf`. If `pypdf` is not already
available in your environment, install it or update the requirements before
processing PDFs through `nodes/ingestion_node.py`.

### Frontend

Run the frontend in a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

- App: `http://127.0.0.1:5173`

The Vite server proxies `/api/*` to `http://127.0.0.1:8000`. For example,
the frontend sends `POST /api/upload`, and Vite forwards it to
`POST http://127.0.0.1:8000/upload`.

## API Reference

### `GET /`

Returns a simple status payload:

```json
{
  "message": "MEDIFY LangGraph running"
}
```

### `POST /upload`

Uploads one report file using `multipart/form-data`.

Form field:

- `file`

Example:

```bash
curl -X POST "http://127.0.0.1:8000/upload" \
  -H "accept: application/json" \
  -F "file=@medical_report.pdf"
```

The backend saves the file into `backend/uploads/`, invokes the LangGraph
workflow, and returns one of the response shapes below.

Accepted response:

```json
{
  "status": "accepted",
  "report": {
    "patient_info": {},
    "lab_results": [
      {
        "test": "Glucose",
        "value": 140,
        "unit": "mg/dL",
        "status": "High"
      }
    ],
    "root_causes": "Possible causes and reasoning from the LLM",
    "diet": "Personalized nutrition guidance from the LLM",
    "summary": "Patient-friendly final summary",
    "takeaways": ["Key point 1", "Key point 2", "Key point 3"]
  }
}
```

Rejected response:

```json
{
  "status": "rejected",
  "reason": "Not a medical report"
}
```

Error response:

```json
{
  "status": "error",
  "message": "final_report missing",
  "debug": ["file_path", "raw_text"]
}
```

## Supported Upload Types

The active ingestion node supports:

- `.pdf`
- `.docx`
- `.png`
- `.jpg`
- `.jpeg`
- `.txt`

Extraction behavior:

- PDF: `pypdf.PdfReader`
- DOCX: `python-docx`
- PNG/JPG/JPEG: `pytesseract` OCR through Pillow
- TXT: UTF-8 text read

`services/document_ingestion.py` is an alternate helper that supports PDF,
DOCX, and image extraction with PyMuPDF/Pillow/Tesseract, but the current
LangGraph workflow uses `nodes/ingestion_node.py`.

## LangGraph Workflow

The workflow is defined in `backend/graph/workflow.py`.

```text
Upload
  |
  v
ingestion
  |
  v
gate ----------------------------> END if rejected
  |
  v
extract
 /     \
v       v
explain rootcause
   \     /
    v   v
     diet
      |
      v
    safety
      |
      v
    critic
   /      \
  v        v
diet     synthesis
 ^          |
 |          v
 +-- max 3 revisions, then END
```

Workflow behavior by node:

- `ingestion`: extracts raw text from the uploaded file.
- `gate`: asks the LLM whether the text is a medical report. It rejects only
  when the LLM returns exactly `NO`; otherwise it continues.
- `extract`: asks the LLM for structured `ExtractionResult` JSON containing
  lab results, medications, diagnoses, and an `is_structured` flag.
- `explain`: turns extracted data into patient-friendly language.
- `rootcause`: lists possible medical root causes and reasoning.
- `diet`: builds a personalized diet plan from abnormal labs, root causes, and
  any critic feedback.
- `safety`: applies local contraindication rules to catch unsafe diet items for
  high lab values.
- `critic`: asks an LLM auditor to find contradictions, missed abnormal values,
  and generic diet guidance.
- `synthesis`: builds the final JSON report returned to the API caller.

The critic can route back to `diet` when `needs_revision` is true. The loop is
limited to three revision attempts before synthesis.

## Backend Data Models

`backend/models/medical.py` defines:

- `LabResult`: test, numeric value, unit, and status.
- `Medication`: name, dose, and frequency.
- `GateResult`: result, confidence, and reason.
- `ExtractionResult`: lab results, medications, diagnoses, and structure flag.
- `CriticResult`: issues, severity, and revision flag.

`backend/graph/state.py` defines the shared `MedifyState` keys used across
the LangGraph nodes, including raw text, rejection details, extraction output,
root-cause text, diet text, critic feedback, revision count, and final report.

## LLM Provider

LLM calls are centralized in `backend/services/llm_provider.py`.

Current fallback order:

1. `llama-3.3-70b-versatile`
2. `llama-3.1-8b-instant`
3. `gemma2-9b-it`

`call_llm(prompt)` returns text from the first working Groq model.
`call_llm_structured(prompt, model_class)` asks for JSON matching a Pydantic
schema, strips Markdown fences if present, parses JSON, and falls back to an
empty model instance when parsing or validation fails.

## Safety Rules

`backend/services/safety_rules.py` contains local contraindication checks for
high lab values. Current high-value food checks include:

- Potassium: banana, spinach, potato, tomato, avocado
- Glucose: sugar, white bread, honey, soda, cake, candy
- Sodium: salt, processed meat, canned soup, pickles
- Cholesterol: fried food, butter, red meat, trans fat
- Creatinine: high protein, excessive salt

If the generated diet plan includes a forbidden item for a matching high lab
value, `safety_node` sets critic feedback and requests a revision.

## Frontend Behavior

`frontend/src/App.jsx` implements the full UI:

- File picker/dropzone for PDF, DOCX, PNG, JPG, JPEG, and TXT files.
- Upload and analysis status states: idle, uploading, analyzing, success, and
  error.
- POST upload to `/api/upload`.
- Rejected document card.
- Accepted report dashboard with:
  - clinical lab table
  - patient-friendly summary
  - key takeaways
  - root-cause insight cards
  - nutrition guidance grouped into avoid, recommended, and clinical notes

`frontend/src/styles.css` contains all visual styling, responsive layout, table
styling, report cards, status pills, error states, and upload states.

## Local Files And Generated Data

- `backend/.env` is for local secrets and is ignored by `backend/.gitignore`.
- `backend/uploads/` stores uploaded files and is ignored by
  `backend/.gitignore`.
- `backend/venv/`, `backend/__pycache__/`, and Python bytecode are ignored by
  `backend/.gitignore`.
- `frontend/node_modules/` is not part of the source tree and should be
  recreated with `npm install`.

Uploaded files are saved locally and are not cleaned up automatically.

## Known Limitations

- The app is not a medical device and does not replace professional review.
- The upload endpoint saves files before validation.
- There is no authentication, persistence layer, rate limiting, file cleanup,
  or user/session model.
- The gate only rejects when the LLM response is exactly `NO`; ambiguous
  responses continue through the workflow.
- `diet_node` assumes `extraction_result` exists and has `lab_results`.
- LLM outputs are prompt-dependent; structured parsing falls back to empty data
  if JSON parsing fails.
- `synthesis_node` falls back to `"Analysis complete."` if summary JSON parsing
  fails.
- No automated test suite is currently present.
- Some UI text currently contains mojibake-style characters from encoded icon
  strings in `frontend/src/App.jsx`.

## Useful Commands

Backend:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload
```

Frontend:

```powershell
cd frontend
npm run dev
npm run build
npm run preview
```

Repo inspection:

```powershell
rg --files -g '!node_modules' -g '!venv' -g '!__pycache__'
```
