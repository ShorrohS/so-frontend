import React from 'react'
import Logo from './Logo'

export default function Header({ user, onOpenAuthModal, onOpenProfileModal, onNavigate }) {
  return (
    <header className="w-full top-0 sticky z-50 bg-[#F9F7F2]/90 backdrop-blur-sm flat no shadows border-b border-gold/10">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-stack-sm max-w-container-max mx-auto">
        <a href="#" onClick={() => onNavigate ? onNavigate('/') : (window.location.hash = '#/')} className="opacity-90 hover:opacity-100 transition-opacity">
          <Logo variant="header" />
        </a>

        {/* Header Navigation Links */}
        <nav className="hidden md:flex gap-8 items-center">
          <button
            onClick={() => onNavigate ? onNavigate('/services') : (window.location.hash = '#/services')}
            className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium tracking-wide cursor-pointer bg-transparent border-none p-0 text-base"
          >
            Services
          </button>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium tracking-wide" href="#membership">
            Membership
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium tracking-wide" href="#philosophy">
            Philosophy
          </a>
        </nav>

        {/* Right Auth / Greeting Component */}
        <div className="flex items-center">
          {user ? (
            <div
              onClick={onOpenProfileModal}
              title="Click to manage profile"
              className="cursor-pointer bg-surface-container-lowest border border-gold/40 hover:border-gold px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1.5 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-gold text-lg shrink-0">account_circle</span>
              <div
                className="max-w-[140px] overflow-x-auto whitespace-nowrap scrollbar-none font-label-md text-primary text-xs uppercase tracking-wider font-semibold"
                style={{
                  textOverflow: 'clip',
                  overflowX: 'auto',
                  maxWidth: '140px',
                  whiteSpace: 'nowrap'
                }}
              >
                Hi {user.username}
              </div>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuthModal('login')}
              className="text-primary font-label-md uppercase tracking-wider px-4 py-2 hover:text-secondary transition-colors duration-300 font-semibold border border-primary/20 rounded-full hover:border-primary/50 cursor-pointer"
            >
              Log In / Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
