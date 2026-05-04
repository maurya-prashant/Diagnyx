import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section id="get-started" className="py-24 bg-[#0D3D6E]">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="relative bg-[#164E82] border border-[#85B7EB]/20 rounded-3xl p-12">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-40 bg-[#185FA5]/20 rounded-full blur-[80px]" />
          </div>

          <div className="relative">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-[#5DCAA5] bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-full px-3 py-1 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5] animate-pulse" />
              Free to use · No account required
            </span>

            <h2 className="text-4xl font-bold text-white tracking-tight mb-4">
              Ready to decode your{' '}
              <span className="gradient-text">medical report?</span>
            </h2>

            <p className="text-[#85B7EB] mb-8 max-w-lg mx-auto">
              Upload any lab report and get a structured, AI-powered interpretation in seconds.
              Supports PDF, DOCX, PNG, JPG, and TXT.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/app" className="text-white font-semibold px-8 py-3.5 rounded-xl text-sm inline-flex items-center gap-2 transition-all hover:-translate-y-0.5" style={{background: 'linear-gradient(135deg, #5DCAA5, #1D9E75)', boxShadow: '0 4px 16px rgba(93,202,165,0.3)'}}>
                Upload a Report Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </Link>
              <a href="https://github.com" className="text-sm font-medium text-[#E6F1FB] border border-[#D3D1C7]/30 hover:border-[#185FA5]/50 hover:text-white px-8 py-3.5 rounded-xl transition-all inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
              </a>
            </div>

            <p className="mt-8 text-xs text-[#888780]/70 max-w-md mx-auto leading-relaxed">
              Medical disclaimer: Diagnyx is an assistive interpretation tool, not a diagnostic system.
              Outputs should be reviewed by a qualified healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
