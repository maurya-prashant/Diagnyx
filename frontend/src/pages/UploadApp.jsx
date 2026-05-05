import { useState, useRef } from 'react'
import Navbar from '../components/Navbar'

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

export default function UploadApp() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [drag, setDrag] = useState(false)
  const [phase, setPhase] = useState('idle')
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  function pickFile(f) { if (f) setFile(f) }

  async function handleSubmit() {
    if (!file) return
    setPhase('analyzing')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: new FormData().append('file', file) })
      const data = await res.json()
      if (data.status === 'accepted') { setResult(data.report); setPhase('done') }
      else { setErrorMsg(data.reason ?? 'Error'); setPhase('error') }
    } catch {
      setErrorMsg('Server unreachable'); setPhase('error')
    }
  }

  const reset = () => { setFile(null); setPhase('idle'); setResult(null); setErrorMsg('') }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onGetStarted={reset} />
      <main className="max-w-5xl mx-auto px-6 py-32 animate-in">
        
        {phase === 'idle' && (
          <div className="max-w-xl mx-auto text-center">
            <h1 className="h1-premium mb-6">Analyze Report</h1>
            <p className="p-premium mb-12">Professional-grade AI interpretation pipeline.</p>
            
            <div 
              onClick={() => inputRef.current.click()}
              className="border-2 border-dashed border-neutral-100 rounded-[2.5rem] p-20 cursor-pointer hover:border-neutral-200 transition-all group bg-neutral-50/50"
            >
              <input ref={inputRef} type="file" className="hidden" onChange={e => pickFile(e.target.files[0])} />
              <div className="w-16 h-16 bg-white border border-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-all">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-black font-semibold text-lg">{file ? file.name : 'Drop report here'}</p>
              <p className="text-neutral-400 text-sm mt-1">PDF, DOCX, or Images</p>
            </div>

            {file && (
              <button onClick={handleSubmit} className="btn-premium w-full mt-8 py-4 text-base shadow-xl shadow-black/5">
                Start Analysis
              </button>
            )}
          </div>
        )}

        {phase === 'analyzing' && (
          <div className="max-w-xl mx-auto text-center py-24">
            <div className="w-12 h-12 border-4 border-neutral-100 border-t-black rounded-full animate-spin mx-auto mb-8" />
            <p className="text-2xl font-semibold text-black mb-2 tracking-tight">Analyzing…</p>
            <p className="text-neutral-400 text-sm font-medium">Processing through agentic workflow</p>
          </div>
        )}

        {phase === 'done' && result && (
          <div className="space-y-12 animate-in">
            <div className="flex justify-between items-end border-b border-neutral-100 pb-12">
              <h1 className="h1-premium">Report <br /> Analysis.</h1>
              <button onClick={reset} className="btn-premium">New Report</button>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <div className="bg-neutral-50 rounded-[2rem] p-10">
                  <span className="section-label mb-6">Summary</span>
                  <p className="text-xl font-medium text-black leading-relaxed">{result.summary}</p>
                </div>

                <div className="border border-neutral-100 rounded-[2rem] overflow-hidden bg-white shadow-sm">
                  <div className="p-8 border-b border-neutral-50 bg-neutral-50/50">
                    <span className="section-label mb-0">Lab Results</span>
                  </div>
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-neutral-50">
                      {result.lab_results.map((r, i) => (
                        <tr key={i} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-8 py-5 font-semibold text-black">{r.test}</td>
                          <td className="px-8 py-5 font-mono text-neutral-500">{r.value} {r.unit}</td>
                          <td className="px-8 py-5 text-right"><StatusBadge status={r.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-black rounded-[2rem] p-8 text-white shadow-2xl shadow-black/10">
                  <span className="section-label text-neutral-500 mb-6">Insights</span>
                  <p className="text-sm leading-relaxed opacity-90 font-medium whitespace-pre-line">{result.root_causes}</p>
                </div>

                <div className="bg-neutral-50 rounded-[2rem] p-8">
                  <span className="section-label mb-6">Nutrition</span>
                  <p className="text-sm leading-relaxed text-neutral-600 font-medium whitespace-pre-line">{result.diet}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
