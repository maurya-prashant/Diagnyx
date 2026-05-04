export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-[#1D9E75] flex items-center justify-center text-white font-bold text-sm">Dx</span>
              <span className="font-semibold text-white text-lg tracking-tight">Diagnyx</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              AI-powered medical report interpretation. Understand your labs, not just your numbers.
            </p>
          </div>

          {[
            { heading: 'Product', links: ['Features', 'How It Works', 'Use Cases', 'Tech Stack'] },
            { heading: 'Supported Formats', links: ['PDF', 'DOCX', 'PNG / JPG / JPEG', 'TXT'] },
            { heading: 'Resources', links: ['API Docs (Swagger)', 'GitHub', 'FastAPI Backend', 'LangGraph Workflow'] },
          ].map(col => (
            <div key={col.heading}>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-sm text-white/50 hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Diagnyx. Not a medical device. For informational use only.</p>
          <p className="text-xs text-white/20">Built with React · Vite · FastAPI · LangGraph</p>
        </div>
      </div>
    </footer>
  )
}
