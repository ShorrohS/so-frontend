import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import MembershipForm from './components/MembershipForm'
import ServicesAccordion from './components/ServicesAccordion'
import Philosophy from './components/Philosophy'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import BookingModal from './components/BookingModal'
import UserProfileModal from './components/UserProfileModal'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import ServicesPage from './pages/ServicesPage'
import MySpacePage from './pages/MySpacePage'

export default function App() {
  // Hash & Pathname Route State (Supports /, /services, /my-space, /admin/login, /admin/dashboard)
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === '/services' || window.location.pathname === '/services') return '/services'
    if (hash === '/my-space' || window.location.pathname === '/my-space') return '/my-space'
    if (hash === '/admin/login' || window.location.pathname === '/admin/login') return '/admin/login'
    if (hash === '/admin/dashboard' || window.location.pathname === '/admin/dashboard') return '/admin/dashboard'
    return '/'
  })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === '/services') setCurrentRoute('/services')
      else if (hash === '/my-space') setCurrentRoute('/my-space')
      else if (hash === '/admin/login') setCurrentRoute('/admin/login')
      else if (hash === '/admin/dashboard') setCurrentRoute('/admin/dashboard')
      else if (hash === '/' || hash === '') setCurrentRoute('/')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (path) => {
    setCurrentRoute(path)
    window.location.hash = `#${path}`
  }

  // Client User State
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('so_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // Isolated Admin Session State
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
  const [externalEditProfile, setExternalEditProfile] = useState(false)

  // Dynamic CMS Settings State
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
    navigate('/my-space')
  }

  const handleAdminLogin = (adminData) => {
    const adminObj = adminData.admin || { username: 'admin', role: 'Super Admin' }
    setAdmin(adminObj)
    try {
      localStorage.setItem('so_admin', JSON.stringify(adminObj))
    } catch {}
  }

  const handleAdminLogout = () => {
    setAdmin(null)
    localStorage.removeItem('so_admin')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('so_user')
    setIsProfileOpen(false)
    setExternalEditProfile(false)
    navigate('/')
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

  // --- ROUTE SWITCHER ---

  // 1. Standalone Admin Login View (/admin/login)
  if (currentRoute === '/admin/login') {
    return (
      <AdminLoginPage
        onAdminLogin={handleAdminLogin}
        onNavigate={navigate}
      />
    )
  }

  // 2. Standalone Admin Dashboard View (/admin/dashboard with Route Guard)
  if (currentRoute === '/admin/dashboard') {
    return (
      <AdminDashboardPage
        admin={admin}
        cmsSettings={cmsSettings}
        onSaveCMS={handleSaveCMS}
        onAddService={handleAddService}
        onAdminLogout={handleAdminLogout}
        onNavigate={navigate}
      />
    )
  }

  // 3. Services Menu Route (/services)
  if (currentRoute === '/services') {
    return (
      <>
        <ServicesPage
          user={user}
          onOpenBookingModal={() => setIsBookingOpen(true)}
          onNavigate={navigate}
          onOpenAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
          onLogout={handleLogout}
          onOpenEditProfile={() => {
            navigate('/my-space')
            setExternalEditProfile(true)
          }}
        />
        <BookingModal
          isOpen={isBookingOpen}
          user={user}
          onClose={() => setIsBookingOpen(false)}
        />
        <AuthModal
          isOpen={authModal.isOpen}
          mode={authModal.mode}
          onAuthSuccess={handleAuthSuccess}
          onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        />
      </>
    )
  }

  // 4. Authenticated User Landing Page (/ or /my-space when user is logged in)
  if (user && (currentRoute === '/' || currentRoute === '/my-space')) {
    return (
      <div className="min-h-screen flex flex-col font-body-md text-body-md bg-[#F9F7F2]">
        <Header
          user={user}
          currentRoute={currentRoute}
          onOpenAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
          onNavigate={navigate}
          onLogout={handleLogout}
          onOpenEditProfile={() => setExternalEditProfile(true)}
        />

        <main className="flex-grow">
          <MySpacePage
            user={user}
            onNavigate={navigate}
            onUpdateUser={handleAuthSuccess}
            onOpenAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
            externalEditProfile={externalEditProfile}
            onCloseExternalEditProfile={() => setExternalEditProfile(false)}
          />
        </main>

        <Footer onNavigate={navigate} />

        <BookingModal
          isOpen={isBookingOpen}
          user={user}
          onClose={() => setIsBookingOpen(false)}
        />
      </div>
    )
  }

  // 5. Logged-Out Public Landing Page View (/)
  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-[#F9F7F2]">
      {admin && (
        <div className="bg-[#042C1D] text-[#FAF6F0] px-4 py-2 text-xs font-semibold flex justify-between items-center z-50 border-b border-gold/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold text-base">admin_panel_settings</span>
            <span>Admin Sanctuary Mode Active ({admin.username})</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="bg-gold text-[#042C1D] px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
            >
              Open Admin Sanctuary Dashboard
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
        currentRoute={currentRoute}
        onOpenAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
        onNavigate={navigate}
        onLogout={handleLogout}
        onOpenEditProfile={() => setExternalEditProfile(true)}
      />

      <main className="flex-grow">
        <Hero cmsSettings={cmsSettings} onOpenBookingModal={() => setIsBookingOpen(true)} />
        <MembershipForm />
        <ServicesAccordion onOpenBookingModal={() => setIsBookingOpen(true)} onNavigate={navigate} />
        <Philosophy />
      </main>

      <Footer onNavigate={navigate} />

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onAuthSuccess={handleAuthSuccess}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
      />

      <BookingModal
        isOpen={isBookingOpen}
        user={user}
        onClose={() => setIsBookingOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  )
}
