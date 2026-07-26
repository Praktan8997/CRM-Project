const STATUSES = ['All', 'Open', 'In Progress', 'Closed']

export default function StatusFilter({ value, onChange }) {
  const getActiveStyle = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.12)]'
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.12)]'
      case 'Closed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.12)]'
      default: // All
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.12)]'
    }
  }

  return (
    <div className="flex gap-2.5 flex-wrap">
      {STATUSES.map((s) => {
        const isActive = (value === '' && s === 'All') || value === s
        return (
          <button
            key={s}
            onClick={() => onChange(s === 'All' ? '' : s)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wider uppercase border transition-all duration-300 active:scale-[0.97] ${
              isActive
                ? getActiveStyle(s)
                : 'bg-white/5 text-[#bbc9cd]/70 border-white/5 hover:bg-white/10 hover:text-[#dde4e5]'
            }`}
          >
            {s}
          </button>
        )
      })}
    </div>
  )
}
