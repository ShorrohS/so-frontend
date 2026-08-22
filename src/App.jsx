import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import MembershipForm from './components/MembershipForm'
import ServicesAccordion from './components/ServicesAccordion'
import Philosophy from './components/Philosophy'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import BookingModal from './components/BookingModal'

export default function App() {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' })
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const handleOpenAuth = (mode = 'login') => {
    setAuthModal({ isOpen: true, mode })
  }

  const handleCloseAuth = () => {
    setAuthModal({ isOpen: false, mode: 'login' })
  }

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md bg-[#F9F7F2]">
      <Header
        onOpenAuthModal={handleOpenAuth}
        onOpenBookingModal={() => setIsBookingOpen(true)}
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
        onClose={handleCloseAuth}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  )
}
