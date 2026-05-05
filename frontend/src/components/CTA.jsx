export default function CTA({ onGetStarted }) {
  return (
    <section id="get-started" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-neutral-900 rounded-[3rem] p-16 lg:p-24 text-center overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2" />
          
          <div className="relative z-10">
            <span className="section-label text-neutral-500 mb-8">Get Started</span>
            <h2 className="text-4xl lg:text-6xl font-semibold tracking-tight text-white mb-10">
              Ready to decode <br /> your report?
            </h2>
            
            <p className="text-neutral-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Upload any lab report and get a structured, AI-powered interpretation in seconds. Free to use, no account required.
            </p>

            <button onClick={onGetStarted} className="bg-white text-black px-12 py-4 rounded-full text-lg font-semibold hover:bg-neutral-200 transition-all active:scale-95">
              Start Analysis Now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
