import { useState } from 'react'
import { createTicket } from '../api.js'

const INITIAL = { customer_name: '', customer_email: '', subject: '', description: '' }

export default function TicketForm({ onCreated }) {
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.customer_name || !form.customer_email || !form.subject || !form.description) {
      setError('All fields are required.')
      return
    }
    setLoading(true)
    try {
      const res = await createTicket(form)
      setSuccess(`Ticket created successfully! ID: ${res.ticket_id}`)
      setForm(INITIAL)
      if (onCreated) {
        // Wait briefly so they can see success message before closing modal
        setTimeout(() => {
          onCreated()
        }, 1000)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#bbc9cd]/70 mb-2 font-geist">Customer Name</label>
          <input
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 bg-black/35 border border-white/10 rounded-xl text-sm text-[#dde4e5] placeholder-[#bbc9cd]/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#bbc9cd]/70 mb-2 font-geist">Customer Email</label>
          <input
            name="customer_email"
            type="email"
            value={form.customer_email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full px-4 py-2.5 bg-black/35 border border-white/10 rounded-xl text-sm text-[#dde4e5] placeholder-[#bbc9cd]/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#bbc9cd]/70 mb-2 font-geist">Subject</label>
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder="Brief description of the issue"
          className="w-full px-4 py-2.5 bg-black/35 border border-white/10 rounded-xl text-sm text-[#dde4e5] placeholder-[#bbc9cd]/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#bbc9cd]/70 mb-2 font-geist">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Detailed description of the issue..."
          className="w-full px-4 py-2.5 bg-black/35 border border-white/10 rounded-xl text-sm text-[#dde4e5] placeholder-[#bbc9cd]/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200 resize-none"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{success}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-bold py-3 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 flex items-center justify-center gap-2 tracking-widest uppercase text-xs"
      >
        {loading ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
            Creating...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Ticket
          </>
        )}
      </button>
    </form>
  )
}
