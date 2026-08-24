import React from 'react'
import Logo from './Logo'

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-[#F9F7F2] w-full py-stack-lg flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-stack-md flat no shadows border-t border-gold/20">
      <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">
        <Logo variant="footer" />
      </a>

      <nav className="flex flex-wrap justify-center gap-6 items-center">
        <a className="text-gold font-bold hover:text-primary transition-colors duration-200 uppercase text-xs tracking-wider" href="#services">
          Services
        </a>
        <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 uppercase text-xs tracking-wider" href="#membership">
          Membership
        </a>
        <a className="text-on-surface-variant hover:text-primary transition-colors duration-200 uppercase text-xs tracking-wider" href="#philosophy">
          Philosophy
        </a>

        {/* Dedicated Standalone Admin Access Badge Button (#FAF6F0 background, #042C1D text styling) */}
        <button
          onClick={() => onNavigate ? onNavigate('/admin/dashboard') : (window.location.hash = '#/admin/dashboard')}
          className="bg-[#FAF6F0] text-[#042C1D] hover:bg-[#042C1D] hover:text-[#FAF6F0] border border-[#042C1D]/30 px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
          <span>Admin Access</span>
        </button>
      </nav>

      <div className="text-on-surface-variant font-body-md text-body-md text-sm">
        © 2026 Salon Orgænics. All rights reserved.
      </div>
    </footer>
  )
}
