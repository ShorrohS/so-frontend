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
      setMessage(err.message || 'Failed to update profile.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#F9F7F2] rounded-2xl max-w-md w-full border border-gold/30 shadow-2xl overflow-hidden p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-outline hover:text-on-background transition-colors p-1"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="text-center mb-6">
          <span className="text-gold font-label-md uppercase tracking-[0.2em] block mb-2 font-semibold">Guest Profile</span>
          <h2 className="font-headline-lg text-2xl text-on-background">Account Settings</h2>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-2"></div>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-gold/10 border border-gold/40 text-center text-xs text-primary font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1">
              Username
            </label>
            <input
              required
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 focus:border-[#D4AF37] outline-none text-sm"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1">
              New Password (Optional)
            </label>
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 focus:border-[#D4AF37] outline-none text-sm"
              placeholder="Leave blank to keep current password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-on-primary py-3 rounded-full font-label-md uppercase tracking-wider text-xs hover:opacity-90 transition-opacity border border-gold/30 shadow-sm"
            >
              {isLoading ? 'Saving Changes...' : 'Save Profile Updates'}
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="bg-secondary/10 text-secondary border border-secondary/30 py-2.5 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-secondary/20 transition-colors mt-2"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
