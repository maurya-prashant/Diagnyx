const testimonials = [
  {
    quote: "I uploaded my blood panel and within seconds had a clear explanation. Specific, not generic.",
    name: 'Sarah M.',
    role: 'Patient',
  },
  {
    quote: "As a GP, I use Diagnyx to generate first-draft summaries. Saves real clinical time.",
    name: 'Dr. James K.',
    role: 'General Practitioner',
  },
  {
    quote: "The LangGraph architecture is clean and extensible. Modular design is key for us.",
    name: 'Priya R.',
    role: 'Health Tech Engineer',
  },
]

export default function Testimonials() {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-24">
          <span className="section-label">Testimonials</span>
          <h2 className="h2-premium mb-6">Trusted by professionals.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {testimonials.map(t => (
            <div key={t.name} className="flex flex-col h-full">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-black" />
                ))}
              </div>
              <p className="text-xl font-medium text-black leading-snug mb-8 flex-1">"{t.quote}"</p>
              <div>
                <p className="text-sm font-semibold text-black">{t.name}</p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
