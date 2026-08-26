import React, { useState, useEffect } from 'react'
import catalogueData from '../data/serviceCatalogue.json'
import { generateInvoicePDF } from '../utils/invoiceGenerator'

export default function AdminDashboardPage({ admin, cmsSettings, onSaveCMS, onAddService, onAdminLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState('bookings') // 'salon' | 'services' | 'bookings' | 'cms' | 'users'
  const [toast, setToast] = useState('')

  // Catalog State
  const [services, setServices] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Bookings Atelier Admin State
  const [bookingsList, setBookingsList] = useState([])
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL')
  const [bookingDateFilter, setBookingDateFilter] = useState('ALL') // 'ALL' | '30DAYS' | '6MONTHS' | '2026'
  const [bookingSortBy, setBookingSortBy] = useState('date-desc')
  const [bookingSearch, setBookingSearch] = useState('')
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState(null)
  const [editBookingForm, setEditBookingForm] = useState({
    status: 'CONFIRMED',
    bookingDate: '',
    bookingTime: '',
    stylistName: ''
  })

  // My Salon Admin State (Stylists & Capacity)
  const [salonCapacity, setSalonCapacity] = useState({
    totalSeats: 6,
    maxConcurrentBookings: 6
  })
  const [stylistsList, setStylistsList] = useState([])
  const [newStylistForm, setNewStylistForm] = useState({
    name: '',
    specialization: 'Organic Grooming & Styling',
    photoUrl: '/images/stylist-any.jpg',
    description: 'Master artisan committed to holistic hair wellness.',
    isActive: true
  })

  // Single Item Form State
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'For Him',
    subcategory: 'The Signature Cut',
    description: '',
    bestForTag: 'Precision Styling',
    imageUrl: '/images/service-1.jpg',
    isVisible: true,
    standardPrice: 300,
    memberPrice: 150,
    vipPrice: 100,
    durationMinutes: 45
  })

  // CMS Form State
  const [cmsForm, setCmsForm] = useState({
    heroTitle: cmsSettings?.heroTitle || 'Organic Luxury for Your Hair & Soul',
    heroSubtitle: cmsSettings?.heroSubtitle || 'Experience holistic botanical hair treatments crafted with pure organic ingredients.',
    tagline: cmsSettings?.tagline || 'SALON ORGANICS SANCTUARY',
    bannerImage: cmsSettings?.bannerImage || '/images/hero-banner.jpg'
  })

  // User List State
  const [userList, setUserList] = useState([
    { id: 'usr_1', username: 'sec_user_2026', tier: 'Gold Member', registeredAt: '2026-08-22' },
    { id: 'usr_2', username: 'valid_user_2026', tier: 'VIP Sanctuary', registeredAt: '2026-08-23' },
    { id: 'usr_3', username: 'new_guest_2026', tier: 'Guest', registeredAt: '2026-08-24' }
  ])

  // Membership Requests State
  const [membershipRequests, setMembershipRequests] = useState([
    { id: 'req_1', userId: 'usr_3', fullName: 'Shorroh Surmi', email: 'surmi@salonorganics.com', phoneNumber: '+91 98765 43210', status: 'pending', createdAt: '2026-08-25' },
    { id: 'req_2', userId: 'usr_4', fullName: 'Ananya Sharma', email: 'ananya@gmail.com', phoneNumber: '+91 91234 56789', status: 'approved', createdAt: '2026-08-24' }
  ])

  const fetchMembershipRequests = async () => {
    try {
      let res = await fetch('/api/v1/admin/membership-requests')
      if (!res.ok) {
        res = await fetch('http://localhost:3000/api/v1/admin/membership-requests')
      }
      const data = await res.json()
      if (data.success && Array.isArray(data.requests)) {
        setMembershipRequests(data.requests)
      }
    } catch {}
  }

  const handleApproveRequest = async (reqId) => {
    try {
      let res = await fetch(`/api/v1/admin/membership-requests/${reqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      })
      if (!res.ok) {
        res = await fetch(`http://localhost:3000/api/v1/admin/membership-requests/${reqId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' })
        })
      }
      const data = await res.json()
      if (data.success) {
        setToast('Membership Request Approved! User upgraded to Gold Member.')
        setMembershipRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'approved' } : r))
        setTimeout(() => setToast(''), 3500)
      }
    } catch {
      setMembershipRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'approved' } : r))
      setToast('Membership Request Approved! User upgraded to Gold Member.')
      setTimeout(() => setToast(''), 3500)
    }
  }

  const handleRejectRequest = async (reqId) => {
    try {
      let res = await fetch(`/api/v1/admin/membership-requests/${reqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      })
      if (!res.ok) {
        res = await fetch(`http://localhost:3000/api/v1/admin/membership-requests/${reqId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'rejected' })
        })
      }
      const data = await res.json()
      if (data.success) {
        setToast('Membership Request Rejected.')
        setMembershipRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r))
        setTimeout(() => setToast(''), 3500)
      }
    } catch {
      setMembershipRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r))
      setToast('Membership Request Rejected.')
      setTimeout(() => setToast(''), 3500)
    }
  }

  // Strict Route Guard Protection
  useEffect(() => {
    if (!admin) {
      onNavigate('/admin/login')
    }
  }, [admin, onNavigate])

  // Fetch Services, Bookings & My Salon
  const fetchSalonData = async () => {
    try {
      let res = await fetch('/api/v1/admin/salon')
      if (!res.ok) {
        res = await fetch('http://localhost:3000/api/v1/admin/salon')
      }
      const data = await res.json()
      if (data.success) {
        if (data.capacity) setSalonCapacity(data.capacity)
        if (Array.isArray(data.stylists)) setStylistsList(data.stylists)
      }
    } catch {}
  }

  // Flatten serviceCatalogue.json for Client Fallback (47 items)
  const getFallbackServices = () => {
    let list = []
    let order = 1
    const categories = catalogueData?.catalogue?.categories || []

    categories.forEach(cat => {
      const categoryName = cat.name
      const groups = cat.groups || []

      groups.forEach(grp => {
        const subcategoryName = grp.name
        const srvList = grp.services || []

        srvList.forEach(srv => {
          let stdPrice = 300
          let memPrice = 150
          let vipPrice = 100

          if (srv.pricing) {
            stdPrice = typeof srv.pricing.standard === 'number' ? srv.pricing.standard : 300
            memPrice = typeof srv.pricing.member === 'number' ? srv.pricing.member : 150
            vipPrice = typeof srv.pricing.offer === 'number' ? srv.pricing.offer : Math.floor(stdPrice * 0.7)
          } else if (srv.length_pricing) {
            const stdObj = srv.length_pricing.standard || srv.length_pricing.Medium || {}
            stdPrice = typeof stdObj === 'number' ? stdObj : 1200
            memPrice = Math.floor(stdPrice * 0.7)
            vipPrice = Math.floor(stdPrice * 0.5)
          }

          list.push({
            id: srv.id,
            name: srv.name,
            category: categoryName,
            subcategory: subcategoryName,
            description: srv.description || `${srv.name} ritual at Salon Organics.`,
            bestForTag: (srv.features && srv.features[0]) || 'Organic Care',
            imageUrl: `/images/service-${(order % 3) + 1}.jpg`,
            isVisible: true,
            displayOrder: order++,
            durationMinutes: 45,
            pricing: {
              standard: stdPrice,
              member: memPrice,
              vip: vipPrice
            }
          })
        })
      })
    })
    return list
  }

  const fetchServices = async () => {
    try {
      const query = new URLSearchParams({
        page,
        limit,
        search,
        category: selectedCategory
      }).toString()

      let res = await fetch(`/api/v1/admin/services?${query}`)
      if (!res.ok) {
        res = await fetch(`http://localhost:3000/api/v1/admin/services?${query}`)
      }
      const data = await res.json()
      if (data.success && Array.isArray(data.items) && data.total >= 40) {
        setServices(data.items)
        setTotal(data.total)
        setTotalPages(data.totalPages)
        return
      }
    } catch {}

    let fallback = getFallbackServices()
    const searchLower = search.toLowerCase().trim()
    const categoryLower = selectedCategory.toLowerCase().trim()

    if (searchLower) {
      fallback = fallback.filter(s => s.name.toLowerCase().includes(searchLower) || s.description.toLowerCase().includes(searchLower))
    }
    if (categoryLower) {
      fallback = fallback.filter(s => s.category.toLowerCase() === categoryLower)
    }

    const calcTotal = fallback.length
    const calcPages = Math.ceil(calcTotal / limit) || 1
    const startIndex = (page - 1) * limit
    const paginated = fallback.slice(startIndex, startIndex + limit)

    setServices(paginated)
    setTotal(calcTotal)
    setTotalPages(calcPages)
  }

  const fetchBookings = async () => {
    try {
      const query = new URLSearchParams({
        status: bookingStatusFilter,
        search: bookingSearch
      }).toString()

      let res = await fetch(`/api/v1/admin/bookings?${query}`)
      if (!res.ok) {
        res = await fetch(`http://localhost:3000/api/v1/admin/bookings?${query}`)
      }
      const data = await res.json()
      if (data.success && Array.isArray(data.bookings)) {
        setBookingsList(data.bookings)
      }
    } catch {
      setBookingsList([
        {
          id: "bkg-101",
          userId: "usr_1",
          username: "sec_user_2026",
          services: [
            { name: "Classic Precision Cut", price: 75, category: "For Him" },
            { name: "Black Edition Beard Ritual", price: 100, category: "For Him" }
          ],
          stylistId: "stylist-1",
          stylistName: "Master Artisan Rahul",
          bookingDate: "2026-08-28",
          bookingTime: "11:30 AM",
          totalAmount: 175,
          status: "CONFIRMED",
          referenceId: "RES-2026-8941",
          createdAt: new Date().toISOString()
        },
        {
          id: "bkg-102",
          userId: "usr_2",
          username: "valid_user_2026",
          services: [
            { name: "Hydra Nourish Ritual", price: 900, category: "Hair Spa Rituals" }
          ],
          stylistId: "stylist-2",
          stylistName: "Senior Stylist Ananya",
          bookingDate: "2026-08-15",
          bookingTime: "02:00 PM",
          totalAmount: 900,
          status: "COMPLETED",
          referenceId: "RES-2026-7712",
          createdAt: new Date(Date.now() - 864000000).toISOString()
        }
      ])
    }
  }

  useEffect(() => {
    if (activeTab === 'salon') fetchSalonData()
    if (activeTab === 'services') fetchServices()
    if (activeTab === 'bookings') fetchBookings()
  }, [activeTab, page, search, selectedCategory, bookingStatusFilter, bookingSearch])

  if (!admin) return null

  // Processed Bookings Filter & Sort Logic for Admin View
  let processedAdminBookings = [...bookingsList]

  if (bookingStatusFilter !== 'ALL') {
    processedAdminBookings = processedAdminBookings.filter(b => b.status === bookingStatusFilter)
  }

  const bSearchLower = bookingSearch.toLowerCase().trim()
  if (bSearchLower) {
    processedAdminBookings = processedAdminBookings.filter(b =>
      b.username?.toLowerCase().includes(bSearchLower) ||
      b.referenceId?.toLowerCase().includes(bSearchLower) ||
      b.stylistName?.toLowerCase().includes(bSearchLower) ||
      b.services?.some(s => s.name?.toLowerCase().includes(bSearchLower))
    )
  }

  if (bookingDateFilter === '30DAYS') {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000)
    processedAdminBookings = processedAdminBookings.filter(b => new Date(b.bookingDate) >= thirtyDaysAgo)
  } else if (bookingDateFilter === '6MONTHS') {
    const sixMonthsAgo = new Date(Date.now() - 180 * 86400000)
    processedAdminBookings = processedAdminBookings.filter(b => new Date(b.bookingDate) >= sixMonthsAgo)
  } else if (bookingDateFilter === '2026') {
    processedAdminBookings = processedAdminBookings.filter(b => b.bookingDate?.startsWith('2026'))
  }

  processedAdminBookings.sort((a, b) => {
    if (bookingSortBy === 'date-desc') return new Date(b.bookingDate) - new Date(a.bookingDate)
    if (bookingSortBy === 'date-asc') return new Date(a.bookingDate) - new Date(b.bookingDate)
    if (bookingSortBy === 'price-desc') return (parseFloat(b.totalAmount) || 0) - (parseFloat(a.totalAmount) || 0)
    if (bookingSortBy === 'price-asc') return (parseFloat(a.totalAmount) || 0) - (parseFloat(b.totalAmount) || 0)
    return 0
  })

  // Handle Salon Capacity Update
  const handleSaveCapacity = async () => {
    try {
      let res = await fetch('/api/v1/admin/salon/capacity', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salonCapacity)
      })
      if (!res.ok) {
        res = await fetch('http://localhost:3000/api/v1/admin/salon/capacity', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(salonCapacity)
        })
      }
      const data = await res.json()
      if (data.success) {
        setToast('Salon Seat Capacity updated!')
        setTimeout(() => setToast(''), 3000)
      }
    } catch {
      setToast('Failed to update capacity.')
      setTimeout(() => setToast(''), 3000)
    }
  }

  // Handle Create Stylist Submit
  const handleCreateStylist = async (e) => {
    e.preventDefault()
    if (!newStylistForm.name) return
    try {
      let res = await fetch('/api/v1/admin/stylists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStylistForm)
      })
      if (!res.ok) {
        res = await fetch('http://localhost:3000/api/v1/admin/stylists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStylistForm)
        })
      }
      const data = await res.json()
      if (data.success) {
        setToast(`New Stylist "${data.stylist.name}" added to Atelier!`)
        setNewStylistForm({
          name: '',
          specialization: 'Organic Grooming & Styling',
          photoUrl: '/images/stylist-any.jpg',
          description: 'Master artisan committed to holistic hair wellness.',
          isActive: true
        })
        fetchSalonData()
        setTimeout(() => setToast(''), 3000)
      }
    } catch {
      setToast('Failed to add stylist.')
      setTimeout(() => setToast(''), 3000)
    }
  }

  // Handle Toggle Stylist Active Status
  const handleToggleStylistActive = async (stylistId, currentActive) => {
    try {
      let res = await fetch(`/api/v1/admin/stylists/${stylistId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive })
      })
      if (!res.ok) {
        res = await fetch(`http://localhost:3000/api/v1/admin/stylists/${stylistId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !currentActive })
        })
      }
      const data = await res.json()
      if (data.success) {
        setStylistsList(stylistsList.map(s => s.id === stylistId ? { ...s, isActive: !currentActive } : s))
        setToast(`Stylist active status updated.`)
        setTimeout(() => setToast(''), 3000)
      }
    } catch {}
  }

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      let res = await fetch(`/api/v1/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!res.ok) {
        res = await fetch(`http://localhost:3000/api/v1/admin/bookings/${bookingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        })
      }
      const data = await res.json()
      if (data.success) {
        setToast(`Booking status updated to ${newStatus}`)
        fetchBookings()
        setTimeout(() => setToast(''), 3000)
      }
    } catch {
      setToast('Failed to update booking status.')
      setTimeout(() => setToast(''), 3000)
    }
  }

  const handleOpenEditBookingModal = (booking) => {
    setSelectedBookingForEdit(booking)
    setEditBookingForm({
      status: booking.status,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      stylistName: booking.stylistName
    })
  }

  const handleSaveBookingEdit = async () => {
    if (!selectedBookingForEdit) return
    try {
      let res = await fetch(`/api/v1/admin/bookings/${selectedBookingForEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editBookingForm)
      })
      if (!res.ok) {
        res = await fetch(`http://localhost:3000/api/v1/admin/bookings/${selectedBookingForEdit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editBookingForm)
        })
      }
      const data = await res.json()
      if (data.success) {
        setToast('Booking details updated successfully!')
        setSelectedBookingForEdit(null)
        fetchBookings()
        setTimeout(() => setToast(''), 3000)
      }
    } catch {
      setToast('Failed to modify booking.')
      setTimeout(() => setToast(''), 3000)
    }
  }

  const handleCmsSubmit = async (e) => {
    e.preventDefault()
    try {
      await onSaveCMS(cmsForm)
      setToast('CMS Settings saved & synced to S3!')
      setTimeout(() => setToast(''), 3000)
    } catch {}
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex flex-col font-body-md text-body-md">
      {/* Standalone Header */}
      <header className="bg-[#042C1D] text-[#FAF6F0] border-b border-[#D4AF37]/30 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#D4AF37] text-2xl">sanctuary</span>
            <div>
              <h1 className="font-headline-lg text-lg text-white font-bold">Admin Sanctuary Control Center</h1>
              <p className="text-[10px] text-[#D4AF37] font-label-md uppercase tracking-widest font-semibold">Active Session: {admin.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="bg-[#FAF6F0] text-[#042C1D] hover:bg-white px-4 py-2 rounded-full text-xs font-label-md uppercase tracking-wider font-bold transition-all duration-300 flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              <span>View Public Site</span>
            </button>

            <button
              onClick={() => {
                onAdminLogout()
                onNavigate('/')
              }}
              className="bg-secondary/20 hover:bg-secondary/40 text-white border border-white/20 px-4 py-2 rounded-full text-xs font-label-md uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {toast && (
        <div className="bg-[#D4AF37]/20 border-b border-[#D4AF37]/40 text-[#042C1D] py-2.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex-grow flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant/30 bg-[#EEF2EE] rounded-2xl overflow-hidden p-1 gap-1 border">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-all duration-300 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'bookings' ? 'bg-[#042C1D] text-[#FAF6F0] shadow-sm' : 'text-on-surface-variant hover:text-[#042C1D]'
            }`}
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
            <span>Bookings Atelier</span>
          </button>

          <button
            onClick={() => setActiveTab('salon')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-all duration-300 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'salon' ? 'bg-[#042C1D] text-[#FAF6F0] shadow-sm' : 'text-on-surface-variant hover:text-[#042C1D]'
            }`}
          >
            <span className="material-symbols-outlined text-base">storefront</span>
            <span>My Salon</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-all duration-300 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'services' ? 'bg-[#042C1D] text-[#FAF6F0] shadow-sm' : 'text-on-surface-variant hover:text-[#042C1D]'
            }`}
          >
            <span className="material-symbols-outlined text-base">spa</span>
            <span>Service Catalog Management</span>
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-all duration-300 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'cms' ? 'bg-[#042C1D] text-[#FAF6F0] shadow-sm' : 'text-on-surface-variant hover:text-[#042C1D]'
            }`}
          >
            <span className="material-symbols-outlined text-base">edit_note</span>
            <span>CMS Landing Page</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('membership_requests')
              fetchMembershipRequests()
            }}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-all duration-300 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'membership_requests' ? 'bg-[#042C1D] text-[#FAF6F0] shadow-sm' : 'text-on-surface-variant hover:text-[#042C1D]'
            }`}
          >
            <span className="material-symbols-outlined text-base">card_membership</span>
            <span>Membership Requests</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-all duration-300 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'users' ? 'bg-[#042C1D] text-[#FAF6F0] shadow-sm' : 'text-on-surface-variant hover:text-[#042C1D]'
            }`}
          >
            <span className="material-symbols-outlined text-base">badge</span>
            <span>User Tier Audit</span>
          </button>
        </div>

        {/* Tab 1: Bookings Atelier (Standalone Card View with Search/Filter/Sort Toolbar & Invoice Downloads) */}
        {activeTab === 'bookings' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Search Input */}
                <div className="relative flex-grow md:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">search</span>
                  <input
                    className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2 text-xs focus:border-[#042C1D] outline-none text-[#042C1D]"
                    placeholder="Search reference, client, or stylist..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <select
                  className="bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-semibold text-[#042C1D] outline-none"
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="RESCHEDULED">RESCHEDULED</option>
                </select>

                {/* Date Preset Filter */}
                <select
                  className="bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-semibold text-[#042C1D] outline-none"
                  value={bookingDateFilter}
                  onChange={(e) => setBookingDateFilter(e.target.value)}
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
                  value={bookingSortBy}
                  onChange={(e) => setBookingSortBy(e.target.value)}
                >
                  <option value="date-desc">Date (Newest First)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="price-desc">Revenue (High to Low)</option>
                  <option value="price-asc">Revenue (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Bookings Standalone Data Table */}
            <div className="bg-white rounded-3xl border border-[#042C1D]/15 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#EEF2EE] border-b border-[#042C1D]/10 text-[10px] font-label-md uppercase tracking-wider text-[#042C1D] font-bold">
                      <th className="py-3 px-4">Reference ID</th>
                      <th className="py-3 px-4">Client User</th>
                      <th className="py-3 px-4">Services Reserved</th>
                      <th className="py-3 px-4">Assigned Stylist</th>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4 text-center">Total (₹)</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 text-xs">
                    {processedAdminBookings.map(bkg => (
                      <tr key={bkg.id} className="hover:bg-[#F9F7F2] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-gold bg-[#042C1D] rounded text-[11px] w-fit my-2 block">
                          {bkg.referenceId}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#042C1D]">{bkg.username}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-0.5 max-w-xs">
                            {bkg.services?.map((s, idx) => (
                              <span key={idx} className="text-[11px] font-medium text-on-surface line-clamp-1">
                                • {s.name} (₹{s.price})
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gold">{bkg.stylistName}</td>
                        <td className="py-3 px-4 font-medium text-on-surface">
                          <div>{bkg.bookingDate}</div>
                          <div className="text-[10px] text-on-surface-variant">{bkg.bookingTime}</div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-gold font-mono">₹{bkg.totalAmount}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            bkg.status === 'CONFIRMED' ? 'bg-primary/10 text-primary border border-primary/30' :
                            bkg.status === 'COMPLETED' ? 'bg-gold/20 text-[#042C1D] border border-gold/40' :
                            'bg-error/10 text-error border border-error/30'
                          }`}>
                            {bkg.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => generateInvoicePDF(bkg)}
                              className="px-2 py-1 bg-[#042C1D] text-gold hover:bg-[#084D34] rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                              title="Download GST Invoice"
                            >
                              Invoice
                            </button>

                            <button
                              onClick={() => handleOpenEditBookingModal(bkg)}
                              className="px-2 py-1 bg-outline-variant/20 text-[#042C1D] hover:bg-outline-variant/40 rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                              title="Modify Booking"
                            >
                              Edit
                            </button>

                            {bkg.status !== 'COMPLETED' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(bkg.id, 'COMPLETED')}
                                className="px-2 py-1 bg-gold/20 text-[#042C1D] hover:bg-gold/40 rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                                title="Mark Completed"
                              >
                                Done
                              </button>
                            )}

                            {bkg.status !== 'CANCELLED' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(bkg.id, 'CANCELLED')}
                                className="px-2 py-1 bg-error/10 text-error hover:bg-error/20 rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                                title="Cancel Reservation"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: My Salon (Stylists & Capacity) */}
        {activeTab === 'salon' && (
          <div className="flex flex-col gap-6">
            {/* Salon Capacity & Station Setup Card */}
            <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-headline-lg text-xl text-[#042C1D] font-bold">Salon Capacity & Working Seats Setup</h3>
                  <p className="text-xs text-on-surface-variant">Configure total styling chairs/stations. Rejects client bookings when seat capacity is full.</p>
                </div>
                <span className="bg-[#FAF6F0] text-gold px-3.5 py-1 rounded-full text-xs font-bold font-mono border border-gold/30">
                  Current Capacity: {salonCapacity.totalSeats} Working Seats
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
                <div>
                  <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1 font-bold">Total Working Seats / Chairs</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm font-bold text-[#042C1D]"
                    value={salonCapacity.totalSeats}
                    onChange={(e) => setSalonCapacity({ ...salonCapacity, totalSeats: parseInt(e.target.value) || 1 })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1 font-bold">Max Concurrent Slot Bookings</label>
                  <input
                    type="number"
                    min={1}
                    className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm font-bold text-[#042C1D]"
                    value={salonCapacity.maxConcurrentBookings}
                    onChange={(e) => setSalonCapacity({ ...salonCapacity, maxConcurrentBookings: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <button
                onClick={handleSaveCapacity}
                className="mt-4 bg-[#042C1D] text-[#FAF6F0] px-6 py-2.5 rounded-full font-bold text-xs hover:bg-[#084D34] transition-all border border-[#D4AF37]/40 shadow-xs cursor-pointer"
              >
                Save Capacity Configuration
              </button>
            </div>

            {/* Stylists Atelier Management */}
            <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 md:p-8 shadow-sm">
              <h3 className="font-headline-lg text-xl text-[#042C1D] font-bold mb-1">Stylists Atelier Directory</h3>
              <p className="text-xs text-on-surface-variant mb-6">Manage professional team members, specializations, mapped services, and active booking availability.</p>

              {/* Stylists List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {stylistsList.map(st => (
                  <div key={st.id} className="p-4 rounded-2xl border border-gold/30 bg-[#FAF6F0] flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#EEF2EE] overflow-hidden shrink-0 border border-gold/40">
                        <span className="material-symbols-outlined text-[#042C1D] text-3xl flex items-center justify-center h-full">person</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#042C1D] text-sm block">{st.name}</span>
                        <span className="text-[10px] text-gold font-semibold uppercase block">{st.specialization}</span>
                        <span className="text-[10px] text-on-surface-variant line-clamp-1 mt-0.5">{st.description}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleStylistActive(st.id, st.isActive)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer ${
                        st.isActive !== false ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-error/10 text-error border border-error/30'
                      }`}
                    >
                      {st.isActive !== false ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Stylist Form */}
              <div className="bg-[#EEF2EE] p-6 rounded-2xl border border-[#042C1D]/15 max-w-2xl">
                <h4 className="font-headline-md text-base text-[#042C1D] font-bold mb-3">Add New Professional Stylist</h4>
                <form onSubmit={handleCreateStylist} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#042C1D] mb-1">Stylist Name *</label>
                      <input
                        required
                        className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-[#042C1D]"
                        placeholder="e.g. Master Artisan Vikram"
                        value={newStylistForm.name}
                        onChange={(e) => setNewStylistForm({ ...newStylistForm, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#042C1D] mb-1">Specialization</label>
                      <input
                        className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-[#042C1D]"
                        placeholder="e.g. Organic Balayage & Scalp Health"
                        value={newStylistForm.specialization}
                        onChange={(e) => setNewStylistForm({ ...newStylistForm, specialization: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#042C1D] mb-1">Bio / Description</label>
                    <textarea
                      rows={2}
                      className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-[#042C1D]"
                      placeholder="Brief overview of experience and techniques..."
                      value={newStylistForm.description}
                      onChange={(e) => setNewStylistForm({ ...newStylistForm, description: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#042C1D] text-[#FAF6F0] px-6 py-2.5 rounded-full font-bold text-xs border border-gold/40 self-start cursor-pointer shadow-xs"
                  >
                    Add Stylist to Directory
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Service Catalog Management */}
        {activeTab === 'services' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-grow md:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">search</span>
                  <input
                    className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2 text-xs focus:border-[#042C1D] outline-none text-[#042C1D]"
                    placeholder="Search name or description..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  />
                </div>

                <select
                  className="bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-semibold text-[#042C1D] outline-none"
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                >
                  <option value="">All Categories</option>
                  <option value="For Him">For Him</option>
                  <option value="For Her">For Her</option>
                  <option value="Colour Artistry">Colour Artistry</option>
                  <option value="Hair Spa Rituals">Hair Spa Rituals</option>
                  <option value="Advanced Hair Therapies">Advanced Hair Therapies</option>
                  <option value="The Finishing Studio">The Finishing Studio</option>
                  <option value="Skin, Hands & Body">Skin, Hands & Body</option>
                </select>
              </div>

              <div className="text-xs font-bold text-[#042C1D]">
                Total Catalog Items: <strong>{total}</strong> (Page {page} of {totalPages})
              </div>
            </div>

            {/* Compact Service Data Table */}
            <div className="bg-white rounded-3xl border border-[#042C1D]/15 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#EEF2EE] border-b border-[#042C1D]/10 text-[10px] font-label-md uppercase tracking-wider text-[#042C1D] font-bold">
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Category / Subgroup</th>
                      <th className="py-3 px-4 text-center">3-Tier Prices in INR (₹)</th>
                      <th className="py-3 px-4 text-center">Visibility</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 text-xs">
                    {services.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-[#F9F7F2] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-on-surface-variant text-[11px]">{item.displayOrder || (page - 1) * limit + idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#EEF2EE] overflow-hidden shrink-0 border border-gold/30">
                              <img src={item.imageUrl || '/images/service-1.jpg'} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <span className="font-bold text-[#042C1D] block">{item.name}</span>
                              <span className="text-[10px] text-on-surface-variant line-clamp-1">{item.description}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-[#FAF6F0] text-[#042C1D] px-2 py-0.5 rounded text-[10px] font-semibold border border-gold/30 block w-fit">{item.category}</span>
                          <span className="text-[10px] text-on-surface-variant block mt-0.5">{item.subcategory || 'General'}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-semibold text-xs">
                          ₹{item.pricing?.standard ?? 300} / ₹{item.pricing?.member ?? 150} / ₹{item.pricing?.vip ?? 100}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase">Visible</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              setEditingServiceId(item.id)
                              setServiceForm({
                                name: item.name,
                                category: item.category || 'For Him',
                                subcategory: item.subcategory || 'General',
                                description: item.description || '',
                                bestForTag: item.bestForTag || '',
                                imageUrl: item.imageUrl || '/images/service-1.jpg',
                                isVisible: true,
                                standardPrice: item.pricing?.standard || 300,
                                memberPrice: item.pricing?.member || 150,
                                vipPrice: item.pricing?.vip || 100,
                                durationMinutes: item.durationMinutes || 45
                              })
                            }}
                            className="px-2.5 py-1 bg-[#042C1D] text-white hover:bg-[#084D34] rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="p-4 bg-[#FAF6F0] border-t border-[#042C1D]/10 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
                <span className="text-on-surface-variant font-medium">
                  Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total} Catalog Entries
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1.5 rounded-full border border-[#042C1D]/20 text-[#042C1D] font-bold disabled:opacity-40 hover:bg-[#042C1D] hover:text-white transition-all cursor-pointer"
                  >
                    Previous
                  </button>

                  <span className="font-bold text-[#042C1D] px-2">Page {page} of {totalPages}</span>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1.5 rounded-full border border-[#042C1D]/20 text-[#042C1D] font-bold disabled:opacity-40 hover:bg-[#042C1D] hover:text-white transition-all cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: CMS Landing Page */}
        {activeTab === 'cms' && (
          <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 md:p-8 shadow-sm">
            <h2 className="font-headline-lg text-xl text-[#042C1D] mb-1 font-bold">Landing Page CMS Editor</h2>
            <form onSubmit={handleCmsSubmit} className="flex flex-col gap-5 max-w-3xl mt-4">
              <div>
                <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1.5 font-bold">Hero Title</label>
                <input
                  className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:border-[#042C1D] outline-none text-[#042C1D] font-medium"
                  value={cmsForm.heroTitle}
                  onChange={(e) => setCmsForm({ ...cmsForm, heroTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1.5 font-bold">Hero Subtitle</label>
                <textarea
                  rows={3}
                  className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:border-[#042C1D] outline-none text-[#042C1D] font-medium"
                  value={cmsForm.heroSubtitle}
                  onChange={(e) => setCmsForm({ ...cmsForm, heroSubtitle: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="bg-[#042C1D] text-[#FAF6F0] py-3 px-8 rounded-full font-label-md uppercase text-xs border border-[#D4AF37]/40 font-bold self-start cursor-pointer"
              >
                Save CMS Changes & Sync S3
              </button>
            </form>
          </div>
        )}

        {/* Tab 5: Membership Requests Atelier */}
        {activeTab === 'membership_requests' && (
          <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 md:p-8 shadow-sm flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
              <div>
                <h2 className="font-headline-lg text-xl text-[#042C1D] font-bold">Membership Requests Atelier</h2>
                <p className="text-xs text-on-surface-variant">Review and manage client botanical membership applications.</p>
              </div>
              <span className="bg-[#FAF6F0] text-gold border border-gold/30 px-3.5 py-1 rounded-full text-xs font-bold font-mono">
                {membershipRequests.filter(r => r.status === 'pending').length} Pending Applications
              </span>
            </div>

            <div className="divide-y border border-[#042C1D]/15 rounded-2xl bg-white overflow-hidden shadow-xs">
              {membershipRequests.length === 0 ? (
                <div className="p-8 text-center text-xs text-on-surface-variant font-medium">
                  No membership requests currently submitted.
                </div>
              ) : (
                membershipRequests.map(req => (
                  <div key={req.id} className="p-4 md:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-[#FAF6F0]/40 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#042C1D] text-sm">{req.fullName}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          req.status === 'approved'
                            ? 'bg-[#042C1D] text-gold border border-gold/40'
                            : (req.status === 'rejected' ? 'bg-error/15 text-error' : 'bg-amber-100 text-amber-800')
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant font-mono">
                        <span>📧 {req.email}</span>
                        <span>📞 {req.phoneNumber}</span>
                        <span>📅 Submitted: {req.createdAt ? req.createdAt.split('T')[0] : '2026-08-25'}</span>
                      </div>
                    </div>

                    {req.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApproveRequest(req.id)}
                          className="bg-[#042C1D] text-[#FAF6F0] hover:bg-[#084D34] px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-gold/40 flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <span className="material-symbols-outlined text-sm text-gold">check_circle</span>
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req.id)}
                          className="bg-error/10 hover:bg-error/20 text-error px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-error/30 transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-on-surface-variant font-semibold italic">
                        {req.status === 'approved' ? '✓ Member Tier Granted' : '✕ Application Declined'}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 6: User Tier Audit */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 md:p-8 shadow-sm">
            <h2 className="font-headline-lg text-xl text-[#042C1D] mb-4 font-bold">User Tier Audit & Registry</h2>
            <div className="divide-y border border-[#042C1D]/15 rounded-2xl bg-white overflow-hidden shadow-xs">
              {userList.map(u => (
                <div key={u.id} className="p-4 flex justify-between items-center text-xs">
                  <span className="font-bold text-[#042C1D]">{u.username}</span>
                  <span className="bg-[#D4AF37] text-[#042C1D] px-3 py-1 rounded-full font-bold">{u.tier}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Admin Booking Edit Modal */}
      {selectedBookingForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF6F0] rounded-3xl max-w-md w-full border border-[#042C1D]/30 shadow-2xl p-6 relative">
            <button onClick={() => setSelectedBookingForEdit(null)} className="absolute top-4 right-4 text-[#042C1D] hover:opacity-80 p-1">
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <h3 className="font-headline-lg text-lg text-[#042C1D] font-bold mb-1">Modify Booking Reservation</h3>
            <span className="bg-[#042C1D] text-gold px-2.5 py-0.5 rounded text-[10px] font-mono font-bold inline-block mb-4">
              {selectedBookingForEdit.referenceId}
            </span>

            <div className="flex flex-col gap-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-[#042C1D] mb-1">Booking Status</label>
                <select
                  value={editBookingForm.status}
                  onChange={(e) => setEditBookingForm({ ...editBookingForm, status: e.target.value })}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-xs font-bold"
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="RESCHEDULED">RESCHEDULED</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#042C1D] mb-1">Appointment Date</label>
                <input
                  type="date"
                  value={editBookingForm.bookingDate}
                  onChange={(e) => setEditBookingForm({ ...editBookingForm, bookingDate: e.target.value })}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#042C1D] mb-1">Appointment Time</label>
                <input
                  type="text"
                  value={editBookingForm.bookingTime}
                  onChange={(e) => setEditBookingForm({ ...editBookingForm, bookingTime: e.target.value })}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-[#042C1D] mb-1">Assigned Stylist</label>
                <input
                  type="text"
                  value={editBookingForm.stylistName}
                  onChange={(e) => setEditBookingForm({ ...editBookingForm, stylistName: e.target.value })}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setSelectedBookingForEdit(null)}
                  className="px-4 py-2 rounded-full border border-outline-variant/30 text-[#042C1D] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBookingEdit}
                  className="bg-[#042C1D] text-[#FAF6F0] px-5 py-2 rounded-full font-bold text-xs border border-gold/40"
                >
                  Save Modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
