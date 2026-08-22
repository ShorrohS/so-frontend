import React from 'react'
import Logo from './Logo'

export default function Header({ onOpenAuthModal, onOpenBookingModal }) {
  return (
    <header className="w-full top-0 sticky z-50 bg-[#F9F7F2]/90 backdrop-blur-sm flat no shadows border-b border-gold/10">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-sm max-w-container-max mx-auto">
        <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
          <Logo variant="header" />
        </a>
        <nav class="hidden md:flex gap-6 items-center">
          <a class="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium" href="#services">
            Services
          </a>
          <a class="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium" href="#membership">
            Membership
          </a>
          <a class="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium" href="#philosophy">
            Philosophy
          </a>
          <a class="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium" href="#philosophy">
            Stylists
          </a>
        </nav>
        <div class="flex items-center">
          <button
            onClick={() => onOpenAuthModal('login')}
            class="text-primary font-label-md uppercase tracking-wider px-4 py-3 hover:text-secondary transition-colors duration-300 mr-2"
          >
            Log In / Sign Up
          </button>
          <button
            onClick={onOpenBookingModal}
            class="bg-secondary text-on-secondary px-8 py-3 rounded-full font-label-md uppercase tracking-wider hover:bg-on-secondary-fixed-variant transition-all duration-300 shadow-sm hover:shadow"
          >
            Book Now
          </button>
        </div>
      </div>
    </header>
  )
}
