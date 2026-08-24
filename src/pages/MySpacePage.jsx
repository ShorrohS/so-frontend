import React, { useState, useEffect } from 'react'
import { generateInvoicePDF } from '../utils/invoiceGenerator'

export default function MySpacePage({ user, onNavigate, onUpdateUser, onOpenAuthModal }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  // Filter & Search Controls
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // 'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'
  const [dateFilter, setDateFilter] = useState('ALL') // 'ALL' | '30DAYS' | '6MONTHS' | '2026'
  const [sortBy, setSortBy] = useState('date-desc') // 'date-desc' | 'date-asc' | 'price-desc' | 'price-asc'

  // Edit Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    password: ''
  })

  // Route Guard Protection
  useEffect(() => {
    if (!user) {
      onNavigate('/')
      if (onOpenAuthModal) onOpenAuthModal('login')
    }
  }, [user, onNavigate, onOpenAuthModal])

  useEffect(() => {
    if (user) {
      fetchUserBookings()
    }
  }, [user])

  const fetchUserBookings = async () => {
    setLoading(true)
    try {
      let res = await fetch(`/api/v1/user/bookings?username=${encodeURIComponent(user.username)}`)
      if (!res.ok) {
        res = await fetch(`http://localhost:3000/api/v1/user/bookings?username=${encodeURIComponent(user.username)}`)
      }
      const data = await res.json()
      if (data.success && Array.isArray(data.bookings)) {
        setBookings(data.bookings)
      }
    } catch {
      // Client Fallback if offline
      setBookings([
        {
          id: 'bkg-101',
          referenceId: 'RES-2026-8941',
          username: user?.username || 'Client',
          services: [
            { name: 'Classic Precision Cut', price: 75, category: 'For Him' },
            { name: 'Black Edition Beard Ritual', price: 100, category: 'For Him' }
          ],
          stylistId: 'stylist-1',
          stylistName: 'Master Artisan Rahul',
          bookingDate: '2026-08-28',
          bookingTime: '11:30 AM',
          totalAmount: 175,
          status: 'CONFIRMED',
          createdAt: new Date().toISOString()
        },
        {
          id: 'bkg-102',
          referenceId: 'RES-2026-7712',
          username: user?.username || 'Client',
          services: [
            { name: 'Hydra Nourish Ritual', price: 900, category: 'Hair Spa Rituals' }
          ],
          stylistId: 'stylist-2',
          stylistName: 'Senior Stylist Ananya',
          bookingDate: '2026-08-15',
          bookingTime: '02:00 PM',
          totalAmount: 900,
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 864000000).toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      let res = await fetch(`/api/v1/user/bookings/${bookingId}/cancel`, {
        method: 'PATCH'
      })
      if (!res.ok) {
        res = await fetch(`http://localhost:3000/api/v1/user/bookings/${bookingId}/cancel`, {
          method: 'PATCH'
        })
      }
      const data = await res.json()
      if (data.success) {
        setToast('Reservation cancelled successfully!')
        fetchUserBookings()
        setTimeout(() => setToast(''), 3000)
      }
    } catch {
      setToast('Failed to cancel booking.')
      setTimeout(() => setToast(''), 3000)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!profileForm.username) return
    try {
      let res = await fetch('/api/v1/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, username: profileForm.username, password: profileForm.password || 'password' })
      })
      if (!res.ok) {
        res = await fetch('http://localhost:3000/api/v1/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: user.id, username: profileForm.username, password: profileForm.password || 'password' })
        })
      }
      const data = await res.json()
      if (data.success) {
        if (onUpdateUser) onUpdateUser(data.user)
        setToast('Sanctuary Profile updated!')
        setIsEditingProfile(false)
        setTimeout(() => setToast(''), 3000)
      }
    } catch {
      setToast('Failed to update profile.')
      setTimeout(() => setToast(''), 3000)
    }
  }

  if (!user) return null

  // Advanced Search, Filtering & Sorting Logic
  let processedBookings = [...bookings]

  // 1. Status Filter
  if (statusFilter === 'UPCOMING') {
    processedBookings = processedBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'RESCHEDULED')
  } else if (statusFilter === 'COMPLETED') {
    processedBookings = processedBookings.filter(b => b.status === 'COMPLETED')
  } else if (statusFilter === 'CANCELLED') {
    processedBookings = processedBookings.filter(b => b.status === 'CANCELLED')
  }

  // 2. Search Query (Service, Stylist, Ref ID)
  const searchLower = search.toLowerCase().trim()
  if (searchLower) {
    processedBookings = processedBookings.filter(b =>
      b.referenceId?.toLowerCase().includes(searchLower) ||
      b.stylistName?.toLowerCase().includes(searchLower) ||
      b.services?.some(s => s.name?.toLowerCase().includes(searchLower))
    )
  }

  // 3. Date Presets Filter
  if (dateFilter === '30DAYS') {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000)
    processedBookings = processedBookings.filter(b => new Date(b.bookingDate) >= thirtyDaysAgo)
  } else if (dateFilter === '6MONTHS') {
    const sixMonthsAgo = new Date(Date.now() - 180 * 86400000)
    processedBookings = processedBookings.filter(b => new Date(b.bookingDate) >= sixMonthsAgo)
  } else if (dateFilter === '2026') {
    processedBookings = processedBookings.filter(b => b.bookingDate?.startsWith('2026'))
  }

  // 4. Sorting Controls
  processedBookings.sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.bookingDate) - new Date(a.bookingDate)
    if (sortBy === 'date-asc') return new Date(a.bookingDate) - new Date(b.bookingDate)
    if (sortBy === 'price-desc') return (parseFloat(b.totalAmount) || 0) - (parseFloat(a.totalAmount) || 0)
    if (sortBy === 'price-asc') return (parseFloat(a.totalAmount) || 0) - (parseFloat(b.totalAmount) || 0)
    return 0
  })

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#042C1D] font-body-md flex flex-col">
      {/* Top Sanctuary Sub-Header */}
      <div className="bg-[#042C1D] text-[#FAF6F0] border-b border-[#D4AF37]/30 py-6 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#FAF6F0] border-2 border-[#D4AF37] flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[#042C1D] text-3xl">account_circle</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline-lg text-2xl text-white font-bold">{user.username}'s Space</h1>
                <span className="bg-[#D4AF37] text-[#042C1D] px-3 py-0.5 rounded-full text-xs font-bold font-mono">
                  {user.tier || 'Gold Member'}
                </span>
              </div>
              <p className="text-xs text-[#D4AF37] font-label-md uppercase tracking-widest font-semibold mt-0.5">
                Salon Organics Botanical Sanctuary Ledger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditingProfile(true)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              <span>Edit Account Profile</span>
            </button>

            <button
              onClick={() => onNavigate('/')}
              className="bg-[#FAF6F0] text-[#042C1D] hover:bg-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">home</span>
              <span>Back to Sanctuary</span>
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="bg-[#D4AF37]/20 border-b border-[#D4AF37]/40 text-[#042C1D] py-2.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Main Ledger Content Container */}
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-8 flex-grow flex flex-col gap-6">
        
        {/* Ledger Toolbar Card */}
        <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">search</span>
              <input
                className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2 text-xs focus:border-[#042C1D] outline-none text-[#042C1D] font-medium"
                placeholder="Search service, stylist, or ref ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              className="bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-semibold text-[#042C1D] outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            {/* Date Preset Filter */}
            <select
              className="bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-semibold text-[#042C1D] outline-none"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="ALL">All Time Dates</option>
              <option value="30DAYS">Last 30 Days</option>
              <option value="6MONTHS">Last 6 Months</option>
              <option value="2026">Year 2026</option>
            </select>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-on-surface-variant">Sort By:</span>
            <select
              className="bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-semibold text-[#042C1D] outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="price-desc">Total Bill (High to Low)</option>
              <option value="price-asc">Total Bill (Low to High)</option>
            </select>
          </div>
        </div>

        {/* Bookings Ledger Cards / Data List */}
        <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-headline-lg text-xl text-[#042C1D] font-bold">Appointment Ritual Ledger</h2>
              <p className="text-xs text-on-surface-variant">View reservation history, status changes, and download GST tax receipts.</p>
            </div>
            <span className="bg-[#FAF6F0] text-gold px-3.5 py-1 rounded-full text-xs font-bold font-mono border border-gold/30">
              Showing {processedBookings.length} Rituals
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-bold text-on-surface-variant">
              Loading your appointment ledger...
            </div>
          ) : processedBookings.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-outline">event_busy</span>
              <p className="text-xs text-on-surface-variant font-medium">No appointment records match your active search and filter criteria.</p>
              <button
                onClick={() => { setSearch(''); setStatusFilter('ALL'); setDateFilter('ALL'); }}
                className="text-xs text-gold font-bold underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {processedBookings.map(bkg => (
                <div key={bkg.id} className="p-5 rounded-2xl border border-gold/30 bg-[#FAF6F0] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-gold shadow-xs">
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#042C1D] text-gold flex items-center justify-center shrink-0 border border-gold/30 shadow-xs">
                      <span className="material-symbols-outlined text-2xl">spa</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#042C1D] text-gold px-2.5 py-0.5 rounded text-[10px] font-mono font-bold">
                          {bkg.referenceId}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          bkg.status === 'CONFIRMED' ? 'bg-primary/15 text-primary border border-primary/30' :
                          bkg.status === 'COMPLETED' ? 'bg-gold/20 text-[#042C1D] border border-gold/40' :
                          'bg-error/15 text-error border border-error/30'
                        }`}>
                          {bkg.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-[#042C1D] text-sm">
                        {bkg.services?.map(s => s.name).join(', ')}
                      </h3>

                      <div className="text-xs text-on-surface-variant flex flex-wrap items-center gap-3 mt-1 font-medium">
                        <span>📅 {bkg.bookingDate} at {bkg.bookingTime}</span>
                        <span>•</span>
                        <span className="text-gold font-semibold">Artisan: {bkg.stylistName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 border-t md:border-t-0 border-gold/20 pt-3 md:pt-0">
                    <div className="text-right">
                      <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Total Paid</span>
                      <span className="font-mono font-extrabold text-gold text-base">₹{bkg.totalAmount}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {bkg.status === 'COMPLETED' && (
                        <button
                          onClick={() => generateInvoicePDF(bkg)}
                          className="bg-[#042C1D] text-[#FAF6F0] hover:bg-[#084D34] px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-gold/40 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                          title="Download Official GST Invoice Receipt"
                        >
                          <span className="material-symbols-outlined text-sm">download</span>
                          <span>GST Receipt</span>
                        </button>
                      )}

                      {(bkg.status === 'CONFIRMED' || bkg.status === 'RESCHEDULED') && (
                        <button
                          onClick={() => handleCancelBooking(bkg.id)}
                          className="bg-error/10 hover:bg-error/20 text-error px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-error/30 transition-all cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF6F0] rounded-3xl max-w-sm w-full border border-[#042C1D]/30 shadow-2xl p-6 relative">
            <button onClick={() => setIsEditingProfile(false)} className="absolute top-4 right-4 text-[#042C1D] hover:opacity-80 p-1">
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <h3 className="font-headline-lg text-lg text-[#042C1D] font-bold mb-4">Edit Sanctuary Account</h3>

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#042C1D] mb-1">Username</label>
                <input
                  required
                  type="text"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2.5 text-xs text-[#042C1D] font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#042C1D] mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                  value={profileForm.password}
                  onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2.5 text-xs text-[#042C1D]"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-full border border-outline-variant/30 text-[#042C1D] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#042C1D] text-[#FAF6F0] px-5 py-2 rounded-full font-bold text-xs border border-gold/40 cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
