import { useRef, useState } from "react";

const ACCEPTED_TYPES = ".pdf,.docx,.png,.jpg,.jpeg,.txt";

const statusCopy = {
  idle: "Ready when you are.",
  uploading: "Uploading your report...",
  analyzing: "Analyzing through the Diagnyx pipeline...",
  success: "Analysis complete.",
  error: "Something went wrong.",
};

function formatLabel(value) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function prettyValue(value) {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "Not available";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function parseResponsePayload(raw) {
  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    return { message: raw };
  }
}

function JsonBlock({ data }) {
  return (
    <pre className="json-block">
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

function ResultSection({ title, children, className = "" }) {
  return (
    <section className={`result-card ${className}`.trim()}>
      <div className="section-heading">
        <h3>{title}</h3>
      </div>
      {children}
    </section>
  );
}

function AcceptedReport({ report }) {
  const patientEntries = Object.entries(report?.patient_info || {});
  const symptoms = Array.isArray(report?.symptoms) ? report.symptoms : [];
  const rootCauses = Array.isArray(report?.root_causes) ? report.root_causes : [];
  const diet = Array.isArray(report?.diet) ? report.diet : [];

  return (
    <div className="results-grid">
      <ResultSection title="Patient Snapshot">
        <div className="stats-grid">
          {patientEntries.length ? (
            patientEntries.map(([key, value]) => (
              <article className="stat-card" key={key}>
                <span>{formatLabel(key)}</span>
                <strong>{prettyValue(value)}</strong>
              </article>
            ))
          ) : (
            <p className="muted">No patient details were extracted.</p>
          )}
        </div>
      </ResultSection>

      <ResultSection title="Summary" className="wide-card">
        <p className="body-copy">{report?.summary || "No summary was generated."}</p>
      </ResultSection>

      <ResultSection title="Symptoms">
        {symptoms.length ? (
          <div className="pill-list">
            {symptoms.map((item, index) => (
              <span className="pill" key={`${item}-${index}`}>
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="muted">No symptoms listed in the synthesized output.</p>
        )}
      </ResultSection>

      <ResultSection title="Possible Root Causes">
        {rootCauses.length ? (
          <ul className="clean-list">
            {rootCauses.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">No root causes were returned.</p>
        )}
      </ResultSection>

      <ResultSection title="Diet Guidance" className="wide-card">
        {diet.length ? (
          <ul className="clean-list">
            {diet.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">No diet recommendations were returned.</p>
        )}
      </ResultSection>
    </div>
  );
}

function RejectedReport({ result }) {
  return (
    <div className="rejected-panel">
      <span className="status-badge rejected">Rejected</span>
      <h3>This file does not appear to be a medical report.</h3>
      <p>{result?.reason || "The backend rejected this document."}</p>
    </div>
  );
}

function ErrorPanel({ error }) {
  return (
    <div className="rejected-panel error-panel">
      <span className="status-badge error">Error</span>
      <h3>The upload could not be processed.</h3>
      <p>{error}</p>
    </div>
  );
}

export default function App() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const hasResult = Boolean(result);

  function handleSelectedFile(nextFile) {
    if (!nextFile) {
      return;
    }

    setFile(nextFile);
    setResult(null);
    setError("");
    setStatus("idle");
  }

  function onFileChange(event) {
    handleSelectedFile(event.target.files?.[0]);
  }

  function onDrop(event) {
    event.preventDefault();
    setDragging(false);
    handleSelectedFile(event.dataTransfer.files?.[0]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setError("Choose a report file before starting the analysis.");
      setStatus("error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setStatus("uploading");
    setError("");
    setResult(null);

    let timer;

    try {
      timer = window.setTimeout(() => {
        setStatus("analyzing");
      }, 450);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const raw = await response.text();
      const data = parseResponsePayload(raw);

      if (!response.ok) {
        throw new Error(data?.message || "Server returned an unexpected response.");
      }

      setResult(data);
      setStatus("success");
    } catch (submitError) {
      setError(submitError.message || "Upload failed.");
      setStatus("error");
    } finally {
      window.clearTimeout(timer);
    }
  }

  const resultTitle =
    result?.status === "accepted"
      ? "Report Insights"
      : result?.status === "rejected"
        ? "Review Outcome"
        : "Latest Response";

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <main className="page">
        <section className="hero fade-up">
          <div className="hero-copy">
            <span className="eyebrow">AI-assisted report interpretation</span>
            <h1>Upload a medical report and get a clean, guided breakdown.</h1>
            <p className="hero-text">
              Diagnyx turns report files into a structured summary with plain-language
              explanation, possible root causes, and diet guidance from the backend
              workflow.
            </p>
          </div>

          <div className="hero-panel">
            <div className="glass-card">
              <div className="mini-stat">
                <span>Supported</span>
                <strong>PDF, DOCX, JPG, PNG, TXT</strong>
              </div>
              <div className="mini-stat">
                <span>Pipeline</span>
                <strong>Ingest, Gate, Extract, Explain, Synthesize</strong>
              </div>
              <div className="mini-stat">
                <span>Mode</span>
                <strong>{statusCopy[status]}</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="workspace fade-up">
          <form className="upload-panel" onSubmit={handleSubmit}>
            <div className="panel-head">
              <div>
                <span className="eyebrow">Upload</span>
                <h2>Start a new analysis</h2>
              </div>
              <span
                className={`status-badge ${
                  status === "success"
                    ? "success"
                    : status === "error"
                      ? "error"
                      : status === "uploading" || status === "analyzing"
                        ? "busy"
                        : ""
                }`.trim()}
              >
                {status}
              </span>
            </div>

            <label
              className={`dropzone ${dragging ? "dragging" : ""} ${file ? "has-file" : ""}`.trim()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                onChange={onFileChange}
              />

              <div className="dropzone-copy">
                <div className="upload-icon" aria-hidden="true">
                  <span />
                </div>
                <h3>{file ? file.name : "Drop your file here"}</h3>
                <p>
                  {file
                    ? `${(file.size / 1024 / 1024).toFixed(2)} MB selected`
                    : "Drag and drop a report, or browse from your device."}
                </p>
              </div>

              <button
                type="button"
                className="secondary-button"
                onClick={() => inputRef.current?.click()}
              >
                Choose file
              </button>
            </label>

            <div className="panel-foot">
              <p className="helper-text">
                Your file is sent to the FastAPI backend and analyzed through the
                LangGraph workflow documented in the project README.
              </p>
              <button
                type="submit"
                className="primary-button"
                disabled={status === "uploading" || status === "analyzing"}
              >
                {status === "uploading" || status === "analyzing"
                  ? "Processing..."
                  : "Analyze report"}
              </button>
            </div>
          </form>

          <aside className="notes-panel">
            <div className="notes-card">
              <span className="eyebrow">What you get</span>
              <ul className="clean-list compact">
                <li>Patient-friendly summary</li>
                <li>Structured lab output</li>
                <li>Possible root causes</li>
                <li>Diet suggestions from the pipeline</li>
              </ul>
            </div>

            <div className="notes-card soft">
              <span className="eyebrow">Reminder</span>
              <p className="body-copy small">
                This interface is for assistive interpretation only and should not
                replace clinical review.
              </p>
            </div>
          </aside>
        </section>

        <section className="results-panel fade-up">
          <div className="panel-head">
            <div>
              <span className="eyebrow">Output</span>
              <h2>{resultTitle}</h2>
            </div>
          </div>

          {!hasResult && !error && (
            <div className="empty-state">
              <p>
                Upload a file to see the synthesized report, rejection message, or
                backend error details here.
              </p>
            </div>
          )}

          {error && <ErrorPanel error={error} />}
          {result?.status === "rejected" && <RejectedReport result={result} />}
          {result?.status === "accepted" && <AcceptedReport report={result.report} />}
          {result && result.status !== "accepted" && result.status !== "rejected" && !error && (
            <JsonBlock data={result} />
          )}
        </section>
      </main>
    </div>
  );
}
