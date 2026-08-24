import React, { useState } from 'react'

export default function MembershipForm() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return
    setSubmitted(true)
  }

  const handleReset = () => {
    setFormData({ name: '', phone: '', email: '' })
    setSubmitted(false)
  }

  return (
    <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg md:py-[96px] bg-light-sage" id="membership">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
        <div className="rounded-2xl overflow-hidden bg-surface-container-lowest shadow-sm border border-gold/30 p-2">
          <img
            alt="Gold Membership Card"
            className="w-full h-auto object-cover rounded-xl shadow-inner transition-transform duration-500 hover:scale-[1.02]"
            src="/images/gold-membership-card.svg"
          />
        </div>
        <div className="flex flex-col gap-6 bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-gold/30">
          <span className="text-gold font-label-md uppercase tracking-[0.2em]">Exclusive Access</span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Gold Membership</h2>
          <div className="w-12 h-px bg-[#D4AF37]"></div>
          <p className="text-on-surface-variant font-body-lg">Join our exclusive circle for priority bookings, bespoke treatments, and seasonal botanical gifts.</p>

          {submitted ? (
            <div className="bg-[#F9F7F2] border border-[#D4AF37]/50 rounded-xl p-6 flex flex-col gap-4 text-center items-center animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-gold">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="font-headline-md text-[#56624b]">Membership Application Received</h3>
              <p className="text-on-surface-variant font-body-md">
                Thank you, <strong className="text-on-background">{formData.name}</strong>! Your application for the Gold Membership circle has been submitted. Our concierge team will reach out to <strong>{formData.email}</strong> shortly.
              </p>
              <button
                onClick={handleReset}
                className="mt-2 text-xs uppercase tracking-wider text-secondary underline hover:text-primary transition-colors"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                required
                className="bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-3 focus:border-[#D4AF37] outline-none transition-colors"
                placeholder="Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                className="bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-3 focus:border-[#D4AF37] outline-none transition-colors"
                placeholder="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <input
                required
                className="bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-3 focus:border-[#D4AF37] outline-none transition-colors"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <button
                className="bg-primary text-on-primary px-8 py-4 rounded-full font-label-md uppercase tracking-wider hover:opacity-90 transition-opacity mt-2 border border-gold/50 shadow-sm"
                type="submit"
              >
                Apply for Membership
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
