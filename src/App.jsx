import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import MembershipForm from './components/MembershipForm'
import ServicesAccordion from './components/ServicesAccordion'
import Philosophy from './components/Philosophy'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import BookingModal from './components/BookingModal'
import UserProfileModal from './components/UserProfileModal'
import AdminAuthModal from './components/AdminAuthModal'
import AdminDashboardModal from './components/AdminDashboardModal'

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('so_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // Isolated Admin Session state
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem('so_admin')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' })
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false)
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false)

  // CMS Settings State
  const [cmsSettings, setCmsSettings] = useState({
    heroTitle: 'Organic Luxury for Your Hair & Soul',
    heroSubtitle: 'Experience holistic botanical hair treatments crafted with pure organic ingredients.',
    tagline: 'ORGANIC LUXURY SANCTUARY',
    bannerImage: '/images/hero-banner.jpg'
  })

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    try {
      localStorage.setItem('so_user', JSON.stringify(userData))
    } catch {}
  }

  const handleAdminSuccess = (adminData) => {
    const adminObj = adminData.admin || { username: 'admin', role: 'Super Admin' }
    setAdmin(adminObj)
    try {
      localStorage.setItem('so_admin', JSON.stringify(adminObj))
    } catch {}
    setIsAdminDashboardOpen(true)
  }

  const handleAdminLogout = () => {
    setAdmin(null)
    localStorage.removeItem('so_admin')
    setIsAdminDashboardOpen(false)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('so_user')
    setIsProfileOpen(false)
  }

  const handleUpdateProfile = async (updatedData) => {
    const payload = { id: user?.id, ...updatedData }
    try {
      const response = await fetch('/api/v1/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const resData = await response.json()
        handleAuthSuccess(resData.user)
      } else {
        handleAuthSuccess({ ...user, username: updatedData.username })
      }
    } catch {
      handleAuthSuccess({ ...user, username: updatedData.username })
    }
  }

  const handleSaveCMS = async (newCms) => {
    setCmsSettings(newCms)
    try {
      await fetch('/api/v1/admin/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCms)
      })
    } catch {}
  }

  const handleAddService = async (newService) => {
    try {
      await fetch('/api/v1/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      })
    } catch {}
  }

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-[#F9F7F2]">
      {/* Admin Sanctuary Control Bar (Visible when Admin logged in) */}
      {admin && (
        <div className="bg-[#042C1D] text-[#FAF6F0] px-4 py-2 text-xs font-semibold flex justify-between items-center z-50 border-b border-gold/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold text-base">admin_panel_settings</span>
            <span>Admin Sanctuary Mode Active ({admin.username})</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="bg-gold text-[#042C1D] px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
            >
              CMS & 3-Tier Pricing Sanctuary
            </button>
            <button
              onClick={handleAdminLogout}
              className="text-white/80 hover:text-white text-[10px] uppercase tracking-wider underline cursor-pointer"
            >
              Sign Out Admin
            </button>
          </div>
        </div>
      )}

      <Header
        user={user}
        onOpenAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
        onOpenProfileModal={() => setIsProfileOpen(true)}
      />

      <main className="flex-grow">
        <Hero cmsSettings={cmsSettings} onOpenBookingModal={() => setIsBookingOpen(true)} />
        <MembershipForm />
        <ServicesAccordion onOpenBookingModal={() => setIsBookingOpen(true)} />
        <Philosophy />
      </main>

      <Footer onOpenAdminModal={() => setIsAdminAuthOpen(true)} />

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onAuthSuccess={handleAuthSuccess}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
        onClose={() => setIsProfileOpen(false)}
      />

      <AdminAuthModal
        isOpen={isAdminAuthOpen}
        onAdminSuccess={handleAdminSuccess}
        onClose={() => setIsAdminAuthOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        cmsSettings={cmsSettings}
        onSaveCMS={handleSaveCMS}
        onAddService={handleAddService}
        onClose={() => setIsAdminDashboardOpen(false)}
      />
    </div>
  )
}
