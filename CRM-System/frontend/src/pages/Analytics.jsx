import { useState, useEffect } from 'react'
import { getAnalytics } from '../api.js'

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const stats = await getAnalytics()
        setData(stats)
      } catch (err) {
        setError('Failed to fetch analytics.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-24 glass-card rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined animate-spin text-cyan-400 text-3xl">sync</span>
        <p className="text-xs text-[#bbc9cd]/60 uppercase tracking-widest font-geist">Syncing system analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20 glass-card rounded-2xl border border-white/5 max-w-md mx-auto">
        <span className="material-symbols-outlined text-rose-500 text-4xl mb-3">error</span>
        <p className="text-[#bbc9cd] text-sm">{error}</p>
      </div>
    )
  }

  // Calculate chart metrics
  const maxCount = Math.max(...data.tickets_by_date.map(d => d.count), 1)

  // Circular progress math
  const radius = 55
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (data.resolution_rate / 100) * circumference

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#dde4e5] uppercase font-geist">Performance Analytics</h1>
        <p className="text-xs text-[#bbc9cd]/50 mt-1 font-geist uppercase tracking-wider">
          System-wide queue telemetry and resolution efficiency rates
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total volume */}
        <div className="glass-card rounded-xl p-4.5 relative overflow-hidden">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#bbc9cd]/50 font-geist">Total Ingested</p>
          <p className="text-2xl font-bold font-geist mt-1.5 text-[#dde4e5]">{data.total_tickets}</p>
        </div>

        {/* Open */}
        <div className="glass-card rounded-xl p-4.5 border-l-2 border-cyan-500/40">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#bbc9cd]/50 font-geist">Open Cases</p>
          <p className="text-2xl font-bold font-geist mt-1.5 text-cyan-400">{data.open_tickets}</p>
        </div>

        {/* In Progress */}
        <div className="glass-card rounded-xl p-4.5 border-l-2 border-amber-500/40">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#bbc9cd]/50 font-geist">Active Work</p>
          <p className="text-2xl font-bold font-geist mt-1.5 text-amber-400">{data.in_progress_tickets}</p>
        </div>

        {/* Closed */}
        <div className="glass-card rounded-xl p-4.5 border-l-2 border-emerald-500/40">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#bbc9cd]/50 font-geist">Resolved Cases</p>
          <p className="text-2xl font-bold font-geist mt-1.5 text-emerald-400">{data.closed_tickets}</p>
        </div>

      </div>

      {/* Analytics Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Column (Span 2) */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/5 p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h2 className="text-sm font-bold text-[#dde4e5] uppercase tracking-wider font-geist">Volume Trend</h2>
              <p className="text-[10px] text-[#bbc9cd]/50">Count of tickets opened during the last 7 calendar days.</p>
            </div>
            <span className="material-symbols-outlined text-[#bbc9cd]/40 select-none text-[20px]">calendar_today</span>
          </div>

          {/* Custom Pure HTML/CSS Bar Chart */}
          <div className="flex gap-4 items-end justify-between pt-6 px-2 h-56 border-b border-white/10 pb-2.5">
            {data.tickets_by_date.map((item) => {
              const heightPercent = (item.count / maxCount) * 100
              const formattedDate = new Date(item.date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
              })

              return (
                <div key={item.date} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                  
                  {/* Glowing Bar */}
                  <div className="w-full max-w-[36px] bg-slate-950/40 rounded-t-lg flex flex-col justify-end h-full">
                    <div
                      style={{ height: `${heightPercent || 5}%` }}
                      className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-lg transition-all duration-500 shadow-[0_0_12px_rgba(34,211,238,0.2)] group-hover:brightness-110 relative"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 border border-white/10 text-cyan-400 text-[10px] font-bold font-geist px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-xl z-20">
                        {item.count} TKT
                      </div>
                    </div>
                  </div>

                  {/* Label */}
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#bbc9cd]/50 font-geist text-center">
                    {formattedDate}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Resolution Rate SVG Chart (Span 1) */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-between min-h-[300px]">
          <div className="w-full flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h2 className="text-sm font-bold text-[#dde4e5] uppercase tracking-wider font-geist">Queue Velocity</h2>
              <p className="text-[10px] text-[#bbc9cd]/50">Ratio of cases solved.</p>
            </div>
            <span className="material-symbols-outlined text-[#bbc9cd]/40 select-none text-[20px]">speed</span>
          </div>

          {/* SVG Circular Meter */}
          <div className="relative flex items-center justify-center my-6">
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Track circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-white/5 fill-transparent"
                strokeWidth="7"
              />
              {/* Fill circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-emerald-400 fill-transparent transition-all duration-1000 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-bold font-geist text-emerald-400">{data.resolution_rate}%</span>
              <p className="text-[9px] uppercase tracking-widest text-[#bbc9cd]/50 font-geist font-semibold mt-0.5">RESOLVED</p>
            </div>
          </div>

          <div className="text-center text-xs text-[#bbc9cd]/60 px-2 leading-relaxed">
            Target SLA speed is <span className="text-emerald-400 font-semibold">80%</span>. Current performance is{' '}
            <span className={data.resolution_rate >= 80 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {data.resolution_rate >= 80 ? 'exceeding' : 'below'}
            </span>{' '}
            target thresholds.
          </div>
        </div>

      </div>
    </div>
  )
}
