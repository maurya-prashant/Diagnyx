export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden noise-bg">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#1D9E75]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-[#1D9E75] bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-full px-3 py-1 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-pulse" />
            AI-Powered Medical Intelligence
          </span>

          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Understand Your{' '}
            <span className="gradient-text">Medical Reports</span>{' '}
            Instantly
          </h1>

          <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
            Diagnyx uses an agentic AI workflow to extract, explain, and act on your lab results —
            delivering patient-friendly summaries, root-cause insights, and personalized nutrition
            guidance in seconds.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#how-it-works" className="text-sm font-medium text-white/80 border border-white/20 hover:border-[#1D9E75] hover:text-white px-6 py-3 rounded-xl transition-all">
              See How It Works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-xs text-white/40">
            {['PDF · DOCX · PNG · JPG · TXT', 'LangGraph Agentic Workflow'].map(b => (
              <span key={b} className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#5DCAA5]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex justify-center">
          <div className="animate-float w-full max-w-sm">
            <div className="animate-glow rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                <p className="text-xs text-white/40 mb-0.5">Patient Report</p>
                  <p className="text-sm font-semibold text-white">Blood Panel Analysis</p>
                </div>
                <span className="text-xs font-medium text-[#1D9E75] bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-full px-2.5 py-1">Analyzed</span>
              </div>

              <div className="space-y-3 mb-5">
                {[
                  { test: 'Glucose',     value: '140 mg/dL', status: 'High',   color: 'text-[#E24B4A]' },
                  { test: 'Hemoglobin', value: '11.2 g/dL', status: 'Low',    color: 'text-[#BA7517]' },
                  { test: 'Creatinine', value: '0.9 mg/dL', status: 'Normal', color: 'text-[#1D9E75]' },
                  { test: 'Cholesterol',value: '215 mg/dL', status: 'High',   color: 'text-[#E24B4A]' },
                ].map(r => (
                  <div key={r.test} className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                    <span className="text-xs text-white/60">{r.test}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-white">{r.value}</span>
                      <span className={`text-xs font-medium ${r.color}`}>{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-lg p-3">
                <p className="text-xs text-[#5DCAA5] font-medium mb-1">AI Insight</p>
                <p className="text-xs text-white/60 leading-relaxed">
                  Elevated glucose and cholesterol suggest metabolic syndrome risk. Personalized diet plan generated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
