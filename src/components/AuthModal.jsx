import React, { useState } from 'react'

export default function AuthModal({ isOpen, mode = 'login', onClose }) {
  const [activeTab, setActiveTab] = useState(mode)
  const [formState, setFormState] = useState({ email: '', password: '', name: '' })
  const [submittedMessage, setSubmittedMessage] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (activeTab === 'login') {
      setSubmittedMessage(`Welcome back! Successfully logged in as ${formState.email || 'guest@salonorgaenics.com'}.`)
    } else {
      setSubmittedMessage(`Thank you for signing up, ${formState.name || 'valued guest'}! Account created successfully.`)
    }
  }

  const resetModal = () => {
    setSubmittedMessage('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#F9F7F2] rounded-2xl max-w-md w-full border border-gold/30 shadow-2xl overflow-hidden p-6 md:p-8 relative">
        <button
          onClick={resetModal}
          className="absolute top-4 right-4 text-outline hover:text-on-background transition-colors p-1"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="text-center mb-6">
          <span className="text-gold font-label-md uppercase tracking-[0.2em] block mb-2 font-semibold">Salon Orgænics</span>
          <h2 className="font-headline-lg text-2xl text-on-background">Guest Portal</h2>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-2"></div>
        </div>

        {submittedMessage ? (
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-gold/40 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">task_alt</span>
            </div>
            <p className="text-on-background font-body-lg">{submittedMessage}</p>
            <button
              onClick={resetModal}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md uppercase tracking-wider text-xs hover:opacity-90 transition-opacity mt-2"
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          <>
            <div className="flex border-b border-outline-variant/30 mb-6">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-sm transition-colors border-b-2 ${
                  activeTab === 'login'
                    ? 'border-gold text-primary font-bold'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-sm transition-colors border-b-2 ${
                  activeTab === 'signup'
                    ? 'border-gold text-primary font-bold'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {activeTab === 'signup' && (
                <div>
                  <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1">Full Name</label>
                  <input
                    required
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 focus:border-[#D4AF37] outline-none text-sm"
                    placeholder="Jane Doe"
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1">Email Address</label>
                <input
                  required
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 focus:border-[#D4AF37] outline-none text-sm"
                  placeholder="jane@example.com"
                  type="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
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
                className="bg-secondary text-on-secondary py-3 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-on-secondary-fixed-variant transition-colors mt-2 border border-gold/30 shadow-sm"
              >
                {activeTab === 'login' ? 'Access Account' : 'Create Account'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
