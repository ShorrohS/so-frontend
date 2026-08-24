import React, { useState } from 'react'

export default function UserProfileModal({ isOpen, user, onUpdateProfile, onLogout, onClose }) {
  const [username, setUsername] = useState(user?.username || '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    try {
      await onUpdateProfile({ username, password })
      setMessage('Profile updated successfully!')
      setPassword('')
    } catch (err) {
      setMessage(err?.message || 'Failed to update profile.')
    } finally {
      setIsLoading(false)
    }
  }

  const recommendedServices = [
    { id: 'rec-1', name: 'Botanical Hair & Scalp Treatment', price: '$85 VIP', duration: '60 min', tag: 'Recommended for You' },
    { id: 'rec-2', name: 'Vegan Keratin Smoothing', price: '$130 VIP', duration: '90 min', tag: 'Smooth & Gloss' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#F9F7F2] rounded-3xl max-w-lg w-full border border-gold/40 shadow-2xl overflow-hidden p-6 md:p-8 relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-outline hover:text-on-background transition-colors p-1"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="text-center mb-6">
          <span className="text-gold font-label-md uppercase tracking-[0.2em] block mb-1 font-bold text-xs">Sanctuary Guest Profile</span>
          <h2 className="font-headline-lg text-2xl text-on-background">My Space & Account Settings</h2>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-2"></div>
        </div>

        <div className="overflow-y-auto flex-grow flex flex-col gap-6 pr-1">
          {message && (
            <div className="p-3 rounded-xl bg-gold/10 border border-gold/40 text-center text-xs text-primary font-medium">
              {message}
            </div>
          )}

          {/* User Status Badge */}
          <div className="bg-[#042C1D] text-[#FAF6F0] p-4 rounded-2xl border border-gold/30 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-gold uppercase tracking-wider font-bold block">Current Status</span>
              <span className="font-bold text-base block">{user?.username}</span>
            </div>
            <span className="bg-[#D4AF37] text-[#042C1D] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-xs">
              {user?.tier || 'Gold Member'}
            </span>
          </div>

          {/* Account Edit Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block text-[10px] font-label-md uppercase tracking-wider text-on-surface-variant mb-1 font-bold">
                Username
              </label>
              <input
                required
                className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:border-[#D4AF37] outline-none"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-label-md uppercase tracking-wider text-on-surface-variant mb-1 font-bold">
                New Password (Optional)
              </label>
              <input
                className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:border-[#D4AF37] outline-none"
                placeholder="Leave blank to keep current password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-on-primary py-2.5 rounded-full font-label-md uppercase tracking-wider text-xs hover:opacity-90 transition-opacity border border-gold/30 shadow-xs font-bold mt-1"
            >
              {isLoading ? 'Saving Changes...' : 'Save Profile Updates'}
            </button>
          </form>

          {/* My Space Recommended Services */}
          <div className="bg-white p-4 rounded-2xl border border-gold/30">
            <span className="text-gold font-label-md uppercase tracking-wider text-xs font-bold block mb-3">My Space • Tailored Sanctuary Recommendations</span>
            <div className="flex flex-col gap-2">
              {recommendedServices.map(srv => (
                <div key={srv.id} className="p-2.5 rounded-xl bg-[#FAF6F0] border border-gold/20 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-[#042C1D] block">{srv.name}</span>
                    <span className="text-[10px] text-on-surface-variant">{srv.tag} • {srv.duration}</span>
                  </div>
                  <span className="font-bold text-gold text-xs">{srv.price}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="bg-secondary/10 text-secondary border border-secondary/30 py-2.5 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-secondary/20 transition-colors"
          >
            Sign Out Account
          </button>
        </div>
      </div>
    </div>
  )
}
