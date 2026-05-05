export default function Footer() {
  return (
    <footer className="bg-white py-24 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">D</span>
              </div>
              <span className="font-semibold text-black text-lg tracking-tight">Diagnyx</span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              Professional-grade medical report interpretation. Understand your health, not just your numbers.
            </p>
          </div>

          {[
            { heading: 'Product', links: ['Features', 'How It Works', 'Use Cases'] },
            { heading: 'Support', links: ['PDF', 'DOCX', 'PNG / JPG'] },
            { heading: 'Resources', links: ['API Docs', 'GitHub', 'Backend'] },
          ].map(col => (
            <div key={col.heading}>
              <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-8">{col.heading}</h4>
              <ul className="space-y-4">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm font-medium text-neutral-500 hover:text-black transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-12 border-t border-neutral-50 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">
            © {new Date().getFullYear()} Diagnyx. Not a medical device.
          </p>
          <div className="flex gap-8">
             <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest cursor-pointer hover:text-black transition-colors">Privacy</span>
             <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest cursor-pointer hover:text-black transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
