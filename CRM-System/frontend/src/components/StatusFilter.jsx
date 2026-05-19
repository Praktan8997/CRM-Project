const STATUSES = ['All', 'Open', 'In Progress', 'Closed']

export default function StatusFilter({ value, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {STATUSES.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s === 'All' ? '' : s)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            (value === '' && s === 'All') || value === s
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
