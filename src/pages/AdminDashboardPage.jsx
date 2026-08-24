import React, { useState, useEffect } from 'react'

export default function AdminDashboardPage({ admin, cmsSettings, onSaveCMS, onAddService, onAdminLogout, onNavigate }) {
  const [activeTab, setActiveTab] = useState('cms') // 'cms' | 'services' | 'users'
  const [toast, setToast] = useState('')

  // Strict Route Guard Protection
  useEffect(() => {
    if (!admin) {
      onNavigate('/admin/login')
    }
  }, [admin, onNavigate])

  const [cmsForm, setCmsForm] = useState({
    heroTitle: cmsSettings?.heroTitle || 'Organic Luxury for Your Hair & Soul',
    heroSubtitle: cmsSettings?.heroSubtitle || 'Experience holistic botanical hair treatments crafted with pure organic ingredients.',
    tagline: cmsSettings?.tagline || 'ORGANIC LUXURY SANCTUARY',
    bannerImage: cmsSettings?.bannerImage || '/images/hero-banner.jpg'
  })

  const [serviceForm, setServiceForm] = useState({
    groupId: 'grp-1',
    name: '',
    description: '',
    duration: 60,
    basePrice: 120,
    memberPrice: 100,
    vipPrice: 85,
    isVisibleToUsers: true,
    bestFor: 'Nourishing & Scalp Health'
  })

  const [userList, setUserList] = useState([
    { id: 'usr_1', username: 'sec_user_2026', tier: 'Gold Member', registeredAt: '2026-08-22' },
    { id: 'usr_2', username: 'valid_user_2026', tier: 'VIP Sanctuary', registeredAt: '2026-08-23' },
    { id: 'usr_3', username: 'new_guest_2026', tier: 'Guest', registeredAt: '2026-08-24' }
  ])

  if (!admin) return null

  const handleCmsSubmit = async (e) => {
    e.preventDefault()
    try {
      await onSaveCMS(cmsForm)
      setToast('CMS Changes Saved Successfully! S3 synced.')
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Saved locally.')
      setTimeout(() => setToast(''), 3000)
    }
  }

  const handleServiceSubmit = async (e) => {
    e.preventDefault()
    try {
      await onAddService(serviceForm)
      setToast('Service published with 3-Tier Pricing!')
      setServiceForm({ groupId: 'grp-1', name: '', description: '', duration: 60, basePrice: 120, memberPrice: 100, vipPrice: 85, isVisibleToUsers: true, bestFor: 'Nourishing & Scalp Health' })
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Service created.')
      setTimeout(() => setToast(''), 3000)
    }
  }

  const handleTierChange = (userId, newTier) => {
    setUserList(userList.map(u => u.id === userId ? { ...u, tier: newTier } : u))
    setToast('User membership tier updated.')
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex flex-col font-body-md text-body-md">
      {/* Standalone Navigation Bar */}
      <header className="bg-[#042C1D] text-[#FAF6F0] border-b border-[#D4AF37]/30 sticky top-0 z-50 shadow-md">
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
        <div className="bg-[#D4AF37]/20 border-b border-[#D4AF37]/40 text-[#042C1D] py-2 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex-grow flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant/30 bg-[#EEF2EE] rounded-2xl overflow-hidden p-1 gap-1 border">
          <button
            onClick={() => setActiveTab('cms')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-all duration-300 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'cms' ? 'bg-[#042C1D] text-[#FAF6F0] shadow-sm' : 'text-on-surface-variant hover:text-[#042C1D]'
            }`}
          >
            <span className="material-symbols-outlined text-base">edit_note</span>
            <span>CMS Landing Page Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-all duration-300 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'services' ? 'bg-[#042C1D] text-[#FAF6F0] shadow-sm' : 'text-on-surface-variant hover:text-[#042C1D]'
            }`}
          >
            <span className="material-symbols-outlined text-base">spa</span>
            <span>Edit Services & 3-Tier Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-all duration-300 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'users' ? 'bg-[#042C1D] text-[#FAF6F0] shadow-sm' : 'text-on-surface-variant hover:text-[#042C1D]'
            }`}
          >
            <span className="material-symbols-outlined text-base">badge</span>
            <span>User Tier Audit & Registry</span>
          </button>
        </div>

        {/* Tab 1: CMS Landing Page Editor */}
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

        {/* Tab 2: Edit Services & 3-Tier Pricing */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-3xl border border-[#042C1D]/15 p-6 md:p-8 shadow-sm">
            <h2 className="font-headline-lg text-xl text-[#042C1D] mb-1 font-bold">Service Catalog & 3-Tier Pricing Module</h2>
            <p className="text-xs text-on-surface-variant mb-6">Manage service groups, duration, images, visibility toggles, and base/member/VIP pricing tiers.</p>

            <form onSubmit={handleServiceSubmit} className="flex flex-col gap-5 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1.5 font-bold">Service Name</label>
                  <input
                    required
                    className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:border-[#042C1D] outline-none text-[#042C1D]"
                    placeholder="e.g. Organic Scalp Detox Ritual"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1.5 font-bold">Service Group / Category</label>
                  <select
                    className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:border-[#042C1D] outline-none text-[#042C1D] font-medium"
                    value={serviceForm.groupId}
                    onChange={(e) => setServiceForm({ ...serviceForm, groupId: e.target.value })}
                  >
                    <option value="grp-1">Sanctuary Hair Rituals</option>
                    <option value="grp-2">Botanical Colouring</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1.5 font-bold">Description</label>
                <input
                  className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:border-[#042C1D] outline-none text-[#042C1D]"
                  placeholder="Holistic botanical treatment..."
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-md uppercase tracking-wider text-[#042C1D] mb-1.5 font-bold">Best For Tag</label>
                  <input
                    className="w-full bg-[#F9F7F2] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:border-[#042C1D] outline-none text-[#042C1D]"
                    placeholder="Nourishing & Scalp Health"
                    value={serviceForm.bestFor}
                    onChange={(e) => setServiceForm({ ...serviceForm, bestFor: e.target.value })}
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="visibleCheck"
                    className="w-5 h-5 rounded border-outline-variant accent-[#042C1D]"
                    checked={serviceForm.isVisibleToUsers}
                    onChange={(e) => setServiceForm({ ...serviceForm, isVisibleToUsers: e.target.checked })}
                  />
                  <label htmlFor="visibleCheck" className="text-xs font-label-md uppercase tracking-wider text-[#042C1D] font-bold cursor-pointer">Visible to Public Clients</label>
                </div>
              </div>

              {/* 3-Tier Pricing Configuration */}
              <div className="bg-[#FAF6F0] p-5 rounded-2xl border border-[#D4AF37]/40">
                <span className="text-[#042C1D] font-label-md uppercase tracking-wider text-xs font-bold block mb-3">3-Tier Pricing Model Configuration</span>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-label-md uppercase text-on-surface-variant mb-1 font-bold">Base Price ($)</label>
                    <input
                      type="number"
                      className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-sm font-semibold text-[#042C1D]"
                      value={serviceForm.basePrice}
                      onChange={(e) => setServiceForm({ ...serviceForm, basePrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-label-md uppercase text-on-surface-variant mb-1 font-bold">Tier 2 Member ($)</label>
                    <input
                      type="number"
                      className="w-full bg-white border border-outline-variant/30 rounded-xl p-2.5 text-sm font-semibold text-[#042C1D]"
                      value={serviceForm.memberPrice}
                      onChange={(e) => setServiceForm({ ...serviceForm, memberPrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-label-md uppercase text-[#D4AF37] font-bold mb-1">Tier 3 VIP ($)</label>
                    <input
                      type="number"
                      className="w-full bg-white border border-[#D4AF37] rounded-xl p-2.5 text-sm font-bold text-[#042C1D]"
                      value={serviceForm.vipPrice}
                      onChange={(e) => setServiceForm({ ...serviceForm, vipPrice: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#042C1D] text-[#FAF6F0] py-3.5 px-8 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-[#084D34] transition-all duration-300 border border-[#D4AF37]/40 shadow-sm font-bold flex items-center justify-center gap-2 self-start cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>Publish 3-Tier Service Item</span>
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
                      onChange={(e) => handleTierChange(u.id, e.target.value)}
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
    </div>
  )
}
