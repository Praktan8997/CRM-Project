const STATUS_STYLES = {
  Open: 'bg-green-100 text-green-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Closed: 'bg-slate-100 text-slate-600',
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function TicketList({ tickets, onView }) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <div className="text-4xl mb-2">📭</div>
        <p className="text-sm">No tickets found</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm bg-white">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-left text-slate-500 uppercase text-xs tracking-wide">
            <th className="px-4 py-3">Ticket ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tickets.map((ticket) => (
            <tr key={ticket.ticket_id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-mono text-xs text-slate-500">{ticket.ticket_id}</td>
              <td className="px-4 py-3 font-medium text-slate-800">{ticket.customer_name}</td>
              <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{ticket.subject}</td>
              <td className="px-4 py-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[ticket.status] || 'bg-slate-100 text-slate-600'}`}>
                  {ticket.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500">{formatDate(ticket.created_at)}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onView(ticket.ticket_id)}
                  className="text-blue-600 hover:underline font-medium text-xs"
                >
                  View →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
