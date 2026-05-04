const steps = [
  {
    num: '01',
    title: 'Upload Your Report',
    desc: 'Drop a PDF, DOCX, image, or text file. The ingestion node extracts raw text using the right parser for your file type.',
    badge: 'Ingestion',
  },
  {
    num: '02',
    title: 'Medical Gate Check',
    desc: 'The LLM verifies the document is a genuine medical report before any processing begins, rejecting non-medical files immediately.',
    badge: 'Gate',
  },
  {
    num: '03',
    title: 'Structured Extraction',
    desc: 'Lab results, medications, and diagnoses are pulled into a typed schema with abnormal value flags and units.',
    badge: 'Extract',
  },
  {
    num: '04',
    title: 'Parallel AI Analysis',
    desc: 'Two nodes run in parallel: one generates a patient-friendly explanation, the other reasons over possible root causes.',
    badge: 'Explain + Root Cause',
  },
  {
    num: '05',
    title: 'Diet Plan + Safety Check',
    desc: 'A personalized nutrition plan is built, then a rule-based safety node checks for contraindicated foods against your lab values.',
    badge: 'Diet + Safety',
  },
  {
    num: '06',
    title: 'Critic Audit & Revision',
    desc: 'An LLM auditor reviews the full output for contradictions and gaps. If issues are found, the diet node revises — up to 3 times.',
    badge: 'Critic Loop',
  },
  {
    num: '07',
    title: 'Synthesized Report',
    desc: 'A final JSON report is assembled with your lab table, summary, key takeaways, root causes, and nutrition guidance.',
    badge: 'Synthesis',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#111111]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-[#5DCAA5] uppercase tracking-widest">How It Works</span>
          <h2 className="mt-3 text-4xl font-bold text-white tracking-tight">
            An agentic pipeline,{' '}
            <span className="gradient-text">step by step</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Diagnyx runs a LangGraph workflow where each node has a single responsibility — and the critic loop ensures quality before delivery.
          </p>
        </div>

        <div className="relative">
          <div className="space-y-6">
            {steps.map(s => (
              <div key={s.num} className="card-hover relative flex gap-6 bg-white/8 border border-white/10 rounded-2xl p-6">
                <div className="shrink-0 w-14 h-14 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                  <span className="text-[10px] text-white/50 font-mono">{s.num}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <h3 className="text-white font-semibold">{s.title}</h3>
                    <span className="text-[10px] font-mono text-[#5DCAA5] bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-full px-2 py-0.5">{s.badge}</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
