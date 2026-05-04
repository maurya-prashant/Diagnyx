import { useState } from 'react'

const links = ['Features', 'How It Works', 'Use Cases', 'Tech Stack']

function MenuIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export default function Navbar({ onGetStarted }) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#111111]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-[#1D9E75] flex items-center justify-center text-white font-bold text-sm">Dx</span>
          <span className="font-semibold text-white text-lg tracking-tight">Diagnyx</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-white/60 hover:text-white transition-colors">
                {l}
              </a>
            </li>
          ))}
        </ul>

        <button onClick={onGetStarted} className="hidden md:inline-flex btn-primary text-white text-sm font-medium px-4 py-2 rounded-lg">
          Get Started
        </button>

        <button className="md:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#111111] px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-white/60 hover:text-white transition-colors" onClick={() => setOpen(false)}>
              {l}
            </a>
          ))}
          <button onClick={onGetStarted} className="btn-primary text-white text-sm font-medium px-4 py-2 rounded-lg text-center">Get Started</button>
        </div>
      )}
    </nav>
  )
}
