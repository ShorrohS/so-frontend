import React, { useState } from 'react'

export default function AuthModal({ isOpen, mode = 'login', onAuthSuccess, onClose }) {
  const [activeTab, setActiveTab] = useState(mode)
  const [formState, setFormState] = useState({ username: '', password: '' })
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formState.username || !formState.password) return
    setIsLoading(true)
    setErrorMsg('')

    const path = activeTab === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register'
    const payload = JSON.stringify({
      username: formState.username,
      password: formState.password
    })

    try {
      let response = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      })

      // Fallback to absolute localhost:3000 if relative path is unproxied (returns HTML)
      const contentType = response.headers.get('content-type') || ''
      if (!response.ok && contentType.includes('text/html')) {
        response = await fetch(`http://localhost:3000${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        })
      }

      const data = await response.json().catch(() => ({}))

      if (response.ok && data.success !== false && data.user) {
        onAuthSuccess(data.user)
        onClose()
      } else {
        const message = data.message || (activeTab === 'login'
          ? 'Invalid username or password. Please check your credentials or register.'
          : 'Username already taken or registration error.')
        setErrorMsg(message)
      }
    } catch (err) {
      setErrorMsg('Unable to connect to registration server. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTabSwitch = (newTab) => {
    setActiveTab(newTab)
    setErrorMsg('')
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
          <span className="text-gold font-label-md uppercase tracking-[0.2em] block mb-2 font-semibold">Salon Orgænics</span>
          <h2 className="font-headline-lg text-2xl text-on-background">Guest Portal</h2>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-2"></div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/30 text-center text-xs text-error font-medium flex items-center justify-center gap-1.5 animate-fadeIn">
            <span className="material-symbols-outlined text-base shrink-0">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="flex border-b border-outline-variant/30 mb-6">
          <button
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-sm transition-colors border-b-2 ${
              activeTab === 'login'
                ? 'border-gold text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => handleTabSwitch('signup')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-sm transition-colors border-b-2 ${
              activeTab === 'signup'
                ? 'border-gold text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1">Username</label>
            <input
              required
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 focus:border-[#D4AF37] outline-none text-sm"
              placeholder="Enter your username"
              type="text"
              value={formState.username}
              onChange={(e) => setFormState({ ...formState, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1">Password</label>
            <input
              required
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 focus:border-[#D4AF37] outline-none text-sm"
              placeholder="••••••••"
              type="password"
              value={formState.password}
              onChange={(e) => setFormState({ ...formState, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-secondary text-on-secondary py-3 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-on-secondary-fixed-variant transition-colors mt-2 border border-gold/30 shadow-sm"
          >
            {isLoading ? 'Processing...' : activeTab === 'login' ? 'Access Account' : 'Register Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
