
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from graph.workflow import medify_graph
import traceback

app = FastAPI()

#CORS (allow frontend to call backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your Netlify URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check route
@app.get("/")
def home():
    return {"message": "Diagnyx API running"}

# Upload endpoint
@app.post("/upload")
@app.post("/api/upload")
async def upload_report(file: UploadFile = File(...)):
    try:
        # Read file
        file_bytes = await file.read()
        file_name = file.filename

        print("File received:", file_name)
        print("File size:", len(file_bytes))

        # Prepare graph state
        initial_state = {
            "file_bytes": file_bytes,
            "file_name": file_name
        }

        # Call your LangGraph workflow
        result = medify_graph.invoke(initial_state)

        print("Graph executed")
        print("GRAPH KEYS:", result.keys())

        # Handle rejection
        if result.get("rejected"):
            return {
                "status": "rejected",
                "reason": result.get("rejection_reason")
            }

        # Handle success
        report = result.get("final_report")

        if not report:
            return {
                "status": "error",
                "message": "final_report missing",
                "debug": list(result.keys())
            }

        return {
            "status": "accepted",
            "report": report
        }

    except Exception as e:
        print("ERROR OCCURRED:")
        print(str(e))
        traceback.print_exc()

        return {
            "status": "error",
            "message": str(e)
        }
    
    
