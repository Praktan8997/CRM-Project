import { useState, useEffect } from 'react'
import { getTicket, updateTicket } from '../api.js'

const STATUSES = ['Open', 'In Progress', 'Closed']

const STATUS_STYLES = {
  Open: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
  'In Progress': 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  Closed: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
}

const STATUS_GLOWS = {
  Open: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)] animate-pulse',
  'In Progress': 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse',
  Closed: 'bg-emerald-400',
}

function Field({ label, value, icon }) {
  return (
    <div className="flex gap-3 bg-black/20 p-4 rounded-xl border border-white/5">
      {icon && (
        <span className="material-symbols-outlined text-[#bbc9cd]/50 text-[20px] select-none mt-0.5">{icon}</span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-[#bbc9cd]/50 uppercase tracking-widest font-geist mb-1">{label}</p>
        <p className="text-sm text-[#dde4e5] break-words leading-relaxed font-medium">{value || '—'}</p>
      </div>
    </div>
  )
}

export default function TicketDetail({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Update form state
  const [newStatus, setNewStatus] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getTicket(ticketId)
        setTicket(data)
        setNewStatus(data.status)
        setNotes(data.notes || '')
      } catch {
        setError('Ticket not found.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [ticketId])

  async function handleUpdate(e) {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')
    try {
      await updateTicket(ticketId, { status: newStatus, notes })
      setTicket((prev) => ({ ...prev, status: newStatus, notes }))
      setSaveMsg('Ticket updated successfully!')
    } catch (err) {
      setSaveMsg(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-24 glass-card rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined animate-spin text-cyan-400 text-3xl">sync</span>
        <p className="text-xs text-[#bbc9cd]/60 uppercase tracking-widest font-geist">Fetching ticket data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20 glass-card rounded-2xl border border-white/5 max-w-md mx-auto">
        <span className="material-symbols-outlined text-rose-500 text-4xl mb-3">error</span>
        <p className="text-[#bbc9cd] text-sm mb-6">{error}</p>
        <button
          onClick={onBack}
          className="bg-white/5 hover:bg-white/10 text-[#dde4e5] border border-white/10 px-5 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all"
        >
          Back to Tickets
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#bbc9cd]/60 hover:text-cyan-400 transition-colors duration-200"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Back to tickets queue
      </button>

      {/* Split Pane Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Ticket Info (Col Span 2) */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/5 p-6 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-5">
            <div>
              <p className="text-[10px] text-cyan-400 font-bold font-geist tracking-wider uppercase mb-1">
                Ticket ID: #{ticket.ticket_id.split('-').pop()}
              </p>
              <h2 className="text-lg font-bold text-[#dde4e5] leading-tight">{ticket.subject}</h2>
            </div>
            
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border tracking-wider uppercase ${STATUS_STYLES[ticket.status] || 'border-white/10 bg-white/5 text-[#bbc9cd]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_GLOWS[ticket.status] || 'bg-[#bbc9cd]'}`}></span>
              {ticket.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Customer Name" value={ticket.customer_name} icon="person" />
            <Field label="Customer Email" value={ticket.customer_email} icon="mail" />
            <div className="sm:col-span-2">
              <Field label="Issue Description" value={ticket.description} icon="description" />
            </div>
            {ticket.notes && (
              <div className="sm:col-span-2">
                <Field label="Staff Internal Notes" value={ticket.notes} icon="rate_review" />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Update Action Card (Col Span 1) */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-[#dde4e5] uppercase tracking-wider font-geist">Update Status</h3>
            <p className="text-[11px] text-[#bbc9cd]/50 mt-1">Change ticket resolution progress and log activities.</p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#bbc9cd]/70 mb-2 font-geist">Select Status</label>
              <div className="relative">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/35 border border-white/10 rounded-xl text-sm text-[#dde4e5] focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all appearance-none cursor-pointer"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-[#0e1416] text-[#dde4e5]">
                      {s}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#bbc9cd]/60">
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#bbc9cd]/70 mb-2 font-geist">Activity Logs / Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Log progress, troubleshooting actions taken, or steps to resolve..."
                className="w-full px-4 py-2.5 bg-black/35 border border-white/10 rounded-xl text-sm text-[#dde4e5] placeholder-[#bbc9cd]/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none"
              />
            </div>

            {saveMsg && (
              <div className={`flex items-center gap-2 text-xs px-4 py-3 rounded-xl border ${
                saveMsg.toLowerCase().includes('success')
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : 'text-red-400 bg-red-500/10 border-red-500/20'
              }`}>
                <span className="material-symbols-outlined text-[16px]">
                  {saveMsg.toLowerCase().includes('success') ? 'check_circle' : 'error'}
                </span>
                <span>{saveMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-bold py-2.5 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-geist"
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
