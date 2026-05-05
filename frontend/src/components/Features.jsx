const features = [
  {
    title: 'Multi-Format Ingestion',
    desc: 'Upload PDF, DOCX, PNG, JPG, or TXT reports. Diagnyx extracts text automatically via specialized parsers.',
  },
  {
    title: 'Structured Extraction',
    desc: 'Pulls lab results, medications, and diagnoses into a clean schema with abnormal value flags.',
  },
  {
    title: 'Clinical Interpretation',
    desc: 'Translates clinical jargon into plain language your patients can actually understand and act on.',
  },
  {
    title: 'Root Cause Analysis',
    desc: 'The AI reasons over abnormal values to surface possible medical root causes and clinical context.',
  },
  {
    title: 'Nutrition Guidance',
    desc: 'Generates a tailored diet plan based on abnormal labs and root causes, with safety-checked recommendations.',
  },
  {
    title: 'Agentic Safety Audit',
    desc: 'A built-in critic LLM audits every output for contradictions before finalizing the report.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-24">
          <span className="section-label">Capabilities</span>
          <h2 className="h2-premium mb-6">Built for precision.</h2>
          <p className="p-premium">
            A full agentic pipeline — from raw file to actionable health insights — with zero manual steps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {features.map((f, i) => (
            <div key={f.title} className="group">
              <div className="text-xs font-bold text-neutral-200 mb-6 group-hover:text-black transition-colors">
                0{i + 1}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black tracking-tight">{f.title}</h3>
              <p className="text-neutral-500 leading-relaxed text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
