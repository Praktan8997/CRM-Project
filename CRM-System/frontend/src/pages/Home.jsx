import { useState, useEffect, useCallback } from 'react'
import { getTickets } from '../api.js'
import SearchBar from '../components/SearchBar.jsx'
import StatusFilter from '../components/StatusFilter.jsx'
import TicketList from '../components/TicketList.jsx'
import TicketForm from '../components/TicketForm.jsx'

export default function Home({ onViewTicket }) {
  const [tickets, setTickets] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTickets(status, search)
      setTickets(data)
    } catch {
      setTickets([])
    } finally {
      setLoading(false)
    }
  }, [status, search])

  // Debounce search — wait 400ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets()
    }, 400)
    return () => clearTimeout(timer)
  }, [fetchTickets])

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Support Tickets</h1>
          <p className="text-sm text-slate-500 mt-0.5">{tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {showForm ? '✕ Cancel' : '+ New Ticket'}
        </button>
      </div>

      {/* Create Ticket Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">Create New Ticket</h2>
          <TicketForm
            onCreated={() => {
              setShowForm(false)
              fetchTickets()
            }}
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3">
        <SearchBar value={search} onChange={setSearch} />
        <StatusFilter value={status} onChange={setStatus} />
      </div>

      {/* Ticket List */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Loading tickets...</div>
      ) : (
        <TicketList tickets={tickets} onView={onViewTicket} />
      )}
    </div>
  )
}
