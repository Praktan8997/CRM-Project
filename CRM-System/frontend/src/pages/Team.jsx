import { useState, useEffect } from 'react'
import { getTeamMembers } from '../api.js'

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

export default function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getTeamMembers()
        setMembers(data)
      } catch (err) {
        setError('Failed to load team directory.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#dde4e5] uppercase font-geist">Team Directory</h1>
        <p className="text-xs text-[#bbc9cd]/50 mt-1 font-geist uppercase tracking-wider">
          Support operations staff profiles and workload overview
        </p>
      </div>

      {loading ? (
        <div className="text-center py-24 glass-card rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-3">
          <span className="material-symbols-outlined animate-spin text-cyan-400 text-3xl">sync</span>
          <p className="text-xs text-[#bbc9cd]/60 uppercase tracking-widest font-geist">Syncing team directory...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 glass-card rounded-2xl border border-white/5 max-w-md mx-auto">
          <span className="material-symbols-outlined text-rose-500 text-4xl mb-3">error</span>
          <p className="text-[#bbc9cd] text-sm">{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/5 glass-card">
          <table className="w-full text-sm border-collapse text-left">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[#bbc9cd]/80 uppercase text-[11px] font-bold tracking-widest font-geist">
                <th className="px-6 py-4">Agent Name</th>
                <th className="px-6 py-4">Role Title</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Network Status</th>
                <th className="px-6 py-4 text-center">Tickets Handled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-white/5 transition-colors group">
                  
                  {/* Name + Avatar */}
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-geist text-xs font-semibold ${getAvatarStyle(member.name)}`}>
                        {getInitials(member.name)}
                      </div>
                      <span className="font-semibold text-[#dde4e5]">{member.name}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4.5 text-[#bbc9cd] font-medium">{member.role}</td>

                  {/* Email */}
                  <td className="px-6 py-4.5 text-[#bbc9cd]/60 font-mono text-xs">{member.email}</td>

                  {/* Status Indicator */}
                  <td className="px-6 py-4.5">
                    <span className="inline-flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        member.status === 'Active'
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse'
                          : member.status === 'Away'
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'bg-slate-500'
                      }`}></span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#dde4e5]/80">{member.status}</span>
                    </span>
                  </td>

                  {/* Tickets Handled */}
                  <td className="px-6 py-4.5 text-center">
                    <span className="font-geist text-sm text-cyan-400 font-bold bg-cyan-500/5 border border-cyan-500/10 px-3 py-1.5 rounded-xl">
                      {member.tickets_handled}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
