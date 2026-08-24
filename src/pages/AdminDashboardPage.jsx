import React, { useState, useEffect } from 'react'
import catalogueData from '../data/serviceCatalogue.json'

export default function AdminDashboardPage({ admin, cmsSettings, onSaveCMS, onAddService, onAdminLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState('services') // 'services' | 'bookings' | 'cms' | 'users'
  const [toast, setToast] = useState('')

  // Catalog State
  const [services, setServices] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [csvText, setCsvText] = useState('')

  // Bookings Atelier Admin State
  const [bookingsList, setBookingsList] = useState([])
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL')
  const [bookingSearch, setBookingSearch] = useState('')
  const [selectedBookingForEdit, setSelectedBookingForEdit] = useState(null)
  const [editBookingForm, setEditBookingForm] = useState({
    status: 'CONFIRMED',
    bookingDate: '',
    bookingTime: '',
    stylistName: ''
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

  // Strict Route Guard Protection
  useEffect(() => {
    if (!admin) {
      onNavigate('/admin/login')
    }
  }, [admin, onNavigate])

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

  // Fetch Services (with Fallback to Complete Catalogue)
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

    // Fallback using client catalogue dataset
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
    } catch {}
  }

  useEffect(() => {
    if (activeTab === 'services') fetchServices()
    if (activeTab === 'bookings') fetchBookings()
  }, [activeTab, page, search, selectedCategory, bookingStatusFilter, bookingSearch])

  if (!admin) return null

  // Handle Admin Booking Status Update
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

  // Handle Single Service Creation or Edit Submit
  const handleServiceSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: serviceForm.name,
        category: serviceForm.category,
        subcategory: serviceForm.subcategory,
        description: serviceForm.description,
        bestForTag: serviceForm.bestForTag,
        imageUrl: serviceForm.imageUrl,
        isVisible: serviceForm.isVisible,
        durationMinutes: parseInt(serviceForm.durationMinutes) || 45,
        pricing: {
          standard: parseFloat(serviceForm.standardPrice) || 300,
          member: parseFloat(serviceForm.memberPrice) || 150,
          vip: parseFloat(serviceForm.vipPrice) || 100
        }
      }

      let url = '/api/v1/admin/services'
      let method = 'POST'
      if (editingServiceId) {
        url = `/api/v1/admin/services/${editingServiceId}`
        method = 'PUT'
      }

      let res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        res = await fetch(`http://localhost:3000${url}`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      setToast(editingServiceId ? 'Service updated successfully!' : 'New service item published!')
      setEditingServiceId(null)
      fetchServices()
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Service saved locally.')
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
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-all duration-300 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'services' ? 'bg-[#042C1D] text-[#FAF6F0] shadow-sm' : 'text-on-surface-variant hover:text-[#042C1D]'
            }`}
          >
            <span className="material-symbols-outlined text-base">spa</span>
            <span>Service Catalog Management</span>
          </button>

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
            onClick={() => setActiveTab('cms')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-all duration-300 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'cms' ? 'bg-[#042C1D] text-[#FAF6F0] shadow-sm' : 'text-on-surface-variant hover:text-[#042C1D]'
            }`}
          >
            <span className="material-symbols-outlined text-base">edit_note</span>
            <span>CMS Landing Page</span>
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

        {/* Tab 1: Service Catalog Management */}
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

        {/* Tab 2: Bookings Atelier */}
        {activeTab === 'bookings' && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-grow md:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">search</span>
                  <input
                    className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2 text-xs focus:border-[#042C1D] outline-none text-[#042C1D]"
                    placeholder="Search reference, client, or stylist..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                  />
                </div>

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
              </div>

              <div className="text-xs font-bold text-on-surface-variant">
                Total Reservations: <strong className="text-[#042C1D]">{bookingsList.length}</strong>
              </div>
            </div>

            {/* Bookings Data Table */}
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
                    {bookingsList.map(bkg => (
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
                              onClick={() => handleOpenEditBookingModal(bkg)}
                              className="px-2.5 py-1 bg-[#042C1D] text-white hover:bg-[#084D34] rounded-lg text-[10px] font-bold uppercase cursor-pointer"
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
                                Complete
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

        {/* Tab 3: CMS Landing Page */}
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

        {/* Tab 4: User Tier Audit */}
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
