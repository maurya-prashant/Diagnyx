import { useState, useRef } from 'react'
import Navbar from '../components/Navbar'

const ACCEPTED = '.pdf,.docx,.png,.jpg,.jpeg,.txt'

function StatusBadge({ status }) {
  const map = {
    High:   'text-[#E24B4A] bg-[#E24B4A]/10 border-[#E24B4A]/20',
    Low:    'text-[#BA7517] bg-[#BA7517]/10 border-[#BA7517]/20',
    Normal: 'text-[#1D9E75] bg-[#1D9E75]/10 border-[#1D9E75]/20',
  }
  return (
    <span className={`text-xs font-medium border rounded-full px-2 py-0.5 ${map[status] ?? map.Normal}`}>
      {status}
    </span>
  )
}

export default function UploadApp() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [drag, setDrag] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | analyzing | done | error | rejected
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  function pickFile(f) {
    if (f) setFile(f)
  }

  function onDrop(e) {
    e.preventDefault()
    setDrag(false)
    pickFile(e.dataTransfer.files[0])
  }

  async function handleSubmit() {
    if (!file) return
    setPhase('analyzing')
    setResult(null)
    setErrorMsg('')

    const form = new FormData()
    form.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()

      if (data.status === 'accepted') {
        setResult(data.report)
        setPhase('done')
      } else if (data.status === 'rejected') {
        setErrorMsg(data.reason ?? 'Not a medical report.')
        setPhase('rejected')
      } else {
        setErrorMsg(data.message ?? 'Something went wrong.')
        setPhase('error')
      }
    } catch {
      setErrorMsg('Could not reach the server. Make sure the backend is running.')
      setPhase('error')
    }
  }

  function reset() {
    setFile(null)
    setPhase('idle')
    setResult(null)
    setErrorMsg('')
  }

  const showUpload = phase === 'idle' || phase === 'rejected' || phase === 'error'

  return (
    <div className="min-h-screen bg-[#F7FAFB] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 pt-28">

        {/* Upload zone */}
        {showUpload && (
          <div className="max-w-xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-[#0F3D2A] tracking-tight mb-2">Analyze a Report</h1>
              <p className="text-[#888780] text-sm">Upload your medical report and get an AI-powered interpretation in seconds.</p>
            </div>

            <div
              onClick={() => inputRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
                drag ? 'border-[#1D9E75] bg-[#1D9E75]/5' : 'border-[#D3D1C7] hover:border-[#1D9E75]/50 hover:bg-[#E1F5EE]/50]'
              }`}
            >
              <input ref={inputRef} type="file" accept={ACCEPTED} className="hidden" onChange={e => pickFile(e.target.files[0])} />
              <div className="w-12 h-12 rounded-xl bg-[#1D9E75]/10 text-[#1D9E75] flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              {file ? (
                <p className="text-[#2C2C2A] font-medium">{file.name}</p>
              ) : (
                <>
                  <p className="text-[#2C2C2A] font-medium mb-1">Drop your file here</p>
                  <p className="text-[#888780] text-sm">or click to browse</p>
                </>
              )}
              <p className="text-[#888780] text-xs mt-3">PDF · DOCX · PNG · JPG · JPEG · TXT</p>
            </div>

            {file && (
              <button onClick={handleSubmit} className="btn-primary w-full mt-4 text-white font-semibold py-3 rounded-xl text-sm">
                Analyze Report
              </button>
            )}

            {(phase === 'error' || phase === 'rejected') && (
              <div className="mt-4 bg-[#E24B4A]/10 border border-[#E24B4A]/20 rounded-xl p-4 text-sm text-[#E24B4A]">
                {phase === 'rejected' ? '⚠ Not a medical report: ' : '✕ Error: '}{errorMsg}
              </div>
            )}
          </div>
        )}

        {/* Loading */}
        {phase === 'analyzing' && (
          <div className="max-w-xl mx-auto text-center py-24">
            <div className="w-14 h-14 rounded-2xl bg-[#1D9E75]/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-7 h-7 text-[#1D9E75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-[#2C2C2A] font-semibold text-lg mb-2">Analyzing your report…</p>
            <p className="text-[#888780] text-sm">The agentic pipeline is running. This may take 15–30 seconds.</p>
          </div>
        )}

        {/* Results */}
        {phase === 'done' && result && (
          <div className="space-y-6 animate-fade-up">

            <div className="bg-white border border-[#D3D1C7] rounded-2xl p-6">
              <h2 className="text-xs font-semibold text-[#888780] uppercase tracking-widest mb-3">Summary</h2>
              <p className="text-[#2C2C2A] leading-relaxed">{result.summary}</p>
            </div>

            {result.takeaways?.length > 0 && (
              <div className="bg-white border border-[#D3D1C7] rounded-2xl p-6">
                <h2 className="text-xs font-semibold text-[#888780] uppercase tracking-widest mb-3">Key Takeaways</h2>
                <ul className="space-y-2">
                  {result.takeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#2C2C2A]">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1D9E75] shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.lab_results?.length > 0 && (
              <div className="bg-white border border-[#D3D1C7] rounded-2xl p-6">
                <h2 className="text-xs font-semibold text-[#888780] uppercase tracking-widest mb-4">Lab Results</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-[#888780] border-b border-[#D3D1C7]">
                        <th className="pb-2 font-medium">Test</th>
                        <th className="pb-2 font-medium">Value</th>
                        <th className="pb-2 font-medium">Unit</th>
                        <th className="pb-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D3D1C7]">
                      {result.lab_results.map((r, i) => (
                        <tr key={i}>
                          <td className="py-2.5 text-[#2C2C2A]">{r.test}</td>
                          <td className="py-2.5 font-mono text-[#2C2C2A]">{r.value}</td>
                          <td className="py-2.5 text-[#888780]">{r.unit}</td>
                          <td className="py-2.5"><StatusBadge status={r.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {result.root_causes && (
              <div className="bg-white border border-[#D3D1C7] rounded-2xl p-6">
                <h2 className="text-xs font-semibold text-[#888780] uppercase tracking-widest mb-3">Root Cause Analysis</h2>
                <p className="text-[#2C2C2A] text-sm leading-relaxed whitespace-pre-line">{result.root_causes}</p>
              </div>
            )}

            {result.diet && (
              <div className="bg-white border border-[#D3D1C7] rounded-2xl p-6">
                <h2 className="text-xs font-semibold text-[#888780] uppercase tracking-widest mb-3">Nutrition Guidance</h2>
                <p className="text-[#2C2C2A] text-sm leading-relaxed whitespace-pre-line">{result.diet}</p>
              </div>
            )}

            <p className="text-center text-xs text-[#888780]/70 pb-4">
              Diagnyx is an assistive tool, not a diagnostic system. Review outputs with a qualified healthcare professional.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
