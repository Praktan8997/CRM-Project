import { useState, useEffect } from 'react'
import { getTicket, updateTicket } from '../api.js'

const STATUSES = ['Open', 'In Progress', 'Closed']

const STATUS_STYLES = {
  Open: 'bg-green-100 text-green-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Closed: 'bg-slate-100 text-slate-600',
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-slate-800">{value || '—'}</p>
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

  if (loading) return <div className="text-center py-20 text-slate-400 text-sm">Loading...</div>
  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500 text-sm mb-4">{error}</p>
      <button onClick={onBack} className="text-blue-600 hover:underline text-sm">← Back to tickets</button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button onClick={onBack} className="text-blue-600 hover:underline text-sm font-medium">
        ← Back to all tickets
      </button>

      {/* Ticket Info Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs text-slate-400 font-mono mb-1">{ticket.ticket_id}</p>
            <h2 className="text-xl font-bold text-slate-800">{ticket.subject}</h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[ticket.status] || 'bg-slate-100 text-slate-600'}`}>
            {ticket.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Customer Name" value={ticket.customer_name} />
          <Field label="Customer Email" value={ticket.customer_email} />
          <div className="sm:col-span-2">
            <Field label="Description" value={ticket.description} />
          </div>
          {ticket.notes && (
            <div className="sm:col-span-2">
              <Field label="Notes" value={ticket.notes} />
            </div>
          )}
        </div>
      </div>

      {/* Update Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-base font-semibold text-slate-800 mb-4">Update Ticket</h3>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Comments</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add internal notes about this ticket..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {saveMsg && (
            <p className={`text-sm px-3 py-2 rounded-lg ${saveMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {saveMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
