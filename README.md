# Diagnyx

Diagnyx is a FastAPI-based backend for interpreting medical reports with a multi-step LangGraph workflow. It accepts uploaded reports, extracts text from supported document formats, routes the content through a set of focused LLM-powered nodes, and returns a structured summary with explanations, possible root causes, diet guidance, and a synthesized final report.

This repository currently contains the backend implementation only.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Workflow Architecture](#workflow-architecture)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Reference](#api-reference)
- [Request and Response Examples](#request-and-response-examples)
- [Supported File Types](#supported-file-types)
- [LLM Model Strategy](#llm-model-strategy)
- [State Shape](#state-shape)
- [Implementation Notes](#implementation-notes)
- [Known Limitations](#known-limitations)
- [Troubleshooting](#troubleshooting)
- [Security and Medical Disclaimer](#security-and-medical-disclaimer)
- [Roadmap Ideas](#roadmap-ideas)

## Overview

The backend is designed around a graph-driven processing pipeline:

1. A medical report is uploaded through the API.
2. Text is extracted from the document.
3. The system checks whether the document appears to be a medical report.
4. Medical information is extracted from the text.
5. Explanation and root-cause analysis are generated.
6. Diet suggestions are generated after those analysis steps.
7. A critic node reviews the output.
8. A synthesis node produces the final JSON report returned by the API.

The main goal is to break report interpretation into smaller responsibilities instead of relying on a single prompt.

## Key Features

- FastAPI backend with interactive Swagger docs.
- LangGraph workflow for staged report analysis.
- Upload support for `PDF`, `DOCX`, `PNG`, `JPG`, `JPEG`, and plain text input at the ingestion layer.
- OCR support for image-based reports using `pytesseract`.
- Groq-backed LLM execution with fallback model rotation.
- Rejection path for non-medical documents.
- Final structured JSON report for downstream use.
- Local upload storage for processed files.

## How It Works

At runtime, the backend starts in [`backend/main.py`](backend/main.py). The `/upload` endpoint stores the uploaded file in a local `uploads` directory, initializes the graph state with the saved `file_path`, and invokes the compiled LangGraph workflow from [`backend/graph/workflow.py`](backend/graph/workflow.py).

The workflow passes a shared state object through several nodes:

- `ingestion`: reads text from the uploaded file.
- `gate`: checks whether the content looks like a medical report.
- `extract`: asks the LLM to pull out medical information.
- `explain`: rewrites the extracted data in simpler language.
- `rootcause`: proposes possible conditions tied to abnormal values.
- `diet`: generates condition-specific diet suggestions.
- `critic`: checks for issues and whether revision may be needed.
- `synthesis`: returns the final normalized JSON response.

## Workflow Architecture

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
Extraction
  | \
  |  \
  v   v
Explain  Rootcause
   \      /
    \    /
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

### Actual Execution Behavior

- `ingestion -> gate -> extract` runs sequentially.
- `explain` and `rootcause` fan out from `extract`.
- `diet` waits for both `explain` and `rootcause`.
- `critic` runs after `diet`.
- `synthesis` runs last and creates the API response payload.

## Project Structure

```text
Diagnyx/
+-- README.md
+-- check.py
`-- backend/
    +-- main.py
    +-- requirements.txt
    +-- README.md
    +-- graph/
    |   +-- state.py
    |   `-- workflow.py
    +-- models/
    |   +-- medical.py
    |   `-- responses.py
    +-- nodes/
    |   +-- critic_node.py
    |   +-- diet_node.py
    |   +-- explanation_node.py
    |   +-- extraction_node.py
    |   +-- gate_node.py
    |   +-- ingestion_node.py
    |   +-- rootcause_node.py
    |   `-- synthesis_node.py
    +-- services/
    |   +-- document_ingestion.py
    |   +-- llm_provider.py
    |   `-- utils.py
    +-- uploads/
    `-- venv/
```

### Important Directories and Files

- `backend/main.py`: FastAPI app and HTTP endpoints.
- `backend/graph/workflow.py`: graph wiring and execution order.
- `backend/graph/state.py`: shared state definition.
- `backend/nodes/`: each node handles one part of the pipeline.
- `backend/services/llm_provider.py`: Groq model invocation and fallback logic.
- `backend/services/document_ingestion.py`: alternate document ingestion helpers.
- `backend/models/`: Pydantic models for medical and response schemas.
- `backend/uploads/`: local uploaded files used during processing.
- `check.py`: small standalone Gemini model listing utility.

## Tech Stack

- Python
- FastAPI
- Uvicorn
- LangGraph
- LangChain
- Groq via `langchain-groq`
- Pydantic
- PyMuPDF / `pypdf`
- `python-docx`
- Pillow
- `pytesseract`
- `python-dotenv`

## Prerequisites

Before running the backend, make sure you have:

- Python 3.10+ installed
- A valid `GROQ_API_KEY`
- Tesseract OCR installed on your machine if you want image OCR support

### Windows Tesseract Note

`pytesseract` is a Python wrapper. It still requires the Tesseract OCR binary to be installed separately on the system and available in your `PATH`, or configured explicitly in code.

## Installation

### 1. Clone or open the repository

```bash
git clone <your-repo-url>
cd Diagnyx
```

### 2. Move into the backend directory

The current code is meant to be run from `backend`, because imports and relative paths are written with that assumption.

```bash
cd backend
```

### 3. Create a virtual environment

Windows:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file inside `backend/`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Currently Used

- `GROQ_API_KEY`: required by `backend/services/llm_provider.py`

### Mentioned but Not Used by the Main Backend

The older `backend/README.md` mentions additional providers such as Gemini and Together, but the active backend code currently uses Groq only for the main workflow.

## Running the Project

From the `backend/` directory:

```bash
uvicorn main:app --reload
```

The API will be available at:

- App root: `http://127.0.0.1:8000/`
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## API Reference

### `GET /`

Simple health-style endpoint.

#### Response

```json
{
  "message": "MEDIFY LangGraph running"
}
```

### `POST /upload`

Uploads a medical report and runs it through the full LangGraph pipeline.

#### Request

- Content type: `multipart/form-data`
- Field name: `file`

#### Behavior

- Saves the uploaded file to a local `uploads` directory.
- Starts graph execution with:

```json
{
  "file_path": "uploads/<filename>"
}
```

- Returns a rejected response if the gate node flags the document as non-medical.
- Returns an accepted response containing the synthesized final report if the workflow completes successfully.

## Request and Response Examples

### Example cURL Request

```bash
curl -X POST "http://127.0.0.1:8000/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@medical_report.pdf"
```

### Rejected Response Example

```json
{
  "status": "rejected",
  "reason": "Not a medical report"
}
```

### Accepted Response Example

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
    "summary": "..."
  }
}
```

### Error Response Example

If the graph completes without a `final_report`, the current backend returns:

```json
{
  "status": "error",
  "message": "final_report missing",
  "debug": ["...graph keys..."]
}
```

## Supported File Types

The codebase currently supports these formats during ingestion:

- `.pdf`
- `.docx`
- `.png`
- `.jpg`
- `.jpeg`
- `.txt`

### How Each Type Is Processed

- `PDF`: extracted with `pypdf.PdfReader` in the active ingestion node.
- `DOCX`: extracted with `python-docx`.
- `PNG/JPG/JPEG`: processed with Pillow and OCR via `pytesseract`.
- `TXT`: read as UTF-8 text.

## LLM Model Strategy

LLM calls are centralized in [`backend/services/llm_provider.py`](backend/services/llm_provider.py). The backend attempts each model in order until one succeeds:

1. `llama-3.3-70b-versatile`
2. `mixtral-8x7b-32768`
3. `llama-3.1-8b-instant`
4. `llama-3.2-3b-preview`
5. `gemma2-9b-it`

If a model fails, the code logs the failure, waits briefly, and tries the next model.

## State Shape

The shared LangGraph state is defined in [`backend/graph/state.py`](backend/graph/state.py):

```python
class MedifyState(TypedDict, total=False):
    file_path: str
    raw_text: str
    rejected: bool
    rejection_reason: str
    gate_result: dict
    extraction_result: dict
    explanation_result: dict
    rootcause_result: dict
    diet_result: dict
    critic_result: dict
    final_report: dict
```

### Field Meanings

- `file_path`: saved upload path.
- `raw_text`: extracted text from the report.
- `rejected`: whether the gate rejected the file.
- `rejection_reason`: message describing rejection.
- `extraction_result`: extracted report data from the LLM.
- `explanation_result`: simplified explanation output.
- `rootcause_result`: possible condition analysis.
- `diet_result`: diet recommendations.
- `critic_result`: critic assessment payload.
- `final_report`: normalized response returned to the API client.

## Implementation Notes

These details are worth knowing when working on or extending the project:

### 1. The backend is currently the whole product

There is no frontend app in this repository yet.

### 2. Run from `backend/`

The current import style such as `from graph.workflow import medify_graph` assumes the Python process starts inside `backend/`.

### 3. Ingestion logic exists in two places

- `backend/nodes/ingestion_node.py` contains the active graph node.
- `backend/services/document_ingestion.py` contains a second document-processing implementation that is not currently wired into the graph.

### 4. The graph uses a mix of sequential and parallel edges

The current graph only fans out from extraction into two parallel branches: `explain` and `rootcause`. `diet` is downstream from both, so it does not run in parallel with them.

### 5. The final API response is synthesized JSON

Intermediate node results are mostly raw LLM strings. The last node attempts to normalize them into a fixed JSON structure.

### 6. Upload storage is local

Uploaded files are written to `uploads/` on disk and are not automatically cleaned up by the API.

### 7. There is no test suite in the current repository

No automated tests were found for the backend flow.

## Known Limitations

This README aims to describe the project honestly as it exists today.

- The `/upload` endpoint does not validate file extensions before saving.
- The gate node returns accepted output for most cases unless the LLM answer is exactly `"no"`.
- The extraction, explanation, root-cause, and diet nodes rely on prompt-following and return mostly unvalidated LLM text.
- `extraction_result` is typed as a `dict` in the graph state, but the current node stores raw string output.
- The critic node can mark `needs_revision`, but there is no revision loop implemented in the workflow.
- OCR support depends on a working Tesseract installation on the host machine.
- Uploaded files are stored locally with no cleanup policy.
- There is no authentication, authorization, rate limiting, or persistence layer.
- The project contains a checked-in virtual environment, which is usually not recommended for Git repositories.
- `check.py` contains a direct Gemini client example and should not be treated as part of the production API flow.
- The backend is not production hardened for regulated medical use.

## Troubleshooting

### `ModuleNotFoundError` when starting Uvicorn

Make sure you are running the app from the `backend/` directory:

```bash
cd backend
uvicorn main:app --reload
```

### OCR does not work

Check that:

- Tesseract OCR is installed
- the `tesseract` executable is available in your system `PATH`
- the uploaded file is a supported image type

### LLM calls fail

Check that:

- `.env` exists in `backend/`
- `GROQ_API_KEY` is set correctly
- outbound network access is available from the runtime environment

### Empty or weak extraction results

This can happen when:

- the source PDF has poor text extraction quality
- the image OCR is noisy
- the prompt output is not valid JSON
- the selected fallback model returns lower-quality output

## Security and Medical Disclaimer

This project is an assistive AI backend for medical-report interpretation experiments. It is not a substitute for clinical judgment, medical diagnosis, treatment planning, or emergency care.

Do not use this system as the sole basis for medical decisions. Any output should be reviewed by a qualified healthcare professional.

If you plan to move this project toward real-world deployment, you should add:

- secure secret management
- audit logging
- file retention controls
- access control
- model output validation
- stronger prompt safety constraints
- human review workflows
- compliance review for healthcare data handling

## Roadmap Ideas

Possible next improvements based on the current codebase:

- add strong schema validation for all node outputs
- implement a real critic-driven revision loop
- add tests for ingestion, graph execution, and API responses
- add file type validation and upload cleanup
- support more robust OCR and scanned PDF handling
- add async/background job processing for large files
- add a frontend or dashboard
- add persistence for reports and workflow traces
- add authentication and rate limiting
- replace prompt-only extraction with structured output parsing
