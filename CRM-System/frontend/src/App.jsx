import { useState, useEffect } from 'react'
import Home from './pages/Home.jsx'
import TicketDetail from './pages/TicketDetails.jsx'
import TicketForm from './components/TicketForm.jsx'
import Analytics from './pages/Analytics.jsx'
import Team from './pages/Team.jsx'
import Settings from './pages/Settings.jsx'
import { getAdminProfile } from './api.js'

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function App() {
  const [page, setPage] = useState('home')
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [profile, setProfile] = useState(null)

  // Fetch admin settings profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getAdminProfile()
        setProfile(data)
      } catch {
        setProfile({
          name: 'Alex Rivera',
          role: 'Senior Lead',
          email: 'alex.rivera@supportflow.com'
        })
      }
    }
    loadProfile()
  }, [])

  function goToDetail(ticketId) {
    setSelectedTicketId(ticketId)
    setPage('detail')
  }

  function goHome() {
    setSelectedTicketId(null)
    setPage('home')
  }

  return (
    <div className="min-h-screen bg-[#0e1416] text-[#dde4e5] flex font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Sidebar Navigation */}
      <aside className="w-[260px] bg-slate-950/45 border-r border-white/5 flex flex-col py-6 backdrop-blur-xl z-30 shrink-0 h-screen sticky top-0">
        {/* Brand */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(34,211,238,0.25)] select-none animate-pulse">
            <span className="material-symbols-outlined text-white text-[20px]">confirmation_number</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-wider text-[#dde4e5] uppercase font-geist">SupportFlow</span>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest font-geist">Command Center</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 space-y-1">
          <button
            onClick={goHome}
            className={`w-full flex items-center gap-3 px-6 py-3 border-l-2 transition-all text-sm font-semibold ${
              page === 'home' || page === 'detail'
                ? 'bg-cyan-500/5 border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-[#bbc9cd]/60 hover:bg-white/5 hover:text-[#dde4e5]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">confirmation_number</span>
            <span>Tickets</span>
          </button>
          
          <button
            onClick={() => setPage('analytics')}
            className={`w-full flex items-center gap-3 px-6 py-3 border-l-2 transition-all text-sm font-semibold ${
              page === 'analytics'
                ? 'bg-cyan-500/5 border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-[#bbc9cd]/60 hover:bg-white/5 hover:text-[#dde4e5]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">insights</span>
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setPage('team')}
            className={`w-full flex items-center gap-3 px-6 py-3 border-l-2 transition-all text-sm font-semibold ${
              page === 'team'
                ? 'bg-cyan-500/5 border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-[#bbc9cd]/60 hover:bg-white/5 hover:text-[#dde4e5]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            <span>Team Directory</span>
          </button>

          <button
            onClick={() => setPage('settings')}
            className={`w-full flex items-center gap-3 px-6 py-3 border-l-2 transition-all text-sm font-semibold ${
              page === 'settings'
                ? 'bg-cyan-500/5 border-cyan-400 text-cyan-400 font-bold'
                : 'border-transparent text-[#bbc9cd]/60 hover:bg-white/5 hover:text-[#dde4e5]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </button>
        </nav>

        {/* Sidebar Actions / Footer */}
        <div className="px-6 mt-auto">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold py-2.5 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-xs tracking-wider uppercase"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Ticket
          </button>

          <div className="pt-6 mt-6 border-t border-white/5 text-[11px] text-[#bbc9cd]/40 text-center font-geist">
            SupportFlow v1.0.4
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-slate-900/10 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <button
              onClick={goHome}
              className="text-[#bbc9cd]/60 hover:text-cyan-400 font-geist text-xs uppercase tracking-widest transition-colors font-bold"
            >
              Console
            </button>
            {(page === 'detail' || page === 'analytics' || page === 'team' || page === 'settings') && (
              <>
                <span className="text-[#bbc9cd]/25">/</span>
                <span className="text-cyan-400/80 font-geist text-xs uppercase tracking-widest font-bold">
                  {page === 'detail' && 'Ticket details'}
                  {page === 'analytics' && 'Analytics'}
                  {page === 'team' && 'Team directory'}
                  {page === 'settings' && 'Settings'}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Badge */}
            <div className="relative p-2 rounded-xl bg-white/5 border border-white/5 text-[#bbc9cd] hover:text-[#dde4e5] cursor-pointer transition-all">
              <span className="material-symbols-outlined text-[20px] block">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10 select-none cursor-pointer" onClick={() => setPage('settings')}>
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[#dde4e5]">{profile?.name || 'Alex Rivera'}</p>
                <p className="text-[10px] text-[#bbc9cd]/50 uppercase tracking-wider font-semibold font-geist">{profile?.role || 'Senior Lead'}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center font-bold text-cyan-400 text-xs font-geist">
                {getInitials(profile?.name || 'Alex Rivera')}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Render */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-8 py-8 overflow-y-auto">
          {page === 'home' && (
            <Home
              onViewTicket={goToDetail}
              onRequestNewTicket={() => setShowCreateModal(true)}
            />
          )}
          {page === 'detail' && (
            <TicketDetail ticketId={selectedTicketId} onBack={goHome} />
          )}
          {page === 'analytics' && <Analytics />}
          {page === 'team' && <Team />}
          {page === 'settings' && (
            <Settings
              profile={profile}
              onUpdateProfile={(updated) => setProfile(updated)}
            />
          )}
        </main>
      </div>

      {/* Frosted Glass Create Modal Overlay */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-lg glass-card rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-slide-up relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-[#bbc9cd]/60 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            
            <div className="mb-5">
              <h2 className="text-lg font-bold text-[#dde4e5] tracking-tight">Create Support Ticket</h2>
              <p className="text-xs text-[#bbc9cd]/60 mt-0.5">Submit ticket details to start tracking issue status.</p>
            </div>

            <TicketForm
              onCreated={() => {
                setShowCreateModal(false)
                // Reload tickets trigger
                if (window.onTicketCreated) window.onTicketCreated()
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
