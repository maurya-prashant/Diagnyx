const cases = [
  {
    audience: 'Patients',
    headline: 'Finally understand your own labs',
    desc: 'No more Googling cryptic values. Get a plain-language breakdown of every result and what it means.',
  },
  {
    audience: 'Clinicians',
    headline: 'Speed up report review',
    desc: 'Use Diagnyx as a first-pass assistant to flag abnormal values and surface root-cause hypotheses.',
  },
  {
    audience: 'Health Builders',
    headline: 'Embed AI interpretation',
    desc: 'The FastAPI backend and LangGraph workflow are modular and extensible — drop it into your platform.',
  },
  {
    audience: 'Med Students',
    headline: 'Learn clinical reasoning',
    desc: 'See how an AI reasons from raw lab values to root causes and dietary interventions.',
  },
]

export default function UseCases() {
  return (
    <section id="use-cases" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-24">
          <span className="section-label">Applications</span>
          <h2 className="h2-premium mb-6">Built for the care journey.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {cases.map(c => (
            <div key={c.audience} className="card-premium group">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6 block border-b border-neutral-50 pb-4">{c.audience}</span>
              <h3 className="text-2xl font-semibold mb-4 text-black tracking-tight">{c.headline}</h3>
              <p className="text-neutral-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
