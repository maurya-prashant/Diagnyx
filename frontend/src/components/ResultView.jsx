import ReactMarkdown from 'react-markdown'

/* ── Status badge ─────────────────────────────────────────────────── */
const STATUS_STYLES = {
  High:       'bg-red-50 text-red-700 border-red-200',
  Elevated:   'bg-orange-50 text-orange-700 border-orange-200',
  Critical:   'bg-red-100 text-red-800 border-red-300 font-extrabold',
  Low:        'bg-yellow-50 text-yellow-700 border-yellow-200',
  Borderline: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  Normal:     'bg-green-50 text-green-700 border-green-200',
  Optimal:    'bg-green-50 text-green-700 border-green-200',
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? 'bg-neutral-100 text-neutral-500 border-neutral-200'
  return (
    <span className={`text-[10px] font-bold uppercase border px-2 py-0.5 rounded-md whitespace-nowrap ${style}`}>
      {status}
    </span>
  )
}

/* Highlight table row by status */
function rowHighlight(status) {
  if (status === 'Critical')   return 'bg-red-50/60'
  if (status === 'High' || status === 'Elevated') return 'bg-orange-50/40'
  if (status === 'Low' || status === 'Borderline') return 'bg-yellow-50/40'
  return ''
}

/* ── Markdown prose renderer ──────────────────────────────────────── */
function Prose({ children, dark = false }) {
  const text     = dark ? 'text-neutral-200' : 'text-neutral-700'
  const heading  = dark ? 'text-white'       : 'text-black'
  const subhead  = dark ? 'text-neutral-300' : 'text-neutral-800'
  const em_text  = dark ? 'text-neutral-400' : 'text-neutral-600'
  const strong_c = dark ? 'text-white'       : 'text-black'

  return (
    <div>
      <ReactMarkdown
        components={{
          p:      ({ children }) => <p className={`text-sm leading-relaxed mb-2 last:mb-0 ${text}`}>{children}</p>,
          strong: ({ children }) => <strong className={`font-semibold ${strong_c}`}>{children}</strong>,
          em:     ({ children }) => <em className={`italic ${em_text}`}>{children}</em>,
          ul:     ({ children }) => <ul className={`list-disc list-inside space-y-1 mb-2 text-sm ${text}`}>{children}</ul>,
          ol:     ({ children }) => <ol className={`list-decimal list-inside space-y-1 mb-2 text-sm ${text}`}>{children}</ol>,
          li:     ({ children }) => <li className="leading-relaxed">{children}</li>,
          h1:     ({ children }) => <h1 className={`text-base font-semibold mb-1 mt-3 first:mt-0 ${heading}`}>{children}</h1>,
          h2:     ({ children }) => <h2 className={`text-sm font-semibold mb-1 mt-3 first:mt-0 ${heading}`}>{children}</h2>,
          h3:     ({ children }) => <h3 className={`text-sm font-semibold mb-1 mt-2 first:mt-0 ${subhead}`}>{children}</h3>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

/* ── Main shared result view ──────────────────────────────────────── */
export default function ResultView({ result, onReset, compact = false }) {
  const hasLab = result.lab_results?.length > 0

  return (
    <div className="space-y-6">

      {/* Header row */}
      <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
        <div>
          <span className="section-label mb-0.5">Analysis Complete</span>
          <p className="text-xs text-neutral-400 font-medium">AI-generated medical report interpretation</p>
        </div>
        <button
          onClick={onReset}
          className="btn-outline text-xs py-2 px-4"
        >
          New Analysis
        </button>
      </div>

      {/* Summary */}
      <section>
        <span className="section-label">Summary</span>
        <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
          <Prose>{result.summary}</Prose>
        </div>
      </section>

      {/* Lab Results */}
      {hasLab && (
        <section>
          <span className="section-label">Lab Results</span>
          <div className="border border-neutral-100 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-100">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Test</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Value</th>
                  {result.lab_results.some(r => r.reference_range) && (
                    <th className="px-5 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest hidden sm:table-cell">Reference</th>
                  )}
                  <th className="px-5 py-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {result.lab_results.map((r, i) => (
                  <tr key={i} className={`transition-colors ${rowHighlight(r.status)}`}>
                    <td className="px-5 py-3.5 font-semibold text-black text-sm">{r.test}</td>
                    <td className="px-5 py-3.5 font-mono text-neutral-600 text-sm">
                      {r.value}{r.unit ? ` ${r.unit}` : ''}
                    </td>
                    {result.lab_results.some(row => row.reference_range) && (
                      <td className="px-5 py-3.5 text-neutral-400 text-xs hidden sm:table-cell">
                        {r.reference_range ?? '—'}
                      </td>
                    )}
                    <td className="px-5 py-3.5 text-right">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Insights */}
      {result.root_causes && (
        <section>
          <span className="section-label">Insights & Root Causes</span>
          <div className="bg-neutral-900 rounded-2xl p-5 text-white">
            <Prose dark>
              {result.root_causes}
            </Prose>
          </div>
        </section>
      )}

      {/* Nutrition */}
      {result.diet && (
        <section>
          <span className="section-label">Nutrition & Diet Recommendations</span>
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100">
            <Prose>{result.diet}</Prose>
          </div>
        </section>
      )}

    </div>
  )
}
