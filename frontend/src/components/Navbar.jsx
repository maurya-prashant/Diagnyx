import { useState } from 'react'

const links = ['Features', 'How It Works', 'Use Cases', 'Tech Stack']

export default function Navbar({ onGetStarted }) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">D</span>
          </div>
          <span className="font-semibold text-black text-lg tracking-tight">Diagnyx</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-neutral-500 hover:text-black transition-colors">
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={onGetStarted} className="btn-premium">
            Get Started
          </button>
        </div>

        <button className="md:hidden p-2 text-neutral-500" onClick={() => setOpen(o => !o)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-b border-neutral-100 px-6 py-6 flex flex-col gap-4 animate-in">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-neutral-500" onClick={() => setOpen(false)}>
              {l}
            </a>
          ))}
          <button onClick={onGetStarted} className="btn-premium w-full">Get Started</button>
        </div>
      )}
    </nav>
  )
}
