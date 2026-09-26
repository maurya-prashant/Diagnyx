import { useState, useRef, useEffect } from 'react'
import ResultView from './ResultView'

const ACCEPTED = '.pdf,.docx,.png,.jpg,.jpeg,.txt'

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
      const base = import.meta.env.VITE_API_URL || '/api'
      const url = base.endsWith('/upload') ? base : `${base}/upload`
      const res = await fetch(url, { method: 'POST', body: form })

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

        {/* Modal header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-100 shrink-0">
          <h2 className="text-base font-semibold text-black tracking-tight">Analyze Report</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-8 py-7">

          {/* Upload zone */}
          {showUpload && (
            <div className="animate-in">
              <div
                onClick={() => inputRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                className={`cursor-pointer rounded-3xl border-2 border-dashed p-14 text-center transition-all ${
                  drag ? 'border-black bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <input ref={inputRef} type="file" accept={ACCEPTED} className="hidden" onChange={e => pickFile(e.target.files[0])} />
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                {file ? (
                  <p className="text-black font-semibold text-base">{file.name}</p>
                ) : (
                  <>
                    <p className="text-black font-semibold text-base mb-1">Drop your report here</p>
                    <p className="text-neutral-400 text-sm">PDF, DOCX, PNG, JPG, or TXT</p>
                  </>
                )}
              </div>

              {file && (
                <button onClick={handleSubmit} className="btn-premium w-full mt-6 py-3.5 text-sm">
                  Analyze Now
                </button>
              )}

              {(phase === 'error' || phase === 'rejected') && (
                <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5">
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1 block">
                    {phase === 'rejected' ? 'Not a Medical Report' : 'Analysis Failed'}
                  </span>
                  <p className="text-sm font-medium text-red-800">{errorMsg}</p>
                </div>
              )}
            </div>
          )}

          {/* Analyzing state */}
          {phase === 'analyzing' && (
            <div className="text-center py-20 animate-in">
              <div className="w-10 h-10 border-4 border-neutral-100 border-t-black rounded-full animate-spin mx-auto mb-6" />
              <p className="text-lg font-semibold text-black mb-1">Analyzing…</p>
              <p className="text-neutral-400 text-sm">Running agentic pipeline analysis</p>
            </div>
          )}

          {/* Results */}
          {phase === 'done' && result && (
            <ResultView result={result} onReset={reset} compact />
          )}

        </div>
      </div>
    </div>
  )
}
