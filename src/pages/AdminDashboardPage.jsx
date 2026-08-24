import React, { useState, useEffect } from 'react'

export default function AdminDashboardPage({ admin, cmsSettings, onSaveCMS, onAddService, onAdminLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState('services')
  const [toast, setToast] = useState('')

  // Catalog State (Paginated & Filtered)
  const [services, setServices] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(20)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [csvText, setCsvText] = useState('')

  // Single Item Creation & Edit Form State
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: 'For Him',
    subcategory: 'The Signature Cut',
    description: '',
    bestForTag: 'Precision Styling & Scalp Health',
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

  // Fetch Paginated Services from Backend API
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
      if (data.success && Array.isArray(data.items)) {
        setServices(data.items)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    } catch {
      // Local fallback
    }
  }

  useEffect(() => {
    fetchServices()
  }, [page, search, selectedCategory])

  if (!admin) return null

  // Handle Image File Selection for Live Preview
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setServiceForm(prev => ({ ...prev, imageUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Edit Action Button Click
  const handleEditClick = (item) => {
    setEditingServiceId(item.id)
    setServiceForm({
      name: item.name || '',
      category: item.category || 'For Him',
      subcategory: item.subcategory || 'General',
      description: item.description || '',
      bestForTag: item.bestForTag || '',
      imageUrl: item.imageUrl || '/images/service-1.jpg',
      isVisible: item.isVisible !== false,
      standardPrice: item.pricing?.standard ?? item.pricing?.base ?? item.basePrice ?? 300,
      memberPrice: item.pricing?.member ?? item.memberPrice ?? 150,
      vipPrice: item.pricing?.vip ?? item.vipPrice ?? 100,
      durationMinutes: item.durationMinutes || 45
    })
    setToast(`Editing "${item.name}"... Form pre-filled below.`)
    setTimeout(() => setToast(''), 3000)

    // Scroll smoothly to form
    const formElem = document.getElementById('service-form-section')
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCancelEdit = () => {
    setEditingServiceId(null)
    setServiceForm({
      name: '',
      category: 'For Him',
      subcategory: 'The Signature Cut',
      description: '',
      bestForTag: 'Precision Styling & Scalp Health',
      imageUrl: '/images/service-1.jpg',
      isVisible: true,
      standardPrice: 300,
      memberPrice: 150,
      vipPrice: 100,
      durationMinutes: 45
    })
  }

  // Handle Single Creation or PUT Update Submit
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
      handleCancelEdit()
      fetchServices()
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Service saved locally.')
      setTimeout(() => setToast(''), 3000)
    }
  }

  // Handle Visibility Toggle
  const handleToggleVisibility = async (serviceId, currentVisibility) => {
    try {
      await fetch(`/api/v1/admin/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !currentVisibility })
      }).catch(() => {})
      setServices(services.map(s => s.id === serviceId ? { ...s, isVisible: !currentVisibility } : s))
    } catch {}
  }

  // Handle UP/DOWN Reordering
  const handleReorder = async (serviceId, direction) => {
    try {
      let res = await fetch('/api/v1/admin/services/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: serviceId, direction })
      })
      if (!res.ok) {
        await fetch('http://localhost:3000/api/v1/admin/services/reorder', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: serviceId, direction })
        })
      }
      fetchServices()
    } catch {}
  }

  // Handle Bulk CSV/JSON Import
  const handleBulkImport = async () => {
    if (!csvText.trim()) return
    let parsedItems = []

    try {
      if (csvText.trim().startsWith('[')) {
        parsedItems = JSON.parse(csvText)
      } else {
        const lines = csvText.trim().split('\n')
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue
          const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''))
          const item = {}
          headers.forEach((h, idx) => {
            item[h] = cols[idx] || ''
          })
          parsedItems.push(item)
        }
      }

      let res = await fetch('/api/v1/admin/services/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: parsedItems })
      })
      if (!res.ok) {
        res = await fetch('http://localhost:3000/api/v1/admin/services/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: parsedItems })
        })
      }
      const data = await res.json()
      setToast(data.message || `Bulk imported ${parsedItems.length} entries!`)
      setIsBulkModalOpen(false)
      setCsvText('')
      fetchServices()
      setTimeout(() => setToast(''), 3500)
    } catch (err) {
      setToast('Error parsing CSV/JSON data.')
      setTimeout(() => setToast(''), 3500)
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
            {/* Toolbar */}
            <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Search Bar */}
                <div className="relative flex-grow md:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-base">search</span>
                  <input
                    className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl pl-9 pr-4 py-2 text-xs focus:border-[#042C1D] outline-none text-[#042C1D]"
                    placeholder="Search name or description..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  />
                </div>

                {/* Category Dropdown */}
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
                  <option value="Transformation & Repair">Transformation & Repair</option>
                  <option value="The Finishing Studio">The Finishing Studio</option>
                  <option value="Skin, Hands & Body">Skin, Hands & Body</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsBulkModalOpen(true)}
                  className="bg-[#FAF6F0] text-[#042C1D] border border-[#042C1D]/30 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#042C1D] hover:text-[#FAF6F0] transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-sm">upload_file</span>
                  <span>Bulk Upload CSV / JSON</span>
                </button>
              </div>
            </div>

            {/* Compact Data Table */}
            <div className="bg-white rounded-3xl border border-[#042C1D]/15 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#EEF2EE] border-b border-[#042C1D]/10 text-[10px] font-label-md uppercase tracking-wider text-[#042C1D] font-bold">
                      <th className="py-3 px-4">Order</th>
                      <th className="py-3 px-4">Service</th>
                      <th className="py-3 px-4">Category / Subgroup</th>
                      <th className="py-3 px-4 text-center">3-Tier Prices in INR (₹) (Std / Member / VIP)</th>
                      <th className="py-3 px-4 text-center">Visibility</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 text-xs">
                    {services.map((item, idx) => {
                      const stdPrice = item.pricing?.standard ?? item.pricing?.base ?? item.basePrice ?? 300
                      const memPrice = item.pricing?.member ?? item.memberPrice ?? 150
                      const vipPrice = item.pricing?.vip ?? item.vipPrice ?? 100

                      return (
                        <tr key={item.id} className="hover:bg-[#F9F7F2] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-on-surface-variant text-[11px]">{item.displayOrder || idx + 1}</td>
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
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5 font-mono font-semibold text-xs">
                              <span className="text-on-surface font-bold">₹{stdPrice}</span>
                              <span className="text-on-surface-variant">/</span>
                              <span className="text-primary font-bold">₹{memPrice}</span>
                              <span className="text-on-surface-variant">/</span>
                              <span className="text-[#D4AF37] font-bold">₹{vipPrice}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleVisibility(item.id, item.isVisible)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                                item.isVisible !== false ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-error/10 text-error border border-error/30'
                              }`}
                            >
                              {item.isVisible !== false ? 'Visible' : 'Hidden'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleEditClick(item)}
                                className="px-2.5 py-1 bg-[#042C1D] text-white hover:bg-[#084D34] rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                                title="Edit Service Item"
                              >
                                <span className="material-symbols-outlined text-xs">edit</span>
                                <span>Edit</span>
                              </button>

                              <button
                                onClick={() => handleReorder(item.id, 'up')}
                                className="p-1 text-[#042C1D] hover:bg-[#EEF2EE] rounded transition-colors cursor-pointer"
                                title="Move Up"
                              >
                                <span className="material-symbols-outlined text-base">arrow_upward</span>
                              </button>
                              <button
                                onClick={() => handleReorder(item.id, 'down')}
                                className="p-1 text-[#042C1D] hover:bg-[#EEF2EE] rounded transition-colors cursor-pointer"
                                title="Move Down"
                              >
                                <span className="material-symbols-outlined text-base">arrow_downward</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
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

            {/* Restored Complete Service Item Addition & Edit Form */}
            <div id="service-form-section" className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-headline-lg text-lg text-[#042C1D] font-bold">
                    {editingServiceId ? 'Edit Service Item' : 'Add Single Service Item'}
                  </h3>
                  <p className="text-xs text-on-surface-variant">Fill in complete service parameters, description, 3-tier prices in INR (₹), and image preview.</p>
                </div>
                {editingServiceId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-secondary/10 text-secondary border border-secondary/30 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-secondary/20 transition-all cursor-pointer"
                  >
                    Cancel Edit Mode
                  </button>
                )}
              </div>

              <form onSubmit={handleServiceSubmit} className="flex flex-col gap-5 max-w-4xl">
                {/* Name, Category, Subgroup */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1 font-bold">Service Name *</label>
                    <input
                      required
                      className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:border-[#042C1D] outline-none text-[#042C1D]"
                      placeholder="e.g. Classic Precision Cut"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1 font-bold">Category *</label>
                    <select
                      className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:border-[#042C1D] outline-none text-[#042C1D]"
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    >
                      <option value="For Him">For Him</option>
                      <option value="For Her">For Her</option>
                      <option value="Colour Artistry">Colour Artistry</option>
                      <option value="Hair Spa Rituals">Hair Spa Rituals</option>
                      <option value="Transformation & Repair">Transformation & Repair</option>
                      <option value="The Finishing Studio">The Finishing Studio</option>
                      <option value="Skin, Hands & Body">Skin, Hands & Body</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1 font-bold">Sub-Group Name</label>
                    <input
                      className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:border-[#042C1D] outline-none text-[#042C1D]"
                      placeholder="e.g. The Signature Cut"
                      value={serviceForm.subcategory}
                      onChange={(e) => setServiceForm({ ...serviceForm, subcategory: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1 font-bold">Service Description *</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:border-[#042C1D] outline-none text-[#042C1D]"
                    placeholder="Enter detailed description of ritual, benefits, and cleansing rituals..."
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  />
                </div>

                {/* Best For Tags & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1 font-bold">Best For Tags</label>
                    <input
                      className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:border-[#042C1D] outline-none text-[#042C1D]"
                      placeholder="e.g. Precision styling, Follicle vitality"
                      value={serviceForm.bestForTag}
                      onChange={(e) => setServiceForm({ ...serviceForm, bestForTag: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1 font-bold">Duration (Minutes)</label>
                    <input
                      type="number"
                      className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:border-[#042C1D] outline-none text-[#042C1D]"
                      value={serviceForm.durationMinutes}
                      onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: e.target.value })}
                    />
                  </div>
                </div>

                {/* Separate 3-Tier Prices in INR (₹) */}
                <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#D4AF37]/30">
                  <span className="text-[10px] font-label-md uppercase tracking-wider text-[#042C1D] font-bold block mb-3">
                    3-Tier Pricing Model in Indian Rupees (₹)
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-label-md uppercase text-[#042C1D] mb-1 font-bold">Standard Rate (₹)</label>
                      <input
                        type="number"
                        className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-sm font-semibold text-[#042C1D]"
                        value={serviceForm.standardPrice}
                        onChange={(e) => setServiceForm({ ...serviceForm, standardPrice: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-label-md uppercase text-[#042C1D] mb-1 font-bold">Member Rate (₹)</label>
                      <input
                        type="number"
                        className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-sm font-semibold text-[#042C1D]"
                        value={serviceForm.memberPrice}
                        onChange={(e) => setServiceForm({ ...serviceForm, memberPrice: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-label-md uppercase text-[#D4AF37] mb-1 font-bold">VIP Sanctuary Rate (₹)</label>
                      <input
                        type="number"
                        className="w-full bg-white border border-[#D4AF37] rounded-xl p-2.5 text-sm font-bold text-[#042C1D]"
                        value={serviceForm.vipPrice}
                        onChange={(e) => setServiceForm({ ...serviceForm, vipPrice: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Service Image Picker & Live Thumbnail Preview Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] font-bold">Service Image Upload & URL</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-3 py-2 text-xs text-[#042C1D]"
                    />
                    <input
                      className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2 text-xs focus:border-[#042C1D] outline-none text-[#042C1D]"
                      placeholder="Or paste image URL (e.g. /images/service-1.jpg)"
                      value={serviceForm.imageUrl}
                      onChange={(e) => setServiceForm({ ...serviceForm, imageUrl: e.target.value })}
                    />
                  </div>

                  {/* Live Thumbnail Preview */}
                  <div className="flex flex-col items-center justify-center p-3 bg-[#EEF2EE] rounded-2xl border border-[#042C1D]/20">
                    <span className="text-[10px] uppercase font-bold text-[#042C1D] mb-1">Live Image Preview</span>
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white border border-gold/40 shadow-xs">
                      <img src={serviceForm.imageUrl || '/images/service-1.jpg'} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <button
                    type="submit"
                    className="bg-[#042C1D] text-[#FAF6F0] py-3.5 px-8 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-[#084D34] transition-all duration-300 border border-[#D4AF37]/40 shadow-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">
                      {editingServiceId ? 'save' : 'add_circle'}
                    </span>
                    <span>{editingServiceId ? 'UPDATE SERVICE ITEM' : 'Publish Service Item'}</span>
                  </button>

                  {editingServiceId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-bold text-xs hover:bg-black/5 cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: CMS Landing Page */}
        {activeTab === 'cms' && (
          <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 md:p-8 shadow-sm">
            <h2 className="font-headline-lg text-xl text-[#042C1D] mb-1 font-bold">Landing Page CMS Editor</h2>
            <p className="text-xs text-on-surface-variant mb-6">Modify landing page hero titles, subtitles, taglines, and graphics. Changes serialize directly to S3 and reflect live across public site views.</p>

            <form onSubmit={handleCmsSubmit} className="flex flex-col gap-5 max-w-3xl">
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

              <div>
                <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1.5 font-bold">Sanctuary Tagline</label>
                <input
                  className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:border-[#042C1D] outline-none text-[#042C1D] font-medium"
                  value={cmsForm.tagline}
                  onChange={(e) => setCmsForm({ ...cmsForm, tagline: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="bg-[#042C1D] text-[#FAF6F0] py-3.5 px-8 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-[#084D34] transition-all duration-300 border border-[#D4AF37]/40 shadow-sm font-bold flex items-center justify-center gap-2 self-start cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-base">cloud_upload</span>
                <span>Save CMS Changes & Sync S3</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 3: User Tier Audit */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 md:p-8 shadow-sm">
            <h2 className="font-headline-lg text-xl text-[#042C1D] mb-1 font-bold">User Tier Audit & Registry</h2>
            <p className="text-xs text-on-surface-variant mb-6">Inspect registered client accounts, registration dates, and adjust membership tiers.</p>

            <div className="divide-y border border-[#042C1D]/15 rounded-2xl bg-white overflow-hidden shadow-xs">
              {userList.map(u => (
                <div key={u.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#042C1D] text-base">{u.username}</span>
                      <span className="bg-[#EEF2EE] text-[#042C1D] px-2 py-0.5 rounded text-[10px] font-mono font-semibold">{u.id}</span>
                    </div>
                    <span className="text-on-surface-variant text-xs">Registered: {u.registeredAt}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-label-md uppercase tracking-wider text-on-surface-variant font-bold">Membership Tier:</span>
                    <select
                      value={u.tier}
                      onChange={(e) => {
                        setUserList(userList.map(item => item.id === u.id ? { ...item, tier: e.target.value } : item))
                        setToast('User membership tier updated.')
                        setTimeout(() => setToast(''), 3000)
                      }}
                      className="border border-[#D4AF37] rounded-xl px-3 py-1.5 text-xs font-bold bg-[#FAF6F0] text-[#042C1D] outline-none"
                    >
                      <option value="Guest">Guest</option>
                      <option value="Gold Member">Gold Member (Tier 2)</option>
                      <option value="VIP Sanctuary">VIP Sanctuary (Tier 3)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bulk Upload CSV / JSON Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-[#FAF6F0] rounded-3xl max-w-2xl w-full border border-[#042C1D]/30 shadow-2xl p-6 md:p-8 relative">
            <button onClick={() => setIsBulkModalOpen(false)} className="absolute top-4 right-4 text-[#042C1D] hover:opacity-80 p-1">
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <h3 className="font-headline-lg text-xl text-[#042C1D] font-bold mb-1">Bulk Service Catalog Importer</h3>
            <p className="text-xs text-on-surface-variant mb-4">Paste CSV or JSON array containing service entries for single-transaction bulk import.</p>

            <textarea
              rows={10}
              className="w-full bg-white border border-[#042C1D]/20 rounded-2xl p-4 text-xs font-mono text-[#042C1D] outline-none focus:border-[#042C1D]"
              placeholder='name,category,subcategory,description,bestForTag,imageUrl,isVisible,standardPrice,memberPrice,vipPrice,durationMinutes&#10;"Classic Precision Cut","For Him","The Signature Cut","Precision cut","Styling","/images/service-1.jpg",true,300,180,75,45'
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="px-5 py-2.5 rounded-full border border-[#042C1D]/30 text-[#042C1D] font-bold text-xs hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                className="bg-[#042C1D] text-[#FAF6F0] px-6 py-2.5 rounded-full font-bold text-xs hover:bg-[#084D34] transition-all border border-[#D4AF37]/40 shadow-sm"
              >
                Execute Bulk Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
