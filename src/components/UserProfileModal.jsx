import React, { useState, useEffect } from 'react'

export default function UserProfileModal({ isOpen, user, onUpdateProfile, onLogout, onClose }) {
  const [activeTab, setActiveTab] = useState('bookings') // 'bookings' | 'settings'
  const [bookingTab, setBookingTab] = useState('upcoming') // 'upcoming' | 'past' | 'cancelled'

  const [username, setUsername] = useState(user?.username || '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [userBookings, setUserBookings] = useState({
    upcoming: [
      {
        id: 'bkg-101',
        referenceId: 'RES-2026-8941',
        bookingDate: '2026-08-28',
        bookingTime: '11:30 AM',
        stylistName: 'Master Artisan Rahul',
        totalAmount: 175,
        status: 'CONFIRMED',
        services: [
          { name: 'Classic Precision Cut', price: 75 },
          { name: 'Black Edition Beard Ritual', price: 100 }
        ]
      }
    ],
    past: [
      {
        id: 'bkg-102',
        referenceId: 'RES-2026-7712',
        bookingDate: '2026-08-20',
        bookingTime: '02:00 PM',
        stylistName: 'Senior Stylist Ananya',
        totalAmount: 900,
        status: 'COMPLETED',
        services: [
          { name: 'Hydra Nourish Ritual', price: 900 }
        ]
      }
    ],
    cancelled: []
  })

  useEffect(() => {
    if (isOpen && user?.username) {
      fetchUserBookings()
    }
  }, [isOpen, user])

  const fetchUserBookings = async () => {
    try {
      let res = await fetch(`/api/v1/user/bookings?username=${encodeURIComponent(user.username)}`)
      if (!res.ok) {
        res = await fetch(`http://localhost:3000/api/v1/user/bookings?username=${encodeURIComponent(user.username)}`)
      }
      const data = await res.json()
      if (data.success && data.categorized) {
        setUserBookings(data.categorized)
      }
    } catch {}
  }

  if (!isOpen) return null

  const handleCancelUserBooking = async (bookingId) => {
    try {
      let res = await fetch(`/api/v1/user/bookings/${bookingId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })
      if (!res.ok) {
        res = await fetch(`http://localhost:3000/api/v1/user/bookings/${bookingId}/cancel`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' }
        })
      }
      const data = await res.json()
      if (data.success) {
        setMessage('Reservation cancelled successfully.')
        fetchUserBookings()
        setTimeout(() => setMessage(''), 3000)
      }
    } catch {
      setMessage('Failed to cancel reservation.')
      setTimeout(() => setMessage(''), 3000)
    }
  }

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#F9F7F2] rounded-3xl max-w-xl w-full border border-gold/40 shadow-2xl overflow-hidden p-6 md:p-8 relative max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-outline hover:text-on-background transition-colors p-1"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        <div className="text-center mb-4">
          <span className="text-gold font-label-md uppercase tracking-[0.2em] block mb-1 font-bold text-xs">Customer Profile</span>
          <h2 className="font-headline-lg text-2xl text-on-background">My Space & Bookings</h2>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-2"></div>
        </div>

        {/* User Status Badge */}
        <div className="bg-[#042C1D] text-[#FAF6F0] p-4 rounded-2xl border border-gold/30 flex justify-between items-center mb-4 shrink-0">
          <div>
            <span className="text-[10px] text-gold uppercase tracking-wider font-bold block">Sanctuary Account</span>
            <span className="font-bold text-base block">{user?.username}</span>
          </div>
          <span className="bg-[#D4AF37] text-[#042C1D] px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-xs">
            {user?.tier || 'Gold Member'}
          </span>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex border-b border-gold/20 mb-4 bg-white rounded-xl p-1 shrink-0">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2 text-center font-bold text-xs rounded-lg transition-all cursor-pointer ${
              activeTab === 'bookings' ? 'bg-[#042C1D] text-white' : 'text-on-surface-variant'
            }`}
          >
            My Bookings Ledger
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-2 text-center font-bold text-xs rounded-lg transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#042C1D] text-white' : 'text-on-surface-variant'
            }`}
          >
            Account Settings
          </button>
        </div>

        {message && (
          <div className="mb-4 p-2.5 rounded-xl bg-gold/15 border border-gold/40 text-center text-xs text-[#042C1D] font-bold">
            {message}
          </div>
        )}

        <div className="overflow-y-auto flex-grow flex flex-col gap-4 pr-1">
          {/* TAB 1: My Bookings Ledger */}
          {activeTab === 'bookings' && (
            <div className="flex flex-col gap-3">
              {/* Sub-tabs: Upcoming vs Past vs Cancelled */}
              <div className="flex gap-2">
                <button
                  onClick={() => setBookingTab('upcoming')}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    bookingTab === 'upcoming' ? 'bg-[#042C1D] text-gold border border-gold/40' : 'bg-white text-on-surface-variant'
                  }`}
                >
                  Upcoming ({userBookings.upcoming?.length || 0})
                </button>
                <button
                  onClick={() => setBookingTab('past')}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    bookingTab === 'past' ? 'bg-[#042C1D] text-gold border border-gold/40' : 'bg-white text-on-surface-variant'
                  }`}
                >
                  Past ({userBookings.past?.length || 0})
                </button>
                <button
                  onClick={() => setBookingTab('cancelled')}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    bookingTab === 'cancelled' ? 'bg-[#042C1D] text-gold border border-gold/40' : 'bg-white text-on-surface-variant'
                  }`}
                >
                  Cancelled ({userBookings.cancelled?.length || 0})
                </button>
              </div>

              {/* Render Bookings List */}
              <div className="flex flex-col gap-3">
                {(userBookings[bookingTab] || []).length === 0 ? (
                  <div className="p-6 text-center bg-white rounded-2xl border border-gold/20 text-xs text-on-surface-variant">
                    No {bookingTab} appointments found.
                  </div>
                ) : (
                  userBookings[bookingTab].map(bkg => (
                    <div key={bkg.id} className="bg-white p-4 rounded-2xl border border-gold/30 flex flex-col gap-2.5 text-xs shadow-xs">
                      <div className="flex justify-between items-center border-b border-outline-variant/15 pb-2">
                        <span className="font-mono font-bold text-gold bg-[#042C1D] px-2.5 py-0.5 rounded text-[10px]">
                          {bkg.referenceId}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          bkg.status === 'CONFIRMED' ? 'bg-primary/10 text-primary border border-primary/30' :
                          bkg.status === 'COMPLETED' ? 'bg-gold/20 text-[#042C1D] border border-gold/40' :
                          'bg-error/10 text-error border border-error/30'
                        }`}>
                          {bkg.status}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs font-semibold text-[#042C1D]">
                        <span>📅 {bkg.bookingDate} at {bkg.bookingTime}</span>
                        <span>Stylist: {bkg.stylistName}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Rituals Reserved:</span>
                        {bkg.services.map((s, idx) => (
                          <div key={idx} className="flex justify-between text-[11px] font-medium text-on-surface">
                            <span>• {s.name}</span>
                            <span>₹{s.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-outline-variant/15 flex justify-between items-center">
                        <span className="font-bold text-[#042C1D]">Total Bill: <strong className="text-gold">₹{bkg.totalAmount}</strong></span>

                        {bkg.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleCancelUserBooking(bkg.id)}
                            className="bg-error/10 hover:bg-error/20 text-error border border-error/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Account Settings Form */}
          {activeTab === 'settings' && (
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
                className="bg-primary text-on-primary py-2.5 rounded-full font-label-md uppercase tracking-wider text-xs hover:opacity-90 transition-opacity border border-gold/30 shadow-xs font-bold mt-1 cursor-pointer"
              >
                {isLoading ? 'Saving Changes...' : 'Save Profile Updates'}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={onLogout}
            className="bg-secondary/10 text-secondary border border-secondary/30 py-2.5 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-secondary/20 transition-colors mt-2 cursor-pointer"
          >
            Sign Out Account
          </button>
        </div>
      </div>
    </div>
  )
}
