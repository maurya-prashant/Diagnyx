import { useState, useRef, useEffect } from 'react'

const ACCEPTED = '.pdf,.docx,.png,.jpg,.jpeg,.txt'

function StatusBadge({ status }) {
  const map = {
    High:   'bg-neutral-900 text-white',
    Low:    'border-neutral-200 text-neutral-600',
    Normal: 'bg-neutral-50 text-neutral-400',
  }
  return (
    <span className={`text-[10px] font-bold uppercase border px-2 py-0.5 rounded-md ${map[status] ?? map.Normal}`}>
      {status}
    </span>
  )
}

export default function UploadModal({ onClose }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [drag, setDrag] = useState(false)
  const [phase, setPhase] = useState('idle')
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function pickFile(f) { if (f) setFile(f) }

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
      const base = import.meta.env.VITE_API_URL ?? ''
      const res = await fetch(`${base}/upload`, { method: 'POST', body: form })
      const data = await res.json()
      if (data.status === 'accepted') { setResult(data.report); setPhase('done') }
      else if (data.status === 'rejected') { setErrorMsg(data.reason ?? 'Not a medical report.'); setPhase('rejected') }
      else { setErrorMsg(data.message ?? 'Something went wrong.'); setPhase('error') }
    } catch {
      setErrorMsg('Could not reach the server.')
      setPhase('error')
    }
  }

  const reset = () => { setFile(null); setPhase('idle'); setResult(null); setErrorMsg('') }
  const showUpload = phase === 'idle' || phase === 'rejected' || phase === 'error'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in overflow-hidden border border-neutral-100">

        <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-50 shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-black tracking-tight">Analyze Report</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-neutral-50 flex items-center justify-center text-neutral-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-8">

          {showUpload && (
            <div className="animate-in">
              <div
                onClick={() => inputRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                className={`cursor-pointer rounded-3xl border-2 border-dashed p-16 text-center transition-all ${
                  drag ? 'border-black bg-neutral-50' : 'border-neutral-100 hover:border-neutral-300'
                }`}
              >
                <input ref={inputRef} type="file" accept={ACCEPTED} className="hidden" onChange={e => pickFile(e.target.files[0])} />
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                {file ? (
                  <p className="text-black font-semibold text-lg">{file.name}</p>
                ) : (
                  <>
                    <p className="text-black font-semibold text-lg mb-1">Drop your report here</p>
                    <p className="text-neutral-400 text-sm font-medium">or click to browse files</p>
                  </>
                )}
              </div>

              {file && (
                <button onClick={handleSubmit} className="btn-premium w-full mt-8 py-4 text-base">
                  Analyze Now
                </button>
              )}

              {(phase === 'error' || phase === 'rejected') && (
                <div className="mt-8 bg-neutral-50 rounded-2xl p-6 text-sm">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 block">Analysis Error</span>
                  <p className="font-semibold text-black">{errorMsg}</p>
                </div>
              )}
            </div>
          )}

          {phase === 'analyzing' && (
            <div className="text-center py-24 animate-in">
              <div className="w-12 h-12 border-4 border-neutral-100 border-t-black rounded-full animate-spin mx-auto mb-8" />
              <p className="text-xl font-semibold text-black mb-2">Analyzing…</p>
              <p className="text-neutral-400 text-sm font-medium">Running agentic pipeline analysis</p>
            </div>
          )}

          {phase === 'done' && result && (
            <div className="space-y-8 animate-in">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-neutral-50">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Report Result</span>
                <button onClick={reset} className="text-xs font-bold text-black uppercase tracking-widest hover:underline">New Analysis</button>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-neutral-50 rounded-2xl">
                   <p className="text-sm leading-relaxed text-black font-medium">{result.summary}</p>
                </div>

                {result.lab_results?.length > 0 && (
                  <div className="border border-neutral-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-neutral-50 text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-3">Test</th>
                          <th className="px-6 py-3">Value</th>
                          <th className="px-6 py-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-50">
                        {result.lab_results.map((r, i) => (
                          <tr key={i}>
                            <td className="px-6 py-4 font-semibold">{r.test}</td>
                            <td className="px-6 py-4 font-mono text-neutral-500">{r.value} {r.unit}</td>
                            <td className="px-6 py-4 text-right"><StatusBadge status={r.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-black rounded-2xl p-6 text-white">
                  <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-3 block">Insights</span>
                  <p className="text-xs leading-relaxed opacity-90">{result.root_causes}</p>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-6">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-3 block">Nutrition</span>
                  <p className="text-xs leading-relaxed text-neutral-600">{result.diet}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
