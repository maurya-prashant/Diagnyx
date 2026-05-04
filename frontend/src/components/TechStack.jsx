const stack = {
  Frontend: [
    { name: 'React 18',     color: 'text-[#1D9E75] bg-[#1D9E75]/15 border-[#1D9E75]/25' },
    { name: 'Vite 5',       color: 'text-[#5DCAA5] bg-[#5DCAA5]/15 border-[#5DCAA5]/25' },
    { name: 'Tailwind CSS', color: 'text-[#7ECFB3] bg-[#7ECFB3]/15 border-[#7ECFB3]/25' },
  ],
  Backend: [
    { name: 'FastAPI',   color: 'text-[#1D9E75] bg-[#1D9E75]/15 border-[#1D9E75]/25' },
    { name: 'LangGraph', color: 'text-[#5DCAA5] bg-[#5DCAA5]/15 border-[#5DCAA5]/25' },
    { name: 'LangChain', color: 'text-[#7ECFB3] bg-[#7ECFB3]/15 border-[#7ECFB3]/25' },
    { name: 'Pydantic',  color: 'text-[#E24B4A] bg-[#E24B4A]/15 border-[#E24B4A]/25' },
    { name: 'Uvicorn',   color: 'text-white bg-white/10 border-white/20' },
  ],
  'AI & Parsing': [
    { name: 'Tesseract OCR', color: 'text-[#E24B4A] bg-[#E24B4A]/15 border-[#E24B4A]/25' },
    { name: 'pypdf',         color: 'text-white/70 bg-white/10 border-white/15' },
    { name: 'python-docx',   color: 'text-white/70 bg-white/10 border-white/15' },
  ],
}

export default function TechStack() {
  return (
    <section id="tech-stack" className="py-24 bg-[#111111]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-[#5DCAA5] uppercase tracking-widest">Tech Stack</span>
          <h2 className="mt-3 text-4xl font-bold text-white tracking-tight">
            Built on{' '}
            <span className="gradient-text">battle-tested tools</span>
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Modern, open-source, and production-ready — every layer of the stack is chosen for reliability and extensibility.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(stack).map(([category, items]) => (
            <div key={category} className="bg-white/8 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map(item => (
                  <span key={item.name} className={`text-xs font-medium border rounded-full px-3 py-1 ${item.color}`}>
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
