const testimonials = [
  {
    quote:
      "I uploaded my blood panel and within seconds had a clear explanation of every abnormal value. The diet recommendations were specific to my actual results — not generic advice.",
    name: 'Sarah M.',
    role: 'Patient, Type 2 Diabetes Management',
    initials: 'SM',
    color: 'bg-[#1D9E75]',
  },
  {
    quote:
      "As a GP, I use Diagnyx to generate first-draft patient summaries. The critic loop catches inconsistencies I'd otherwise have to manually review. It's saved me real time.",
    name: 'Dr. James K.',
    role: 'General Practitioner',
    initials: 'JK',
    color: 'bg-[#0F6E56]',
  },
  {
    quote:
      "The LangGraph architecture is clean and extensible. I integrated the FastAPI backend into our health platform in an afternoon. The modular node design made customization straightforward.",
    name: 'Priya R.',
    role: 'Health Tech Engineer',
    initials: 'PR',
    color: 'bg-[#5DCAA5]',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#F7FAFB]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-[#1D9E75] uppercase tracking-widest">Testimonials</span>
          <h2 className="mt-3 text-4xl font-bold text-[#0F3D2A] tracking-tight">
            Trusted by patients{' '}
            <span className="gradient-text">and clinicians</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map(t => (
            <div
              key={t.name}
              className="card-hover bg-white border border-[#D3D1C7] rounded-2xl p-6 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i} className="text-[#BA7517] text-sm">{s}</span>
                ))}
              </div>

              <p className="text-sm text-[#2C2C2A] leading-relaxed flex-1 mb-6">"{t.quote}"</p>

              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2C2C2A]">{t.name}</p>
                  <p className="text-xs text-[#888780]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
