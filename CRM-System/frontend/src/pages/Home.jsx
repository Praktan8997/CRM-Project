import { useState, useEffect, useCallback } from 'react'
import { getTickets } from '../api.js'
import SearchBar from '../components/SearchBar.jsx'
import StatusFilter from '../components/StatusFilter.jsx'
import TicketList from '../components/TicketList.jsx'

export default function Home({ onViewTicket, onRequestNewTicket }) {
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState({ open: 0, inProgress: 0, closed: 0 })
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTickets(status, search)
      setTickets(data)

      // Fetch all to compute overall database stats
      const allData = await getTickets('', '')
      const computed = allData.reduce(
        (acc, t) => {
          if (t.status === 'Open') acc.open++
          else if (t.status === 'In Progress') acc.inProgress++
          else if (t.status === 'Closed') acc.closed++
          return acc
        },
        { open: 0, inProgress: 0, closed: 0 }
      )
      setStats(computed)
    } catch {
      setTickets([])
    } finally {
      setLoading(false)
    }
  }, [status, search])

  // Reload handler registered globally for modal access
  useEffect(() => {
    window.onTicketCreated = fetchTickets
    return () => {
      window.onTicketCreated = null
    }
  }, [fetchTickets])

  // Debounce search — wait 400ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets()
    }, 400)
    return () => clearTimeout(timer)
  }, [fetchTickets])

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Page Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#dde4e5] uppercase font-geist">Support Queue</h1>
          <p className="text-xs text-[#bbc9cd]/50 mt-1 font-geist uppercase tracking-wider">
            {tickets.length} record{tickets.length !== 1 ? 's' : ''} matched
          </p>
        </div>
        <button
          onClick={onRequestNewTicket}
          className="bg-cyan-400 hover:bg-cyan-300 text-black px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          New Ticket
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Open Tickets */}
        <div className="glass-card neon-glow-cyan rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-300"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#bbc9cd]/60 font-geist">Open Tickets</p>
              <h3 className="text-3xl font-geist font-bold text-cyan-400 mt-2">{stats.open}</h3>
            </div>
            <div className="bg-cyan-500/10 p-2.5 rounded-xl text-cyan-400 border border-cyan-500/15">
              <span className="material-symbols-outlined text-[20px] block">pending_actions</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 relative z-10">
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +5%
            </span>
            <span className="text-[#bbc9cd]/40 text-[10px] uppercase tracking-wider font-geist">vs last 24h</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="glass-card neon-glow-amber rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-300"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#bbc9cd]/60 font-geist">In Progress</p>
              <h3 className="text-3xl font-geist font-bold text-amber-400 mt-2">{stats.inProgress}</h3>
            </div>
            <div className="bg-amber-500/10 p-2.5 rounded-xl text-amber-400 border border-amber-500/15">
              <span className="material-symbols-outlined text-[20px] block animate-spin" style={{ animationDuration: '6s' }}>sync</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 relative z-10">
            <span className="text-amber-400 text-xs font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_flat</span> 0%
            </span>
            <span className="text-[#bbc9cd]/40 text-[10px] uppercase tracking-wider font-geist">Stable load</span>
          </div>
        </div>

        {/* Resolved */}
        <div className="glass-card neon-glow-emerald rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-300"></div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#bbc9cd]/60 font-geist">Resolved</p>
              <h3 className="text-3xl font-geist font-bold text-emerald-400 mt-2">{stats.closed}</h3>
            </div>
            <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400 border border-emerald-500/15">
              <span className="material-symbols-outlined text-[20px] block">check_circle</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 relative z-10">
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +12%
            </span>
            <span className="text-[#bbc9cd]/40 text-[10px] uppercase tracking-wider font-geist">efficiency up</span>
          </div>
        </div>

      </div>

      {/* Filters (Combined Search + Status Filter) */}
      <div className="glass-card rounded-2xl p-4.5 space-y-4">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <StatusFilter value={status} onChange={setStatus} />
        </div>
      </div>

      {/* Ticket List Table */}
      {loading ? (
        <div className="text-center py-24 glass-card rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined animate-spin text-cyan-400 text-3xl">sync</span>
          <p className="text-xs text-[#bbc9cd]/60 uppercase tracking-widest font-geist">Syncing with server...</p>
        </div>
      ) : (
        <TicketList tickets={tickets} onView={onViewTicket} />
      )}
    </div>
  )
}
