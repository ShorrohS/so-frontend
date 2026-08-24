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

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('so_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' })
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleAuthSuccess = (userData) => {
    setUser(userData)
    try {
      localStorage.setItem('so_user', JSON.stringify(userData))
    } catch {}
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
        // Fallback update for local state
        handleAuthSuccess({ ...user, username: updatedData.username })
      }
    } catch {
      handleAuthSuccess({ ...user, username: updatedData.username })
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-[#F9F7F2]">
      <Header
        user={user}
        onOpenAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
        onOpenProfileModal={() => setIsProfileOpen(true)}
      />
      <main className="flex-grow">
        <Hero onOpenBookingModal={() => setIsBookingOpen(true)} />
        <MembershipForm />
        <ServicesAccordion onOpenBookingModal={() => setIsBookingOpen(true)} />
        <Philosophy />
      </main>
      <Footer onOpenBookingModal={() => setIsBookingOpen(true)} />

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
    </div>
  )
}
