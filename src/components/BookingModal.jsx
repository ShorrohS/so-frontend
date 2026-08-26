import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'

export default function BookingModal({ isOpen, user, onClose, onBookingSuccess }) {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    selectedSlot,
    setSelectedSlot,
    calculateCartTotal
  } = useCart()

  const [step, setStep] = useState(1) // 1: Cart & Services | 2: Date & Time | 3: Stylist | 4: Confirmation Summary | 5: Success Badge

  const [date, setDate] = useState(selectedSlot.date)
  const [time, setTime] = useState(selectedSlot.time)

  useEffect(() => {
    setSelectedSlot({ date, time })
  }, [date, time, setSelectedSlot])

  const [selectedStylist, setSelectedStylist] = useState({
    id: 'stylist-1',
    name: 'Master Artisan Rahul',
    specialization: "Gentlemen's Precision & Beard Atelier"
  })

  const [stylistsList, setStylistsList] = useState([
    { id: 'stylist-0', name: 'Any Available Artisan', specialization: 'All Rituals', avatarUrl: '/images/stylist-any.jpg' },
    { id: 'stylist-1', name: 'Master Artisan Rahul', specialization: "Gentlemen's Precision & Beard Atelier", avatarUrl: '/images/stylist-rahul.jpg' },
    { id: 'stylist-2', name: 'Senior Stylist Ananya', specialization: 'Organic Colouring & Balayage', avatarUrl: '/images/stylist-ananya.jpg' },
    { id: 'stylist-3', name: 'Botanical Specialist Priya', specialization: 'Kérastase & Hair Spa Rituals', avatarUrl: '/images/stylist-priya.jpg' }
  ])

  const [confirmedBooking, setConfirmedBooking] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showSlotChangeWarning, setShowSlotChangeWarning] = useState(false)
  const [pendingSlotChange, setPendingSlotChange] = useState(null)

  useEffect(() => {
    if (isOpen) {
      fetchStylists()
    }
  }, [isOpen])

  const fetchStylists = async () => {
    try {
      let res = await fetch('/api/v1/stylists')
      if (!res.ok) {
        res = await fetch('http://localhost:3000/api/v1/stylists')
      }
      const data = await res.json()
      if (data.success && Array.isArray(data.stylists)) {
        setStylistsList(data.stylists)
      }
    } catch {}
  }

  if (!isOpen) return null

  const userTier = user?.tier || 'Guest'
  const totalAmount = calculateCartTotal(userTier)

  const handleRemoveService = (serviceId) => {
    removeFromCart(serviceId)
  }

  // Handle Date or Time Slot Change with Single-Slot Cart Policy Constraint Warning
  const handleTimeSlotSelect = (newSlot) => {
    if (time !== newSlot && cartItems.length > 0) {
      setPendingSlotChange({ type: 'time', value: newSlot })
      setShowSlotChangeWarning(true)
    } else {
      setTime(newSlot)
    }
  }

  const handleDateSelect = (newDate) => {
    if (date !== newDate && cartItems.length > 0) {
      setPendingSlotChange({ type: 'date', value: newDate })
      setShowSlotChangeWarning(true)
    } else {
      setDate(newDate)
    }
  }

  const confirmSlotChangeAndClearCart = () => {
    if (pendingSlotChange) {
      if (pendingSlotChange.type === 'time') setTime(pendingSlotChange.value)
      if (pendingSlotChange.type === 'date') setDate(pendingSlotChange.value)
    }
    setShowSlotChangeWarning(false)
    setPendingSlotChange(null)
  }

  const handleConfirmReservation = async () => {
    if (cartItems.length === 0) return
    setIsSubmitting(true)
    setErrorMessage('')
    try {
      const payload = {
        services: cartItems.map(item => ({
          id: item.id,
          name: item.title || item.name,
          category: item.audience || item.category,
          price: item.price
        })),
        stylistId: selectedStylist.id,
        stylistName: selectedStylist.name,
        bookingDate: date,
        bookingTime: time,
        totalAmount: totalAmount,
        username: user?.username || 'Guest Client',
        userId: user?.id || 'usr_guest'
      }

      let res = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok && res.status !== 409) {
        res = await fetch('http://localhost:3000/api/v1/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      const data = await res.json()
      if (res.status === 409 || !data.success) {
        setErrorMessage(data.message || 'Selected stylist or time slot is unavailable due to high concurrency.')
        if (data.code === 'STYLIST_UNAVAILABLE') {
          setStep(3)
        } else if (data.code === 'SALON_CAPACITY_FULL') {
          setStep(2)
        }
      } else if (data.success) {
        setConfirmedBooking(data.booking)
        setStep(5)
        clearCart()
        if (onBookingSuccess) onBookingSuccess(data.booking)
      }
    } catch (err) {
      setErrorMessage('Network error confirming reservation.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const reset = () => {
    setStep(1)
    setConfirmedBooking(null)
    onClose()
  }

  const timeSlots = ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#F9F7F2] rounded-3xl max-w-lg w-full border border-gold/40 shadow-2xl overflow-hidden p-6 md:p-8 relative flex flex-col max-h-[90vh]">
        <button
          onClick={reset}
          className="absolute top-4 right-4 text-outline hover:text-on-background transition-colors p-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Step Indicator Header */}
        <div className="text-center mb-6">
          <span className="text-gold font-label-md uppercase tracking-[0.2em] block mb-1 font-bold text-xs">
            Salon Organics • Single-Session Cart • Step {step} of 4
          </span>
          <h2 className="font-headline-lg text-2xl text-on-background">
            {step === 1 && 'Selected Service Rituals'}
            {step === 2 && 'Schedule Date & Time'}
            {step === 3 && 'Choose Artisan Stylist'}
            {step === 4 && 'Reservation Summary'}
            {step === 5 && 'Reservation Confirmed!'}
          </h2>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-2"></div>
        </div>

        {errorMessage && cartItems.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-error/15 border border-error/40 text-center text-xs text-error font-bold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">warning</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="overflow-y-auto flex-grow flex flex-col gap-5 pr-1">
          {/* STEP 1: Multi-Service Cart */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-[#FAF6F0] p-3 rounded-xl border border-gold/30">
                <span className="text-xs font-bold text-[#042C1D]">Session Time Slot:</span>
                <span className="text-xs font-mono font-bold text-gold">{date} at {time}</span>
              </div>

              {cartItems.length === 0 ? (
                /* Clean Empty State */
                <div className="py-10 px-4 text-center bg-white border border-gold/30 rounded-2xl flex flex-col items-center gap-2.5">
                  <div className="w-12 h-12 rounded-full bg-[#FAF6F0] border border-gold/30 flex items-center justify-center text-gold">
                    <span className="material-symbols-outlined text-2xl">shopping_bag</span>
                  </div>
                  <h3 className="font-headline-md text-base text-[#042C1D] font-bold">
                    Your cart is currently empty
                  </h3>
                  <p className="text-xs text-on-surface-variant max-w-xs font-medium leading-relaxed">
                    Select a ritual from our services list to begin your booking.
                  </p>
                  <span className="bg-[#FAF6F0] text-gold font-mono font-bold px-3 py-1 rounded-full text-[11px] border border-gold/30 mt-1">
                    0 Services Selected
                  </span>
                </div>
              ) : (
                /* Dynamic Cart Items List */
                <div className="divide-y border border-gold/30 rounded-2xl bg-white overflow-hidden shadow-xs">
                  {cartItems.map(srv => (
                    <div key={srv.id} className="p-3.5 flex justify-between items-center text-xs hover:bg-[#FAF6F0]/50 transition-colors">
                      <div>
                        <span className="font-bold text-[#042C1D] block">{srv.title || srv.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-on-surface-variant font-medium bg-[#FAF6F0] px-2 py-0.5 rounded border border-gold/20">
                            {srv.audience || srv.category || 'For All'}
                          </span>
                          {srv.length && (
                            <span className="text-[10px] text-gold font-bold font-mono">
                              Length: {srv.length}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-extrabold text-gold text-sm">₹{srv.price}</span>
                        <button
                          onClick={() => {
                            setErrorMessage('')
                            handleRemoveService(srv.id)
                          }}
                          className="text-error hover:bg-error/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Remove service ritual"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total Estimated Price Display */}
              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-gold/30 flex justify-between items-center text-sm font-bold text-[#042C1D]">
                <div>
                  <span>Total Estimated Price</span>
                  <span className="text-[10px] text-gold block font-mono">({cartItems.length === 0 ? 'Empty' : `${userTier} Rate`})</span>
                </div>
                <span className="text-gold font-extrabold text-lg">₹{cartItems.length === 0 ? 0 : totalAmount}</span>
              </div>

              <button
                disabled={cartItems.length === 0}
                onClick={() => setStep(2)}
                className={`w-full py-3.5 rounded-full font-label-md uppercase tracking-wider text-xs transition-all border border-[#D4AF37]/40 shadow-xs font-bold flex items-center justify-center gap-2 mt-2 ${
                  cartItems.length === 0
                    ? 'bg-outline-variant/30 text-on-surface-variant cursor-not-allowed border-transparent'
                    : 'bg-[#042C1D] text-[#FAF6F0] hover:bg-[#084D34] cursor-pointer'
                }`}
              >
                <span>Continue to Date & Time</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          )}

          {/* STEP 2: Date & Time Picker */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1.5 font-bold">Select Date</label>
                <input
                  required
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => handleDateSelect(e.target.value)}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 focus:border-[#D4AF37] outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-2 font-bold">Select Preferred Time Slot</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => handleTimeSlotSelect(slot)}
                      className={`py-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        time === slot
                          ? 'bg-[#042C1D] text-[#FAF6F0] border-[#D4AF37] shadow-xs'
                          : 'bg-white text-[#042C1D] border-outline-variant/30 hover:border-gold'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-full border border-outline-variant/30 text-[#042C1D] font-bold text-xs hover:bg-black/5 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-grow bg-[#042C1D] text-[#FAF6F0] py-3 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-[#084D34] transition-all border border-[#D4AF37]/40 shadow-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Select Stylist</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Stylist Selection */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold text-[#042C1D] uppercase tracking-wider">Select Preferred Professional</span>
              <div className="flex flex-col gap-3">
                {stylistsList.map(st => (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStylist(st)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      selectedStylist.id === st.id
                        ? 'bg-[#042C1D] text-[#FAF6F0] border-[#D4AF37] shadow-sm'
                        : 'bg-white text-[#042C1D] border-outline-variant/30 hover:border-gold'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#EEF2EE] overflow-hidden shrink-0 border border-gold/40">
                      <span className="material-symbols-outlined text-[#042C1D] text-2xl flex items-center justify-center h-full">person</span>
                    </div>
                    <div className="flex-grow">
                      <span className="font-bold text-xs block">{st.name}</span>
                      <span className={`text-[10px] ${selectedStylist.id === st.id ? 'text-[#D4AF37]' : 'text-on-surface-variant'}`}>{st.specialization}</span>
                    </div>
                    {selectedStylist.id === st.id && (
                      <span className="material-symbols-outlined text-gold text-lg">check_circle</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-3 rounded-full border border-outline-variant/30 text-[#042C1D] font-bold text-xs hover:bg-black/5 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-grow bg-[#042C1D] text-[#FAF6F0] py-3 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-[#084D34] transition-all border border-[#D4AF37]/40 shadow-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Review Summary</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Summary & Confirmation */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gold/30 flex flex-col gap-3 text-xs">
                <div className="flex justify-between border-b border-outline-variant/15 pb-2">
                  <span className="text-on-surface-variant font-medium">Guest Client:</span>
                  <span className="font-bold text-[#042C1D]">{user?.username || 'Guest Client'} ({userTier})</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/15 pb-2">
                  <span className="text-on-surface-variant font-medium">Appointment Date & Time:</span>
                  <span className="font-bold text-[#042C1D]">{date} at {time}</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/15 pb-2">
                  <span className="text-on-surface-variant font-medium">Assigned Artisan:</span>
                  <span className="font-bold text-gold">{selectedStylist.name}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant font-medium block mb-1">Selected Rituals:</span>
                  {cartItems.map(s => (
                    <div key={s.id} className="flex justify-between text-[11px] font-semibold text-[#042C1D]">
                      <span>• {s.title || s.name}</span>
                      <span>₹{s.price}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-gold/30 flex justify-between text-sm font-bold text-[#042C1D]">
                  <span>Total Amount Due:</span>
                  <span className="text-gold font-extrabold text-base">₹{totalAmount}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-3 rounded-full border border-outline-variant/30 text-[#042C1D] font-bold text-xs hover:bg-black/5 cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmReservation}
                  disabled={isSubmitting || cartItems.length === 0}
                  className="flex-grow bg-secondary text-on-secondary py-3.5 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-on-secondary-fixed-variant transition-colors border border-gold/30 shadow-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Verifying Availability...' : 'Confirm Reservation'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Success Badge */}
          {step === 5 && confirmedBooking && (
            <div className="bg-white p-6 rounded-3xl border border-gold/40 text-center flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#042C1D] text-gold flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-3xl">event_available</span>
              </div>
              <div>
                <span className="bg-[#FAF6F0] text-gold px-3 py-1 rounded-full text-xs font-bold font-mono border border-gold/30 block w-fit mx-auto mb-2">
                  Reference: {confirmedBooking.referenceId}
                </span>
                <h3 className="font-headline-md text-xl text-[#042C1D] font-bold">Appointment Confirmed!</h3>
              </div>
              <p className="text-on-surface-variant text-xs leading-relaxed max-w-sm">
                Your reservation for <strong>{confirmedBooking.bookingDate}</strong> at <strong>{confirmedBooking.bookingTime}</strong> with <strong>{confirmedBooking.stylistName}</strong> has been secured in our sanctuary ledger.
              </p>
              <button
                onClick={reset}
                className="bg-[#042C1D] text-[#FAF6F0] px-8 py-3 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-[#084D34] transition-all border border-[#D4AF37]/40 shadow-xs font-bold mt-2 cursor-pointer"
              >
                Done & View My Space
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Single-Time-Slot Cart Policy Warning Modal */}
      {showSlotChangeWarning && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF6F0] rounded-3xl max-w-sm w-full border border-gold/40 shadow-2xl p-6 text-center">
            <span className="material-symbols-outlined text-amber-600 text-4xl mb-2">warning</span>
            <h4 className="font-bold text-[#042C1D] text-base mb-2">Single-Session Cart Constraint</h4>
            <p className="text-xs text-on-surface-variant mb-5 leading-relaxed">
              Your cart currently contains services reserved for <strong>{date} at {time}</strong>. All services in a single booking session must share the same date and time slot.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  setShowSlotChangeWarning(false)
                  setPendingSlotChange(null)
                }}
                className="px-4 py-2 rounded-full border border-[#042C1D]/30 text-[#042C1D] font-bold text-xs cursor-pointer"
              >
                Keep Current Slot
              </button>
              <button
                onClick={confirmSlotChangeAndClearCart}
                className="bg-[#042C1D] text-[#FAF6F0] px-4 py-2 rounded-full font-bold text-xs border border-gold/40 cursor-pointer"
              >
                Confirm New Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
