import { useState } from 'react'
import Home from './pages/Home.jsx'
import TicketDetail from './pages/TicketDetails.jsx'

export default function App() {
  // Simple client-side routing using state
  // page: 'home' | 'detail'
  const [page, setPage] = useState('home')
  const [selectedTicketId, setSelectedTicketId] = useState(null)

  function goToDetail(ticketId) {
    setSelectedTicketId(ticketId)
    setPage('detail')
  }

  function goHome() {
    setSelectedTicketId(null)
    setPage('home')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
        <button
          onClick={goHome}
          className="flex items-center gap-2 text-blue-600 font-semibold text-lg hover:text-blue-700"
        >
          <span className="text-2xl">🎫</span>
          CRM-SYSTEM
        </button>
        {page === 'detail' && (
          <span className="text-slate-400 text-sm">/ Ticket Detail</span>
        )}
      </nav>

      {/* Page content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {page === 'home' && <Home onViewTicket={goToDetail} />}
        {page === 'detail' && (
          <TicketDetail ticketId={selectedTicketId} onBack={goHome} />
        )}
      </main>
    </div>
  )
}
