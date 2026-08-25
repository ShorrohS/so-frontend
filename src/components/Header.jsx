import React, { useState, useRef, useEffect } from 'react'
import Logo from './Logo'

export default function Header({
  user,
  currentRoute = '/',
  onOpenAuthModal,
  onNavigate,
  onLogout,
  onOpenEditProfile
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNav = (path) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      window.location.hash = `#${path}`
    }
  }

  const isMySpaceActive = user && (currentRoute === '/' || currentRoute === '/my-space')
  const isServicesActive = currentRoute === '/services'

  return (
    <header className="w-full top-0 sticky z-50 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-gold/20 shadow-xs">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-3.5 max-w-container-max mx-auto">
        
        {/* Brand Logo */}
        <button
          onClick={() => handleNav(user ? '/my-space' : '/')}
          className="opacity-90 hover:opacity-100 transition-opacity border-none bg-transparent p-0 cursor-pointer text-left"
          title="Salon Orgænics Sanctuary"
        >
          <Logo variant="header" />
        </button>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex gap-8 items-center">
          {user ? (
            <>
              {/* Logged-In Main Navigation Tabs */}
              <button
                onClick={() => handleNav('/my-space')}
                className={`font-label-md uppercase tracking-wider text-xs font-bold transition-all cursor-pointer py-1.5 border-b-2 ${
                  isMySpaceActive
                    ? 'border-[#D4AF37] text-[#042C1D]'
                    : 'border-transparent text-on-surface-variant hover:text-[#042C1D]'
                }`}
              >
                My Space
              </button>

              <button
                onClick={() => handleNav('/services')}
                className={`font-label-md uppercase tracking-wider text-xs font-bold transition-all cursor-pointer py-1.5 border-b-2 ${
                  isServicesActive
                    ? 'border-[#D4AF37] text-[#042C1D]'
                    : 'border-transparent text-on-surface-variant hover:text-[#042C1D]'
                }`}
              >
                Services
              </button>

              <a
                href="#membership"
                className="font-label-md uppercase tracking-wider text-xs font-bold text-on-surface-variant hover:text-[#042C1D] transition-colors py-1.5 border-b-2 border-transparent"
              >
                Membership
              </a>
            </>
          ) : (
            <>
              {/* Logged-Out Navigation Links */}
              <button
                onClick={() => handleNav('/services')}
                className="text-on-surface-variant hover:text-primary transition-colors font-medium tracking-wide cursor-pointer bg-transparent border-none p-0 text-sm"
              >
                Services
              </button>

              <a className="text-on-surface-variant hover:text-primary transition-colors font-medium tracking-wide text-sm" href="#membership">
                Membership
              </a>

              <a className="text-on-surface-variant hover:text-primary transition-colors font-medium tracking-wide text-sm" href="#philosophy">
                Philosophy
              </a>
            </>
          )}
        </nav>

        {/* Right User Badge / Auth CTA */}
        <div className="flex items-center relative" ref={dropdownRef}>
          {user ? (
            <div className="relative">
              {/* Logged-In User Badge */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-[#042C1D] text-[#FAF6F0] hover:bg-[#084D34] border border-[#D4AF37]/50 px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-2 transition-all duration-300 cursor-pointer"
                title="Account Menu"
              >
                <span className="material-symbols-outlined text-gold text-lg shrink-0">account_circle</span>
                <span className="font-label-md text-xs uppercase tracking-wider font-bold max-w-[120px] truncate text-white">
                  Hi {user.username}
                </span>
                <span className="material-symbols-outlined text-gold text-sm transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  expand_more
                </span>
              </button>

              {/* User Profile Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#FAF6F0] rounded-2xl border border-gold/40 shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-gold/20 mb-1">
                    <span className="text-[10px] text-gold uppercase font-bold tracking-widest block">Logged In As</span>
                    <span className="text-xs font-bold text-[#042C1D] font-mono truncate block">{user.username}</span>
                    <span className="bg-[#D4AF37]/20 text-[#042C1D] text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block uppercase">
                      {user.tier || 'Gold Member'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      if (onOpenEditProfile) onOpenEditProfile()
                      else handleNav('/my-space')
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#042C1D] hover:bg-gold/15 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base text-gold">edit</span>
                    <span>Edit Account Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      alert('Sanctuary Preferences set to Default View.')
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#042C1D] hover:bg-gold/15 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base text-gold">settings</span>
                    <span>Preferences</span>
                  </button>

                  <div className="h-px bg-gold/20 my-1"></div>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      if (onLogout) onLogout()
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-error hover:bg-error/10 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base text-error">logout</span>
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
              className="bg-secondary text-on-secondary font-label-md uppercase tracking-wider px-4 py-2 hover:bg-on-secondary-fixed-variant transition-colors duration-300 text-xs font-bold rounded-full border border-gold/30 cursor-pointer shadow-xs"
            >
              Log In / Sign Up
            </button>
          )}
        </div>

      </div>
    </header>
  )
}
