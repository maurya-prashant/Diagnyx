# from fastapi import FastAPI, UploadFile, File
# import os

# from graph.workflow import medify_graph

# app = FastAPI()

# UPLOAD_DIR = "uploads"
# os.makedirs(UPLOAD_DIR, exist_ok=True)


# @app.get("/")
# def home():
#     return {"message": "MEDIFY LangGraph running"}


# @app.post("/upload")
# async def upload_report(file: UploadFile = File(...)):

#     file_path = os.path.join(UPLOAD_DIR, file.filename)

#     with open(file_path, "wb") as f:
#         f.write(await file.read())

#     initial_state = {
#         "file_path": file_path
#     }

#     result = medify_graph.invoke(initial_state)

#     print("GRAPH KEYS:", result.keys())

#     if result.get("rejected"):
#         return {
#             "status": "rejected",
#             "reason": result.get("rejection_reason")
#         }

#     report = result.get("final_report")

#     if not report:
#         return {
#             "status": "error",
#             "message": "final_report missing",
#             "debug": list(result.keys())
#         }

#     return {
#         "status": "accepted",
#         "report": report
#     }


from fastapi import FastAPI, UploadFile, File
from graph.workflow import medify_graph

app = FastAPI()

@app.get("/")
def home():
    return {"message": "MEDIFY LangGraph running"}

@app.post("/upload")
async def upload_report(file: UploadFile = File(...)):
    # 1. Read the file content into memory as bytes
    # This replaces the 'with open(file_path, "wb")' block
    file_bytes = await file.read()
    file_name = file.filename

    # 2. Pass the bytes and the filename to the graph state
    # We remove "file_path" and use "file_bytes" and "file_name"
    initial_state = {
        "file_bytes": file_bytes,
        "file_name": file_name
    }

    # 3. Invoke the LangGraph workflow
    result = medify_graph.invoke(initial_state)

    # Log keys for debugging (optional)
    print("GRAPH KEYS:", result.keys())

    # 4. Handle the "Rejected" state (Gate node)
    if result.get("rejected"):
        return {
            "status": "rejected",
            "reason": result.get("rejection_reason")
        }

    # 5. Handle the final synthesized report
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