const stack = {
  Frontend: ['React 18', 'Vite 5', 'Tailwind CSS'],
  Backend: ['FastAPI', 'LangGraph', 'LangChain'],
  Intelligence: ['Pydantic', 'Tesseract OCR', 'pypdf'],
}

export default function TechStack() {
  return (
    <section id="tech-stack" className="py-32 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-24">
          <span className="section-label text-neutral-500">Infrastructure</span>
          <h2 className="text-4xl font-semibold tracking-tight text-white mb-6">Reliable by design.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-16">
          {Object.entries(stack).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-8">{category}</h3>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item} className="flex items-center gap-4 group cursor-default">
                    <div className="w-1.5 h-1.5 bg-neutral-700 group-hover:bg-white transition-colors" />
                    <span className="text-xl font-medium tracking-tight text-neutral-400 group-hover:text-white transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
