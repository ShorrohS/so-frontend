import React from 'react'
import Logo from './Logo'

export default function Footer({ onOpenBookingModal }) {
  return (
    <footer className="bg-[#F9F7F2] w-full py-stack-lg flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-stack-md flat no shadows border-t border-gold/20">
      <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
        <Logo variant="footer" />
      </a>
      <nav className="flex flex-wrap justify-center gap-6">
        <a className="text-gold font-bold hover:text-primary transition-colors duration-200 uppercase text-xs tracking-wider" href="#services">
          Services
        </a>
        <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 uppercase text-xs tracking-wider" href="#membership">
          Membership
        </a>
        <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 uppercase text-xs tracking-wider" href="#philosophy">
          Philosophy
        </a>
        <button onClick={onOpenBookingModal} className="text-on-surface-variant hover:text-primary transition-colors duration-200 uppercase text-xs tracking-wider cursor-pointer">
          Book Appointment
        </button>
      </nav>
      <div className="text-on-surface-variant font-body-md text-body-md text-sm">
        © 2026 Salon Orgænics. All rights reserved.
      </div>
    </footer>
  )
}
