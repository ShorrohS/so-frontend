import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'

export default function BookingAnchorBar({ onOpenSelector }) {
  const {
    selectedSlot,
    selectedStylist,
    cartItems,
    isCartOpen,
    setIsCartOpen
  } = useCart()

  const [remainingSeconds, setRemainingSeconds] = useState(900) // 15 minutes TTL lock

  useEffect(() => {
    if (cartItems.length === 0) {
      setRemainingSeconds(900)
      return
    }
    const timer = setInterval(() => {
      setRemainingSeconds(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cartItems])

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="sticky top-[65px] z-40 bg-[#042C1D] text-[#FAF6F0] border-b border-[#D4AF37]/40 py-2.5 px-4 md:px-8 shadow-md">
      <div className="max-w-container-max mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-medium">
        
        {/* Slot & Stylist Anchor Info */}
        <div
          onClick={onOpenSelector}
          className="flex items-center gap-2 cursor-pointer hover:text-gold transition-colors font-mono tracking-tight"
          title="Click to change Date, Time, or Preferred Artisan"
        >
          <span className="material-symbols-outlined text-gold text-base shrink-0">calendar_clock</span>
          <span>
            Booking for: <strong className="text-white font-bold">{selectedSlot.date} at {selectedSlot.time}</strong>
          </span>
          <span className="text-[#D4AF37]/60">|</span>
          <span>
            Stylist: <strong className="text-gold font-bold">{selectedStylist?.name || 'Any Available Artisan'}</strong>
          </span>
          <span className="material-symbols-outlined text-gold text-xs">edit</span>
        </div>

        {/* Dynamic TTL Lock Timer & Cart Trigger */}
        <div className="flex items-center gap-4">
          {cartItems.length > 0 && (
            <div className="bg-[#D4AF37]/20 border border-[#D4AF37]/50 px-3 py-1 rounded-full text-[11px] font-bold font-mono text-gold flex items-center gap-1.5 animate-pulse">
              <span className="material-symbols-outlined text-xs text-gold">timer</span>
              <span>Slot Lock: {formatTimer(remainingSeconds)}</span>
            </div>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-[#D4AF37] text-[#042C1D] hover:bg-white px-3.5 py-1 rounded-full text-xs font-bold font-label-md uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">shopping_bag</span>
            <span>Cart</span>
            <span className="bg-[#042C1D] text-gold text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
              {cartItems.length}
            </span>
          </button>
        </div>

      </div>
    </div>
  )
}
