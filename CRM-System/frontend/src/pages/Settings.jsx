import { useState, useEffect } from 'react'
import { updateAdminProfile } from '../api.js'

export default function Settings({ profile, onUpdateProfile }) {
  const [form, setForm] = useState({ name: '', role: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Sync state with parent profile prop when it changes
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        role: profile.role || '',
        email: profile.email || '',
      })
    }
  }, [profile])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.role || !form.email) {
      setError('All fields are required.')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const updated = await updateAdminProfile(form)
      setSuccess('Admin profile updated successfully!')
      if (onUpdateProfile) onUpdateProfile(updated)
    } catch (err) {
      setError(err.message || 'Failed to update settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#dde4e5] uppercase font-geist">Console Settings</h1>
        <p className="text-xs text-[#bbc9cd]/50 mt-1 font-geist uppercase tracking-wider">
          Configure admin credentials and visual identity parameters
        </p>
      </div>

      {/* Editor Form Card */}
      <div className="glass-card rounded-2xl border border-white/5 p-6 md:p-8 space-y-6">
        <div className="border-b border-white/5 pb-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-cyan-400 text-2xl select-none">manage_accounts</span>
          <div>
            <h2 className="text-base font-bold text-[#dde4e5]">Admin Profile Details</h2>
            <p className="text-[11px] text-[#bbc9cd]/50">Changes update global header states instantly.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Admin Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#bbc9cd]/70 mb-2.5 font-geist">Administrator Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Alex Rivera"
                className="w-full px-4 py-2.5 bg-black/35 border border-white/10 rounded-xl text-sm text-[#dde4e5] placeholder-[#bbc9cd]/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              />
            </div>

            {/* Admin Role */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#bbc9cd]/70 mb-2.5 font-geist">Console Role Title</label>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="Senior Admin"
                className="w-full px-4 py-2.5 bg-black/35 border border-white/10 rounded-xl text-sm text-[#dde4e5] placeholder-[#bbc9cd]/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
              />
            </div>

          </div>

          {/* Admin Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#bbc9cd]/70 mb-2.5 font-geist">Registered Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="alex.rivera@supportflow.com"
              className="w-full px-4 py-2.5 bg-black/35 border border-white/10 rounded-xl text-sm text-[#dde4e5] placeholder-[#bbc9cd]/30 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-200"
            />
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="flex items-center gap-2.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-3.5 rounded-xl">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3.5 rounded-xl">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{success}</span>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-bold px-8 py-2.5 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:shadow-[0_0_20px_rgba(34,211,238,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 text-xs tracking-widest uppercase font-geist"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                  Saving changes...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
