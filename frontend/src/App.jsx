import { useMemo, useRef, useState } from "react";

const ACCEPTED_TYPES = ".pdf,.docx,.png,.jpg,.jpeg,.txt";

const statusCopy = {
  idle: "Ready when you are",
  uploading: "Receiving your report",
  analyzing: "Reading the details",
  success: "Review ready",
  error: "Needs another try",
};

const statusHint = {
  idle: "Upload a lab report or prescription and Diagnyx will turn it into a clearer review.",
  uploading: "Keeping the file intact while it is handed to the clinical workflow.",
  analyzing: "Checking the report, extracting labs, and preparing a patient-friendly summary.",
  success: "Your report has been organized into findings, context, and next-step nutrition guidance.",
  error: "Something got in the way. You can choose the file again and retry.",
};

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function splitLines(text = "") {
  return text
    .split(/\n|(?=\d+\.\s)/)
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);
}

function Section({ eyebrow, title, children, className = "" }) {
  return (
    <section className={cx("panel", className)}>
      <div className="panel-head">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h3>{title}</h3>
        </div>
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}

function LabTable({ labs }) {
  if (!Array.isArray(labs) || labs.length === 0) {
    return <p className="soft-note">No structured lab values were returned for this report.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="medical-table">
        <thead>
          <tr>
            <th>Marker</th>
            <th>Result</th>
            <th>Unit</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {labs.map((lab, index) => {
            const status = (lab.status || "normal").toLowerCase();
            const isFlagged = ["high", "low", "abnormal"].includes(status);

            return (
              <tr key={`${lab.test}-${index}`} className={isFlagged ? "row-flagged" : ""}>
                <td>
                  <strong>{lab.test || "Unknown marker"}</strong>
                </td>
                <td>{lab.value ?? "Not found"}</td>
                <td>{lab.unit || "-"}</td>
                <td>
                  <span className={cx("status-pill", status)}>{lab.status || "Normal"}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function InsightCard({ cause, index }) {
  const isObject = typeof cause === "object" && cause !== null;
  const title = isObject ? cause.condition || `Observation ${index + 1}` : `Observation ${index + 1}`;
  const text = isObject ? cause.reasoning || cause.summary || "" : cause;
  const severity = isObject ? cause.severity || "Moderate" : "Moderate";

  return (
    <article className="insight-card">
      <div className="insight-topline">
        <span className={cx("severity-badge", severity.toLowerCase())}>{severity}</span>
        <span className="insight-count">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h4>{title}</h4>
      <p>{text}</p>
    </article>
  );
}

function NutritionDashboard({ dietText }) {
  if (!dietText) return <p className="soft-note">No personalized nutrition guidance was returned.</p>;

  const lines = splitLines(dietText);
  const avoid = lines.filter((line) => /avoid|limit|do not|reduce/i.test(line));
  const include = lines.filter((line) => /include|increase|recommended|choose|add/i.test(line));
  const general = lines.filter((line) => !avoid.includes(line) && !include.includes(line));

  return (
    <div className="nutrition-grid">
      <div className="nutrition-lane avoid">
        <p className="lane-title">Avoid or limit</p>
        {avoid.length ? avoid.map((item, index) => <p key={index}>{item}</p>) : <p>No avoid list found.</p>}
      </div>
      <div className="nutrition-lane include">
        <p className="lane-title">Lean into</p>
        {include.length ? include.map((item, index) => <p key={index}>{item}</p>) : <p>No include list found.</p>}
      </div>
      {general.length > 0 && (
        <div className="nutrition-lane general">
          <p className="lane-title">Notes</p>
          {general.map((item, index) => <p key={index}>{item}</p>)}
        </div>
      )}
    </div>
  );
}

function LoadingState({ status }) {
  return (
    <div className="loading-card">
      <div className="orbital-loader" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div>
        <p className="eyebrow">In progress</p>
        <h3>{statusCopy[status]}</h3>
        <p>{statusHint[status]}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-mark">Dx</div>
      <h2>A clearer report starts here.</h2>
      <p>
        Choose a medical report and Diagnyx will organize the important parts into labs,
        possible patterns, plain-language context, and nutrition guidance.
      </p>
    </div>
  );
}

function AcceptedReport({ report }) {
  const rootCauses = useMemo(() => {
    if (Array.isArray(report?.root_causes)) return report.root_causes;
    return splitLines(report?.root_causes || "");
  }, [report?.root_causes]);

  const flaggedLabs = useMemo(() => {
    if (!Array.isArray(report?.lab_results)) return 0;
    return report.lab_results.filter((lab) =>
      ["high", "low", "abnormal"].includes((lab.status || "").toLowerCase())
    ).length;
  }, [report?.lab_results]);

  return (
    <div className="report-container">
      <section className="result-hero">
        <div>
          <p className="eyebrow">Report review</p>
          <h2>Here is the clearer version.</h2>
          <p>
            Diagnyx grouped the clinical details so the important signals are easier to scan
            and discuss with a qualified professional.
          </p>
        </div>
        <div className="result-metrics" aria-label="Report metrics">
          <div>
            <strong>{report?.lab_results?.length || 0}</strong>
            <span>lab markers</span>
          </div>
          <div>
            <strong>{flaggedLabs}</strong>
            <span>flagged</span>
          </div>
          <div>
            <strong>{rootCauses.length}</strong>
            <span>patterns</span>
          </div>
        </div>
      </section>

      <div className="report-grid">
        <div className="report-main">
          <Section eyebrow="Plain language" title="Summary">
            <p className="summary-text">{report?.summary || "No summary was generated."}</p>
            {Array.isArray(report?.takeaways) && report.takeaways.length > 0 && (
              <div className="takeaways-wrapper">
                {report.takeaways.map((takeaway, index) => (
                  <span key={index} className="takeaway-chip">{takeaway}</span>
                ))}
              </div>
            )}
          </Section>

          <Section eyebrow="Evidence" title="Lab results">
            <LabTable labs={report?.lab_results} />
          </Section>
        </div>

        <aside className="report-side">
          <Section eyebrow="Patterns" title="Possible root causes">
            <div className="insights-stack">
              {rootCauses.length ? (
                rootCauses.map((cause, index) => <InsightCard key={index} cause={cause} index={index} />)
              ) : (
                <p className="soft-note">No root-cause notes were returned.</p>
              )}
            </div>
          </Section>

          <Section eyebrow="Food guidance" title="Nutrition">
            <NutritionDashboard dietText={report?.diet} />
          </Section>
        </aside>
      </div>
    </div>
  );
}

export default function App() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const isWorking = status === "uploading" || status === "analyzing";

  function chooseFile(nextFile) {
    setFile(nextFile);
    setResult(null);
    setError("");
    setStatus("idle");
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    chooseFile(event.dataTransfer.files?.[0]);
  }

  async function handleAnalysis(event) {
    event.preventDefault();
    if (!file) {
      setError("Choose a report first so there is something to review.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setStatus("uploading");
    setError("");
    setResult(null);

    try {
      const timer = window.setTimeout(() => setStatus("analyzing"), 500);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      window.clearTimeout(timer);

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "The report could not be analyzed.");

      setResult(data);
      setStatus("success");
    } catch (err) {
      setError(err.message || "The report could not be analyzed.");
      setStatus("error");
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <button className="brand-mark" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Dx
          </button>
          <div>
            <h1>Diagnyx</h1>
            <p>Medical reports, translated into calmer language.</p>
          </div>
        </div>
        <div className={cx("system-status", status)}>
          <span className="status-dot" />
          <span>{statusCopy[status]}</span>
        </div>
      </header>

      <main className="app-content">
        <section className="intro-band">
          <div>
            <p className="eyebrow">AI-assisted report review</p>
            <h2>Bring the report. Leave with a clearer next conversation.</h2>
            <p>{statusHint[status]}</p>
          </div>
          <form className="upload-panel" onSubmit={handleAnalysis}>
            <label
              className={cx("dropzone", file && "has-file", isDragging && "is-dragging")}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                onChange={(event) => chooseFile(event.target.files?.[0])}
              />
              <span className="upload-glyph">+</span>
              <span className="drop-title">{file ? file.name : "Drop your report here"}</span>
              <span className="drop-meta">
                {file ? `${formatFileSize(file.size)} selected` : "PDF, DOCX, PNG, JPG, JPEG, or TXT"}
              </span>
            </label>

            <div className="upload-actions">
              <button className="btn-secondary" type="button" onClick={() => inputRef.current?.click()}>
                Choose file
              </button>
              {file && (
                <button className="btn-ghost" type="button" onClick={() => chooseFile(null)}>
                  Clear
                </button>
              )}
              <button className="btn-primary" type="submit" disabled={isWorking}>
                {isWorking ? "Reviewing..." : "Review report"}
              </button>
            </div>
          </form>
        </section>

        <section className="results-section" aria-live="polite">
          {error && (
            <div className="notice error">
              <strong>That did not work yet.</strong>
              <span>{error}</span>
            </div>
          )}

          {isWorking && <LoadingState status={status} />}

          {result?.status === "rejected" && (
            <div className="notice rejected">
              <strong>This does not look like a medical report.</strong>
              <span>{result.reason || "Try another file with clearer medical content."}</span>
            </div>
          )}

          {result?.status === "accepted" && <AcceptedReport report={result.report} />}

          {!result && !error && !isWorking && <EmptyState />}
        </section>
      </main>
    </div>
  );
}
