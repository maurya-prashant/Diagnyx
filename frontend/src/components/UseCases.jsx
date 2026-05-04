const cases = [
  {
    emoji: '🏥',
    audience: 'Patients',
    headline: 'Finally understand your own labs',
    desc: 'No more Googling cryptic values. Get a plain-language breakdown of every result, what it means, and what you can do about it.',
  },
  {
    emoji: '👨‍⚕️',
    audience: 'Clinicians',
    headline: 'Speed up report review',
    desc: 'Use Diagnyx as a first-pass assistant to flag abnormal values, surface root-cause hypotheses, and draft patient-facing summaries.',
  },
  {
    emoji: '🧬',
    audience: 'Health Tech Builders',
    headline: 'Embed AI interpretation in your app',
    desc: 'The FastAPI backend and LangGraph workflow are modular and extensible — drop it into your health platform as a microservice.',
  },
  {
    emoji: '🎓',
    audience: 'Medical Students',
    headline: 'Learn clinical reasoning interactively',
    desc: 'See how an AI reasons from raw lab values to root causes and dietary interventions — a live case study for every upload.',
  },
]

export default function UseCases() {
  return (
    <section id="use-cases" className="py-24 bg-[#F7FAFB]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-[#1D9E75] uppercase tracking-widest">Use Cases</span>
          <h2 className="mt-3 text-4xl font-bold text-[#0F3D2A] tracking-tight">
            Built for everyone in{' '}
            <span className="gradient-text">the care journey</span>
          </h2>
          <p className="mt-4 text-[#888780] max-w-xl mx-auto">
            Whether you're a patient, clinician, developer, or student — Diagnyx meets you where you are.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {cases.map(c => (
            <div
              key={c.audience}
              className="card-hover bg-white border border-[#D3D1C7] rounded-2xl p-7 flex gap-5"
            >
              <span className="text-3xl shrink-0 mt-0.5">{c.emoji}</span>
              <div>
                <span className="text-xs font-medium text-[#1D9E75] uppercase tracking-wider">{c.audience}</span>
                <h3 className="text-[#2C2C2A] font-semibold mt-1 mb-2">{c.headline}</h3>
                <p className="text-sm text-[#888780] leading-relaxed">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
