const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Multi-Format Ingestion',
    desc: 'Upload PDF, DOCX, PNG, JPG, or TXT reports. Diagnyx extracts text via OCR, pypdf, or python-docx automatically.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: 'Structured Data Extraction',
    desc: 'Pulls lab results, medications, and diagnoses into a clean schema — including abnormal value flags and units.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: 'Patient-Friendly Explanations',
    desc: 'Translates clinical jargon into plain language your patients can actually understand and act on.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Root Cause Analysis',
    desc: 'The AI reasons over abnormal values to surface possible medical root causes and clinical context.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Personalized Nutrition Guidance',
    desc: 'Generates a tailored diet plan based on abnormal labs and root causes, with safety-checked food recommendations.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Agentic Safety Audit',
    desc: 'A built-in critic LLM audits every output for contradictions and unsafe diet items, looping up to 3 revisions before finalizing.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#E1F5EE]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-[#1D9E75] uppercase tracking-widest">Features</span>
          <h2 className="mt-3 text-4xl font-bold text-[#0F3D2A] tracking-tight">
            Everything your report needs,{' '}
            <span className="gradient-text">automated</span>
          </h2>
          <p className="mt-4 text-[#888780] max-w-xl mx-auto">
            A full agentic pipeline — from raw file to actionable health insights — with no manual steps required.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => (
            <div
              key={f.title}
              className="card-hover bg-white border border-[#D3D1C7] rounded-2xl p-6"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1D9E75]/10 text-[#1D9E75] flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="text-[#2C2C2A] font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-[#888780] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
