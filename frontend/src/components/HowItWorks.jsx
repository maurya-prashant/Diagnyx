const steps = [
  {
    num: '01',
    title: 'Upload Report',
    desc: 'The ingestion node extracts raw text using the right parser for your file type.',
  },
  {
    num: '02',
    title: 'Verification',
    desc: 'The LLM verifies the document is a genuine medical report before processing.',
  },
  {
    num: '03',
    title: 'Extraction',
    desc: 'Lab results and medications are pulled into a typed, structured schema.',
  },
  {
    num: '04',
    title: 'Reasoning',
    desc: 'Two nodes run in parallel: one for explanation, the other for root-cause analysis.',
  },
  {
    num: '05',
    title: 'Personalization',
    desc: 'A tailored nutrition plan is built and safety-checked against lab values.',
  },
  {
    num: '06',
    title: 'Audit',
    desc: 'An LLM auditor reviews the full output for contradictions and quality.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-24">
          <div className="max-w-xl">
            <span className="section-label">Workflow</span>
            <h2 className="h2-premium mb-6">The agentic pipeline.</h2>
            <p className="p-premium">
              Diagnyx runs a LangGraph workflow where each node has a single responsibility.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {steps.map(s => (
            <div key={s.num} className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
              <span className="text-xs font-bold text-neutral-300 mb-6 block font-mono tracking-widest">{s.num}</span>
              <h3 className="text-lg font-semibold mb-3 text-black">{s.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
