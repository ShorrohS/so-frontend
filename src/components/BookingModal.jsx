import React, { useState } from 'react'

export default function BookingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1)
  const [service, setService] = useState('Hair Styling')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('10:00 AM')

  if (!isOpen) return null

  const handleBooking = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const reset = () => {
    setStep(1)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#F9F7F2] rounded-2xl max-w-md w-full border border-gold/30 shadow-2xl overflow-hidden p-6 md:p-8 relative">
        <button
          onClick={reset}
          className="absolute top-4 right-4 text-outline hover:text-on-background transition-colors p-1"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="text-center mb-6">
          <span className="text-gold font-label-md uppercase tracking-[0.2em] block mb-2 font-semibold">Sanctuary Rituals</span>
          <h2 className="font-headline-lg text-2xl text-on-background">Book an Appointment</h2>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-2"></div>
        </div>

        {step === 2 ? (
          <div className="bg-surface-container-lowest p-6 rounded-xl border border-gold/40 text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl">event_available</span>
            </div>
            <h3 className="font-headline-md text-[#56624b]">Appointment Reserved!</h3>
            <p className="text-on-surface-variant font-body-md text-sm">
              Your <strong>{service}</strong> session is scheduled for <strong>{date || 'Tomorrow'}</strong> at <strong>{time}</strong>. We look forward to welcoming you to our botanical sanctuary.
            </p>
            <button
              onClick={reset}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md uppercase tracking-wider text-xs hover:opacity-90 transition-opacity mt-2"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1">Select Service</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 focus:border-[#D4AF37] outline-none text-sm"
              >
                <option value="Hair Styling">Hair Styling (From $85)</option>
                <option value="Organic Facials">Organic Facials (From $120)</option>
                <option value="Botanical Treatments">Botanical Treatments (From $150)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1">Preferred Date</label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 focus:border-[#D4AF37] outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-label-md uppercase tracking-wider text-on-surface-variant mb-1">Preferred Time</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 focus:border-[#D4AF37] outline-none text-sm"
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:30 PM">04:30 PM</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-secondary text-on-secondary py-3 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-on-secondary-fixed-variant transition-colors mt-2 border border-gold/30 shadow-sm"
            >
              Confirm Reservation
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
