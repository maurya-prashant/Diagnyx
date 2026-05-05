export default function Hero({ onGetStarted }) {
  return (
    <section className="relative min-h-screen flex items-center pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="animate-in">
          <span className="section-label">AI Medical Intelligence</span>
          
          <h1 className="h1-premium mb-8">
            Understand your <br />
            <span className="text-neutral-400">medical reports</span> <br />
            instantly.
          </h1>

          <p className="p-premium mb-10 max-w-lg">
            Diagnyx uses an agentic AI workflow to extract, explain, and act on your lab results — delivering professional-grade health insights in seconds.
          </p>

          <div className="flex flex-wrap gap-4">
            <button onClick={onGetStarted} className="btn-premium px-8 py-3 text-base">
              Start Analysis
            </button>
            <a href="#how-it-works" className="btn-outline px-8 py-3 text-base inline-flex items-center gap-2">
              Learn More
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          <div className="mt-16 flex flex-wrap gap-8 text-[11px] font-semibold uppercase tracking-widest text-neutral-300">
            {['PDF · DOCX · Images', 'Agentic Workflow'].map(b => (
              <span key={b} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-neutral-300 rounded-full" />
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="hidden lg:block relative animate-in [animation-delay:200ms]">
          <div className="absolute -inset-4 bg-neutral-50 rounded-[2.5rem] -z-10" />
          <div className="bg-white border border-neutral-100 shadow-2xl rounded-3xl p-8 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-50">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Analysis Status</p>
                <p className="text-lg font-semibold text-black uppercase">Blood Panel</p>
              </div>
              <div className="w-2.5 h-2.5 bg-black rounded-full animate-pulse" />
            </div>

            <div className="space-y-4 mb-8">
              {[
                { test: 'Glucose',     value: '140', status: 'High', color: 'bg-black text-white' },
                { test: 'Hemoglobin', value: '11.2', status: 'Low', color: 'border-neutral-200' },
                { test: 'Creatinine', value: '0.9', status: 'Normal', color: 'bg-neutral-50 text-neutral-400' },
              ].map(r => (
                <div key={r.test} className="flex items-center justify-between p-4 rounded-xl border border-neutral-50 hover:border-neutral-200 transition-all group">
                  <span className="text-sm font-medium text-neutral-500 group-hover:text-black">{r.test}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono font-bold">{r.value}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${r.color}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-neutral-900 rounded-2xl p-6 text-white">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">AI Insight</p>
              <p className="text-sm leading-relaxed opacity-90">
                Metabolic markers suggest risk factors that warrant clinical follow-up. Diet plan adjusted for glucose sensitivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
