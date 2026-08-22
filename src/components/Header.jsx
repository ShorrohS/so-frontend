import React from 'react'

export default function Header({ onOpenAuthModal, onOpenBookingModal }) {
  return (
    <header class="w-full top-0 sticky z-50 bg-[#F9F7F2]/90 backdrop-blur-sm flat no shadows border-b border-gold/10">
      <div class="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-sm max-w-container-max mx-auto">
        <div class="flex items-center gap-2 cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
          <img
            alt="Salon Orgænics Logo"
            class="h-8 object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs6gHc6ab6LEcdUp1gxzoCcRX471ln2N3raTjUBZsFKt1WUi6dxKCNxHoTCE9BprVT7V8RQsfcLZTnWv9QuoHJL2UIFW9pSmxgCW7CAqR8CrkHhU7IMOPauXIRg1ccwvRX_ObjWp0vH7EMu72mn8HdIZiRSnlfbWW6hJkFbNP36cdLcUDT3g24qbla2oHBpvdX57SfEwH_fEnEQr6k2k9U2ll5t0rBqTLFP3zukM-2NfHM_5Jr2I12XTRaZGFT6eR6"
          />
        </div>
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
