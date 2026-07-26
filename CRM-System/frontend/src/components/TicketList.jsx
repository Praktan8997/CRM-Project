const STATUS_STYLES = {
  Open: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
  'In Progress': 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  Closed: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
}

const STATUS_INDICATORS = {
  Open: 'bg-cyan-400',
  'In Progress': 'bg-amber-400',
  Closed: 'bg-emerald-400',
}

const STATUS_GLOWS = {
  Open: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] animate-pulse',
  'In Progress': 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse',
  Closed: 'bg-emerald-400',
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function getAvatarStyle(name) {
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colors = [
    'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  ]
  return colors[hash % colors.length]
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function TicketList({ tickets, onView }) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-20 glass-card rounded-2xl border border-white/5">
        <div className="text-5xl mb-4 text-[#bbc9cd]/30 select-none">📭</div>
        <p className="text-sm text-[#bbc9cd]/60">No tickets found in records</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/5 glass-card">
      <table className="w-full text-sm border-collapse text-left">
        <thead>
          <tr className="bg-white/5 border-b border-white/10 text-[#bbc9cd]/80 uppercase text-[11px] font-bold tracking-widest font-geist">
            <th className="px-6 py-4">Ticket</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Subject</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {tickets.map((ticket) => (
            <tr key={ticket.ticket_id} className="hover:bg-white/5 transition-colors group relative">
              {/* Ticket ID with Left border indicator */}
              <td className="px-6 py-4.5 font-geist relative">
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r ${STATUS_INDICATORS[ticket.status] || 'bg-slate-400'}`}></div>
                <span className="text-cyan-400 font-bold text-xs tracking-wide">#{ticket.ticket_id.split('-').pop() || ticket.ticket_id}</span>
              </td>
              
              {/* Customer Avatar + Name */}
              <td className="px-6 py-4.5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-geist text-xs font-semibold ${getAvatarStyle(ticket.customer_name)}`}>
                    {getInitials(ticket.customer_name)}
                  </div>
                  <span className="font-semibold text-[#dde4e5]">{ticket.customer_name}</span>
                </div>
              </td>
              
              {/* Subject */}
              <td className="px-6 py-4.5 text-[#bbc9cd] max-w-xs truncate">{ticket.subject}</td>
              
              {/* Status Badge */}
              <td className="px-6 py-4.5">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wider uppercase ${STATUS_STYLES[ticket.status] || 'border-white/10 bg-white/5 text-[#bbc9cd]'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS_GLOWS[ticket.status] || 'bg-[#bbc9cd]'}`}></span>
                  {ticket.status}
                </span>
              </td>
              
              {/* Date */}
              <td className="px-6 py-4.5 text-[#bbc9cd]/60 text-xs">{formatDate(ticket.created_at)}</td>
              
              {/* View Action */}
              <td className="px-6 py-4.5">
                <div className="flex justify-center">
                  <button
                    onClick={() => onView(ticket.ticket_id)}
                    className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 font-bold px-4 py-1.5 rounded-xl text-[11px] tracking-widest transition-all duration-200 uppercase"
                  >
                    View
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
