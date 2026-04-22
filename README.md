# Diagnyx

Diagnyx is a full-stack medical report interpretation project with:

- a `FastAPI` backend that accepts uploaded reports and runs a multi-step `LangGraph` workflow
- a `React + Vite` frontend for uploading files and viewing the structured result

The current flow extracts text from a report, checks whether it looks medical, generates explanations and possible root causes with an LLM, adds diet guidance, and returns a synthesized JSON response.

## What Is In This Repo

```text
Diagnyx/
+-- README.md
+-- backend/
|   +-- main.py
|   +-- requirements.txt
|   +-- graph/
|   +-- nodes/
|   +-- models/
|   +-- services/
|   `-- uploads/
`-- frontend/
    +-- package.json
    +-- vite.config.js
    `-- src/
```

## Architecture

### Frontend

- Built with `React 18` and `Vite`
- Runs on `http://127.0.0.1:5173`
- Uploads files to `/api/upload`
- Uses the Vite dev proxy to forward `/api/*` to the FastAPI server on port `8000`

### Backend

- Built with `FastAPI`
- Runs on `http://127.0.0.1:8000`
- Exposes:
  - `GET /`
  - `POST /upload`
- Stores uploaded files in `backend/uploads/`

### Workflow

The backend workflow is wired in [backend/graph/workflow.py](/d:/projects/medify/Diagnyx/backend/graph/workflow.py:1).

```text
Upload
  |
  v
Ingestion
  |
  v
Gate --------------------> END (if rejected)
  |
  v
Extract
 /    \
v      v
Explain Rootcause
   \    /
    \  /
    Diet
     |
     v
   Critic
     |
     v
 Synthesis
     |
     v
    END
```

## Supported Input Types

The active ingestion node in [backend/nodes/ingestion_node.py](/d:/projects/medify/Diagnyx/backend/nodes/ingestion_node.py:1) supports:

- `.pdf`
- `.docx`
- `.png`
- `.jpg`
- `.jpeg`
- `.txt`

Processing method:

- `PDF`: text extraction via `pypdf`
- `DOCX`: paragraph extraction via `python-docx`
- `PNG/JPG/JPEG`: OCR via `pytesseract`
- `TXT`: UTF-8 text read

## Tech Stack

### Frontend

- React
- Vite

### Backend

- Python
- FastAPI
- Uvicorn
- LangGraph
- LangChain
- `langchain-groq`
- Pydantic
- `python-dotenv`
- `pytesseract`
- Pillow
- `python-docx`
- `pypdf`

## Prerequisites

Before running locally, make sure you have:

- Python `3.10+`
- Node.js `18+` recommended
- a valid `GROQ_API_KEY`
- Tesseract OCR installed if you want OCR for image uploads

## Local Setup

### 1. Backend setup

From the repo root:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the API:

```powershell
uvicorn main:app --reload
```

Backend URLs:

- API root: `http://127.0.0.1:8000/`
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### 2. Frontend setup

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

- App: `http://127.0.0.1:5173`

## How The Frontend Connects To The Backend

The Vite config in [frontend/vite.config.js](/d:/projects/medify/Diagnyx/frontend/vite.config.js:1) proxies `/api` requests to the backend:

- frontend request: `POST /api/upload`
- proxied backend request: `POST http://127.0.0.1:8000/upload`

This means the backend should be running before you try uploads from the frontend.

## API Reference

### `GET /`

Returns a simple status payload:

```json
{
  "message": "MEDIFY LangGraph running"
}
```

### `POST /upload`

Uploads a report file using `multipart/form-data`.

Field name:

- `file`

Example:

```bash
curl -X POST "http://127.0.0.1:8000/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@medical_report.pdf"
```

### Accepted response

```json
{
  "status": "accepted",
  "report": {
    "patient_info": {
      "name": "",
      "age": "",
      "gender": ""
    },
    "symptoms": [],
    "lab_results": {},
    "root_causes": [],
    "diet": [],
    "summary": ""
  }
}
```

### Rejected response

```json
{
  "status": "rejected",
  "reason": "Not a medical report"
}
```

### Error response

```json
{
  "status": "error",
  "message": "final_report missing",
  "debug": []
}
```

## LLM Model Fallback

The backend LLM calls are centralized in [backend/services/llm_provider.py](/d:/projects/medify/Diagnyx/backend/services/llm_provider.py:1).

Current fallback order:

1. `llama-3.3-70b-versatile`
2. `mixtral-8x7b-32768`
3. `llama-3.1-8b-instant`
4. `llama-3.2-3b-preview`
5. `gemma2-9b-it`

If one model fails, the backend waits briefly and tries the next one.

## Important Notes

- The root README used to describe this repo as backend-only. That is no longer true; this repo now includes a working frontend.
- The backend expects to be started from inside the `backend/` directory because imports are written that way.
- Uploaded files are stored locally in `backend/uploads/` and are not cleaned up automatically.
- The frontend currently supports selection of `PDF`, `DOCX`, `PNG`, `JPG`, `JPEG`, and `TXT`.
- `frontend/node_modules/` and `backend/venv/` are currently present in the repo, which is usually not recommended for source control.

## Known Limitations

- The gate logic only rejects when the LLM response is exactly `"no"`, so non-medical files may still be accepted.
- The upload endpoint saves the file before deeper validation.
- The workflow depends heavily on prompt-following and does not fully validate intermediate outputs.
- The critic node does not currently trigger a revision loop.
- OCR quality depends on the installed Tesseract binary and source image quality.
- There is no authentication, persistence layer, rate limiting, or automated cleanup.
- No automated test suite was found at the repo root.

## Medical Disclaimer

This project is an assistive interpretation tool, not a diagnostic system.

Do not use it as the sole basis for medical decisions, treatment, or emergency care. Any output should be reviewed by a qualified healthcare professional.
