import { useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import ResultView from '../components/ResultView'

export default function UploadApp() {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [phase, setPhase] = useState('idle')
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  function pickFile(f) { if (f) setFile(f) }

  async function handleSubmit() {
    if (!file) return
    setPhase('analyzing')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const base = import.meta.env.VITE_API_URL || '/api'
      const url = base.endsWith('/upload') ? base : `${base}/upload`
      const res = await fetch(url, { method: 'POST', body: formData })
      if (!res.ok) {
        let errMessage = `Server error (${res.status})`
        try {
          const errData = await res.json()
          errMessage = errData.detail || errData.message || errData.reason || errMessage
        } catch {}
        setErrorMsg(typeof errMessage === 'object' ? JSON.stringify(errMessage) : errMessage)
        setPhase('error')
        return
      }
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
      <main className="max-w-3xl mx-auto px-6 py-32 animate-in">

        {/* Upload phase */}
        {phase === 'idle' && (
          <div className="max-w-xl mx-auto text-center">
            <h1 className="h1-premium mb-4">Analyze Report</h1>
            <p className="p-premium mb-12">Professional-grade AI interpretation pipeline.</p>

            <div
              onClick={() => inputRef.current.click()}
              className="border-2 border-dashed border-neutral-200 rounded-[2.5rem] p-20 cursor-pointer hover:border-neutral-400 transition-all group bg-neutral-50/50"
            >
              <input ref={inputRef} type="file" className="hidden" onChange={e => pickFile(e.target.files[0])} />
              <div className="w-16 h-16 bg-white border border-neutral-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md transition-all">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-black font-semibold text-lg">{file ? file.name : 'Drop report here'}</p>
              <p className="text-neutral-400 text-sm mt-1">PDF, DOCX, PNG, JPG, or TXT</p>
            </div>

            {file && (
              <button onClick={handleSubmit} className="btn-premium w-full mt-8 py-4 text-base shadow-xl shadow-black/5">
                Start Analysis
              </button>
            )}

            {phase === 'error' && (
              <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5 text-left">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1 block">Analysis Failed</span>
                <p className="text-sm font-medium text-red-800">{errorMsg}</p>
              </div>
            )}
          </div>
        )}

        {/* Analyzing spinner */}
        {phase === 'analyzing' && (
          <div className="max-w-xl mx-auto text-center py-24">
            <div className="w-12 h-12 border-4 border-neutral-100 border-t-black rounded-full animate-spin mx-auto mb-8" />
            <p className="text-2xl font-semibold text-black mb-2 tracking-tight">Analyzing…</p>
            <p className="text-neutral-400 text-sm font-medium">Processing through agentic workflow</p>
          </div>
        )}

        {/* Error state (after submit) */}
        {phase === 'error' && (
          <div className="max-w-xl mx-auto text-center">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 mb-8">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 block">Analysis Failed</span>
              <p className="text-sm font-medium text-red-800">{errorMsg}</p>
            </div>
            <button onClick={reset} className="btn-outline">Try Again</button>
          </div>
        )}

        {/* Results */}
        {phase === 'done' && result && (
          <div className="animate-in">
            <div className="mb-10 border-b border-neutral-100 pb-8">
              <h1 className="h1-premium">Report<br />Analysis.</h1>
            </div>
            <ResultView result={result} onReset={reset} />
          </div>
        )}

      </main>
    </div>
  )
}
