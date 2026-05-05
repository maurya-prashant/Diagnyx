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

---

## Repository Map

```text
Diagnyx/
|-- README.md
|-- backend/
|   |-- .env                          # local secrets, ignored by backend/.gitignore
|   |-- .gitignore
|   |-- main.py                       # FastAPI app, CORS config, and upload endpoint
|   |-- requirements.txt              # Python dependencies (pinned)
|   |-- graph/
|   |   |-- state.py                  # LangGraph MedifyState (file_bytes / file_name based)
|   |   `-- workflow.py               # LangGraph node wiring and critic loop routing
|   |-- models/
|   |   |-- medical.py                # Pydantic clinical and critic models
|   |   `-- responses.py              # Pydantic response models (RejectedResponse, AcceptedResponse)
|   |-- nodes/
|   |   |-- ingestion_node.py         # In-memory text extraction (no disk writes)
|   |   |-- gate_node.py              # Medical-report gate (LLM YES/NO)
|   |   |-- extraction_node.py        # Structured clinical data extraction
|   |   |-- explanation_node.py       # Patient-friendly explanation
|   |   |-- rootcause_node.py         # Possible root causes
|   |   |-- diet_node.py              # Diet guidance with critic-feedback loop
|   |   |-- safety_node.py            # Rule-based contraindication safety check
|   |   |-- critic_node.py            # LLM audit and revision feedback
|   |   `-- synthesis_node.py         # Final report assembly
|   |-- services/
|   |   |-- document_ingestion.py     # Alternate file-path-based extraction helper (PyMuPDF)
|   |   |-- llm_provider.py           # Groq LLM calls and structured JSON parsing
|   |   |-- safety_rules.py           # Contraindication rules for diet safety
|   |   `-- utils.py                  # Safe JSON parsing helper
|   `-- uploads/                      # Unused — ingestion is now in-memory
`-- frontend/
    |-- index.html
    |-- package.json
    |-- package-lock.json
    |-- eslint.config.js
    |-- vite.config.js                # Dev server, /api proxy, Tailwind CSS v4 plugin
    |-- .env.production               # Production env vars (e.g. VITE_API_URL)
    `-- src/
        |-- main.jsx                  # React entry point
        |-- App.jsx                   # Router — maps "/" to Landing
        |-- App.css
        |-- index.css
        |-- assets/
        |   |-- hero.png
        |   |-- react.svg
        |   `-- vite.svg
        |-- components/
        |   |-- Navbar.jsx            # Fixed top nav with mobile menu and "Get Started" CTA
        |   |-- Hero.jsx              # Landing hero section
        |   |-- Features.jsx          # Feature highlights section
        |   |-- HowItWorks.jsx        # Step-by-step explainer section
        |   |-- UseCases.jsx          # Use-case cards section
        |   |-- TechStack.jsx         # Tech stack display section
        |   |-- Testimonials.jsx      # Testimonials section
        |   |-- Footer.jsx            # Site footer
        |   `-- UploadModal.jsx       # Modal overlay: file upload + full results dashboard
        `-- pages/
            |-- Landing.jsx           # Landing page — composes all sections + UploadModal
            `-- UploadApp.jsx         # Standalone full-page upload + results view
```

---

## Tech Stack

### Frontend

- React 19
- Vite 8
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- React Router DOM v7
- Browser `fetch` API for uploads

### Backend

- Python 3.10+
- FastAPI with CORS middleware
- Uvicorn
- LangGraph
- LangChain + `langchain-groq`
- Pydantic v2
- `python-dotenv`
- `python-multipart`
- Pillow + `pytesseract` (image OCR)
- `python-docx` (DOCX extraction)
- `pypdf` (PDF extraction in active ingestion node)
- PyMuPDF / `fitz` (alternate extraction helper only)
- Groq SDK

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- A Groq API key
- Tesseract OCR installed locally (required for image uploads)

The backend reads `GROQ_API_KEY` from `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

---

## Local Setup

### Backend

Run from inside the `backend/` directory — imports are relative to that folder.

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

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL: `http://127.0.0.1:5173`

The Vite dev server proxies `/api/*` to `http://127.0.0.1:8000`. For example,
the frontend sends `POST /api/upload` and Vite forwards it to
`POST http://127.0.0.1:8000/upload`.

For production builds, set `VITE_API_URL` in `frontend/.env.production` to
point at the deployed backend. The `UploadModal` reads this variable at
runtime: `import.meta.env.VITE_API_URL ?? ''`.

---

## API Reference

### `GET /`

```json
{ "message": "Diagynx API running" }
```

### `POST /upload`

Uploads one report file using `multipart/form-data`.

Form field: `file`

Example:

```bash
curl -X POST "http://127.0.0.1:8000/upload" \
  -H "accept: application/json" \
  -F "file=@medical_report.pdf"
```

The backend reads the file entirely into memory (no disk write), invokes the
LangGraph workflow, and returns one of the shapes below.

Accepted:

```json
{
  "status": "accepted",
  "report": {
    "patient_info": {},
    "lab_results": [{ "test": "Glucose", "value": 140, "unit": "mg/dL", "status": "High" }],
    "root_causes": "...",
    "diet": "...",
    "summary": "...",
    "takeaways": ["Key point 1", "Key point 2", "Key point 3"]
  }
}
```

Rejected:

```json
{ "status": "rejected", "reason": "Not a medical report" }
```

Error:

```json
{ "status": "error", "message": "final_report missing", "debug": ["file_bytes", "file_name"] }
```

---

## Supported Upload Types

- `.pdf` — `pypdf.PdfReader` via `io.BytesIO`
- `.docx` — `python-docx` via `io.BytesIO`
- `.png` / `.jpg` / `.jpeg` — `pytesseract` OCR via Pillow
- `.txt` — UTF-8 decode

Files are processed entirely in memory. The `uploads/` directory exists but is
no longer written to by the active workflow.

`services/document_ingestion.py` is an alternate helper that uses PyMuPDF and
reads from a file path. It is not used by the active LangGraph workflow.

---

## LangGraph Workflow

Defined in `backend/graph/workflow.py`.

```text
Upload (file_bytes + file_name in state)
  |
  v
ingestion
  |
  v
gate ──────────────────────────────> END  (if rejected)
  |
  v
extract
 /     \
v       v
explain  rootcause
   \     /
    v   v
     diet  <──────────────────────────┐
      |                               |
      v                               │ needs_revision && revision_count < 3
    safety                            │
      |                               │
      v                               │
    critic ────────────────────────────┘
      |
      v (needs_revision == false OR revision_count >= 3)
    synthesis
      |
      v
     END
```

Node behavior:

- `ingestion` — extracts raw text from `file_bytes` / `file_name` in state; no disk I/O.
- `gate` — asks the LLM whether the text is a medical report; rejects only on exact `NO`.
- `extract` — returns a structured `ExtractionResult` (lab results, medications, diagnoses, `is_structured` flag).
- `explain` — turns extracted data into patient-friendly language.
- `rootcause` — lists possible medical root causes with reasoning.
- `diet` — builds a personalized diet plan from abnormal labs, root causes, and any critic feedback.
- `safety` — applies local contraindication rules; sets `needs_revision` and `critic_feedback` on violations.
- `critic` — LLM auditor checks for contradictions, missed abnormal values, and generic diet guidance; increments `revision_count`.
- `synthesis` — assembles the final JSON report returned to the API caller.

The critic loop is capped at 3 revision attempts before forcing synthesis.

---

## Backend Data Models

`backend/models/medical.py`:

- `LabResult` — test, value, unit, status
- `Medication` — name, dose, frequency
- `GateResult` — result, confidence, reason
- `ExtractionResult` — lab_results, medications, diagnosis, is_structured
- `CriticResult` — issues_found, severity, needs_revision

`backend/graph/state.py` — `MedifyState` keys:

| Key | Type | Description |
|---|---|---|
| `file_bytes` | `bytes` | Raw uploaded file content |
| `file_name` | `str` | Original filename (used to detect extension) |
| `raw_text` | `str` | Extracted text from ingestion node |
| `rejected` | `bool` | Set by gate node |
| `rejection_reason` | `str` | Human-readable rejection message |
| `extraction_result` | `ExtractionResult` | Structured clinical data |
| `explanation_result` | `str` | Patient-friendly explanation |
| `rootcause_result` | `str` | Root cause analysis text |
| `diet_result` | `str` | Diet guidance text |
| `critic_result` | `CriticResult` or `dict` | Audit result |
| `critic_feedback` | `str` | Feedback passed back to diet node |
| `revision_count` | `int` | Number of diet revision attempts |
| `final_report` | `dict` | Assembled report returned to API |

`backend/models/responses.py`:

- `RejectedResponse` — status, stage, message
- `AcceptedResponse` — status, filename, gate, structured_data

---

## LLM Provider

Centralized in `backend/services/llm_provider.py`.

Fallback model order:

1. `llama-3.3-70b-versatile`
2. `llama-3.1-8b-instant`
3. `gemma2-9b-it`

- `call_llm(prompt)` — returns text from the first working Groq model.
- `call_llm_structured(prompt, model_class)` — requests JSON matching a Pydantic schema, strips Markdown fences, parses, and falls back to an empty model instance on failure.

---

## Safety Rules

`backend/services/safety_rules.py` — local contraindication checks for high lab values:

| Lab | Forbidden foods |
|---|---|
| Potassium | banana, spinach, potato, tomato, avocado |
| Glucose | sugar, white bread, honey, soda, cake, candy |
| Sodium | salt, processed meat, canned soup, pickles |
| Cholesterol | fried food, butter, red meat, trans fat |
| Creatinine | high protein, excessive salt |

If the diet plan contains a forbidden item for a matching high lab value,
`safety_node` sets `critic_feedback` and `needs_revision: true`, triggering a
revision loop.

---

## Frontend Behavior

### Routing (`App.jsx`)

React Router maps `/` to `Landing`. The standalone `UploadApp` page exists at
`src/pages/UploadApp.jsx` but is not currently wired into the router.

### Landing page (`pages/Landing.jsx`)

Composes: `Navbar`, `Hero`, `Features`, `HowItWorks`, `UseCases`, `TechStack`,
`Testimonials`, `Footer`, and `UploadModal`.

Clicking "Get Started" in the Navbar opens the `UploadModal` overlay.

### UploadModal (`components/UploadModal.jsx`)

The primary user-facing upload and results component. Features:

- Drag-and-drop or click-to-browse file picker (PDF, DOCX, PNG, JPG, JPEG, TXT)
- Escape key and backdrop click to close
- Body scroll lock while open
- Upload phases: `idle` → `analyzing` → `done` / `rejected` / `error`
- POST to `/api/upload` (uses `VITE_API_URL` env var in production)
- Results dashboard: summary, key takeaways, lab results table with color-coded
  status badges, root cause analysis, nutrition guidance
- "New Report" button to reset state

### UploadApp (`pages/UploadApp.jsx`)

A standalone full-page version of the upload + results UI. Shares the same
logic and layout as `UploadModal` but renders as a full page with a top `Navbar`.

---

## Environment Variables

### Backend (`backend/.env`)

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (`frontend/.env.production`)

```env
VITE_API_URL=https://your-backend-url.com
```

Leave `VITE_API_URL` unset (or empty) for local development — the Vite proxy
handles `/api/*` routing automatically.

---

## Data Privacy & Storage

Diagnyx does **not** persist any uploaded files or analysis results.

- Uploaded files are read entirely into memory and discarded after the workflow completes. Nothing is written to disk.
- Analysis results (lab values, summaries, diet plans) exist only in the server's memory for the duration of a single request. They are never saved to a database or file.
- Every time the backend server restarts, all in-flight state is lost. There is no way to retrieve a previous report.
- The `backend/uploads/` directory exists in the repository but is not written to by the active workflow.

> If you close the browser tab or refresh the page, your results are gone. Download or copy anything you need before navigating away.

---

## Known Limitations

- No authentication, rate limiting, session model, or persistence layer.
- The gate rejects only on exact `NO`; ambiguous LLM responses continue through the workflow.
- `diet_node` assumes `extraction_result` exists and has `lab_results`.
- LLM outputs are prompt-dependent; structured parsing falls back to empty data on failure.
- `synthesis_node` falls back to `"Analysis complete."` if summary JSON parsing fails.
- `services/document_ingestion.py` uses file paths and is not integrated into the active workflow.
- No automated test suite.
- `UploadApp` page is not currently registered in the React Router config.

---

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
