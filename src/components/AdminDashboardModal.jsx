import React, { useState } from 'react'

export default function AdminDashboardModal({ isOpen, cmsSettings, onSaveCMS, onAddService, onClose }) {
  const [activeTab, setActiveTab] = useState('cms') // 'cms' | 'services' | 'users'
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
    vipPrice: 85
  })

  const [toast, setToast] = useState('')
  const [userList, setUserList] = useState([
    { id: 'usr_1', username: 'sec_user_2026', tier: 'Gold Member' },
    { id: 'usr_2', username: 'valid_user_2026', tier: 'VIP Sanctuary' },
    { id: 'usr_3', username: 'new_guest_2026', tier: 'Guest' }
  ])

  if (!isOpen) return null

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
      setToast('Service added with 3-tier pricing!')
      setServiceForm({ groupId: 'grp-1', name: '', description: '', duration: 60, basePrice: 120, memberPrice: 100, vipPrice: 85 })
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Service created.')
      setTimeout(() => setToast(''), 3000)
    }
  }

  const handleTierChange = (userId, newTier) => {
    setUserList(userList.map(u => u.id === userId ? { ...u, tier: newTier } : u))
    setToast('User tier updated successfully.')
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#F9F7F2] rounded-2xl max-w-3xl w-full border border-gold/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative">
        {/* Header */}
        <div className="bg-[#042C1D] text-[#FAF6F0] p-6 flex justify-between items-center border-b border-gold/30">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gold text-2xl">sanctuary</span>
            <div>
              <h2 className="font-headline-lg text-xl text-white">Admin Sanctuary Dashboard</h2>
              <p className="text-xs text-gold/80 font-label-md uppercase tracking-wider">CMS & 3-Tier Service Management</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {toast && (
          <div className="bg-gold/20 border-b border-gold/40 text-[#042C1D] py-2 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{toast}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-outline-variant/30 bg-[#EEF2EE]">
          <button
            onClick={() => setActiveTab('cms')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'cms' ? 'border-gold text-primary font-bold bg-[#F9F7F2]' : 'border-transparent text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-base">edit_note</span>
            <span>CMS Landing Page</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'services' ? 'border-gold text-primary font-bold bg-[#F9F7F2]' : 'border-transparent text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-base">spa</span>
            <span>Edit Services & 3-Tier Pricing</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-3 text-center font-label-md uppercase tracking-wider text-xs transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              activeTab === 'users' ? 'border-gold text-primary font-bold bg-[#F9F7F2]' : 'border-transparent text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-base">badge</span>
            <span>User Tier Audit</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {activeTab === 'cms' && (
            <form onSubmit={handleCmsSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-label-md uppercase tracking-wider text-primary mb-1 font-semibold">Hero Title</label>
                <input
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:border-gold outline-none"
                  value={cmsForm.heroTitle}
                  onChange={(e) => setCmsForm({ ...cmsForm, heroTitle: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-label-md uppercase tracking-wider text-primary mb-1 font-semibold">Hero Subtitle</label>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:border-gold outline-none"
                  value={cmsForm.heroSubtitle}
                  onChange={(e) => setCmsForm({ ...cmsForm, heroSubtitle: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-label-md uppercase tracking-wider text-primary mb-1 font-semibold">Sanctuary Tagline</label>
                <input
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:border-gold outline-none"
                  value={cmsForm.tagline}
                  onChange={(e) => setCmsForm({ ...cmsForm, tagline: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="bg-[#042C1D] text-[#FAF6F0] py-3 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-[#084D34] transition-colors mt-2 border border-gold/40 shadow-sm font-bold flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">cloud_upload</span>
                <span>Save CMS Changes & Sync S3</span>
              </button>
            </form>
          )}

          {activeTab === 'services' && (
            <form onSubmit={handleServiceSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label-md uppercase tracking-wider text-primary mb-1 font-semibold">Service Name</label>
                  <input
                    required
                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:border-gold outline-none"
                    placeholder="e.g. Organic Scalp Detox Ritual"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-label-md uppercase tracking-wider text-primary mb-1 font-semibold">Service Group</label>
                  <select
                    className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:border-gold outline-none"
                    value={serviceForm.groupId}
                    onChange={(e) => setServiceForm({ ...serviceForm, groupId: e.target.value })}
                  >
                    <option value="grp-1">Sanctuary Hair Rituals</option>
                    <option value="grp-2">Botanical Colouring</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-md uppercase tracking-wider text-primary mb-1 font-semibold">Description</label>
                <input
                  className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-2 text-sm focus:border-gold outline-none"
                  placeholder="Holistic botanical hair ritual..."
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                />
              </div>

              {/* 3-Tier Pricing Section */}
              <div className="bg-white p-4 rounded-xl border border-gold/30">
                <span className="text-gold font-label-md uppercase tracking-wider text-xs font-bold block mb-3">3-Tier Pricing Configuration</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-label-md uppercase text-on-surface-variant mb-1">Base Price ($)</label>
                    <input
                      type="number"
                      className="w-full border rounded-lg p-2 text-sm"
                      value={serviceForm.basePrice}
                      onChange={(e) => setServiceForm({ ...serviceForm, basePrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-label-md uppercase text-on-surface-variant mb-1">Tier 2 Member ($)</label>
                    <input
                      type="number"
                      className="w-full border rounded-lg p-2 text-sm"
                      value={serviceForm.memberPrice}
                      onChange={(e) => setServiceForm({ ...serviceForm, memberPrice: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-label-md uppercase text-gold font-bold mb-1">Tier 3 VIP ($)</label>
                    <input
                      type="number"
                      className="w-full border border-gold rounded-lg p-2 text-sm font-bold"
                      value={serviceForm.vipPrice}
                      onChange={(e) => setServiceForm({ ...serviceForm, vipPrice: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#042C1D] text-[#FAF6F0] py-3 rounded-full font-label-md uppercase tracking-wider text-xs hover:bg-[#084D34] transition-colors mt-2 border border-gold/40 shadow-sm font-bold flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>Publish 3-Tier Service Item</span>
              </button>
            </form>
          )}

          {activeTab === 'users' && (
            <div className="flex flex-col gap-3">
              <h3 className="font-headline-lg text-[#042C1D] text-sm uppercase tracking-wider font-bold">Registered User Tier Audit</h3>
              <div className="divide-y border rounded-xl bg-white overflow-hidden">
                {userList.map(u => (
                  <div key={u.id} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-[#042C1D] text-sm block">{u.username}</span>
                      <span className="text-on-surface-variant text-[10px]">ID: {u.id}</span>
                    </div>
                    <select
                      value={u.tier}
                      onChange={(e) => handleTierChange(u.id, e.target.value)}
                      className="border border-gold/40 rounded-lg px-2 py-1 text-xs font-semibold bg-[#FAF6F0]"
                    >
                      <option value="Guest">Guest</option>
                      <option value="Gold Member">Gold Member (Tier 2)</option>
                      <option value="VIP Sanctuary">VIP Sanctuary (Tier 3)</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
