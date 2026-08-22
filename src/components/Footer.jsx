import React from 'react'

export default function Footer({ onOpenBookingModal }) {
  return (
    <footer className="bg-[#F9F7F2] w-full py-stack-lg flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-stack-md flat no shadows border-t border-gold/20">
      <div className="flex items-center gap-2">
        <img
          alt="Salon Orgænics Logo"
          className="h-6 object-contain"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwGHPI7Fb59gZx6oXpeTOyBLblupVHaKCo1wvC2MVY5SiRPgr99o9Pi4QR5c03Ica6gM_8k-YZ8ClyV8ZN8aFtaabuiZG3UeiZNWBViGzaSpkxHeNpibS_MhQtsqM6K-zvFFjKSjZrRm9Uk2KVYPGKXwE61FliqomYESZlYEz0ys4ZqHUVwX0P6mIZvwpFehw4ObdKqqkLU82Q2Un7r7Z-WHXj-hHFitArYZ9CJZ48M-yE6AEgAf2PMlTjRNT-brPC"
        />
      </div>
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
