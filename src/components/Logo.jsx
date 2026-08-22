import React from 'react'

export default function Logo({ variant = 'header', className = '' }) {
  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center text-center group cursor-pointer ${className}`}>
        {/* Vector SVG Monogram / Emblem */}
        <div className="relative mb-3 flex items-center justify-center">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-24 h-24 md:w-32 md:h-32 text-primary transition-transform duration-500 group-hover:scale-105"
          >
            {/* Outer Decorative Circle */}
            <circle cx="60" cy="60" r="56" stroke="#D4AF37" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.6" />
            <circle cx="60" cy="60" r="50" stroke="#56624b" strokeWidth="1" opacity="0.4" />
            
            {/* Botanical Leaves Motif */}
            <path
              d="M60 22C60 22 45 42 45 60C45 78 60 98 60 98C60 98 75 78 75 60C75 42 60 22 60 22Z"
              fill="#56624b"
              fillOpacity="0.15"
              stroke="#56624b"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M60 22V98"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M60 42C52 48 48 56 48 64"
              stroke="#56624b"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M60 52C68 58 72 66 72 74"
              stroke="#D4AF37"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            
            {/* Elegant Corner Dots */}
            <circle cx="60" cy="14" r="2.5" fill="#D4AF37" />
            <circle cx="60" cy="106" r="2.5" fill="#D4AF37" />
            <circle cx="14" cy="60" r="2.5" fill="#56624b" />
            <circle cx="106" cy="60" r="2.5" fill="#56624b" />
          </svg>
        </div>

        {/* Crisp Serif Typography */}
        <div className="flex flex-col items-center">
          <span className="font-headline-lg text-2xl md:text-4xl text-on-background tracking-[0.12em] uppercase font-normal font-serif">
            Salon Orgænics
          </span>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="w-8 h-[1px] bg-gold/60"></div>
            <span className="text-gold font-label-md text-[10px] md:text-xs uppercase tracking-[0.35em] font-medium">
              Beauty • Sanctuary
            </span>
            <div className="w-8 h-[1px] bg-gold/60"></div>
          </div>
        </div>
      </div>
    )
  }

  // Header & Footer Vector Logo Implementation
  const isFooter = variant === 'footer'
  const iconSize = isFooter ? 'w-6 h-6' : 'w-7 h-7'
  const textSize = isFooter ? 'text-base md:text-lg' : 'text-lg md:text-xl'

  return (
    <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
      <svg
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSize} text-primary shrink-0 transition-transform duration-300 group-hover:rotate-6`}
      >
        <circle cx="30" cy="30" r="28" stroke="#D4AF37" strokeWidth="1.5" strokeOpacity="0.7" />
        <path
          d="M30 10C30 10 20 22 20 31C20 40 30 50 30 50C30 50 40 40 40 31C40 22 30 10 30 10Z"
          fill="#56624b"
          fillOpacity="0.2"
          stroke="#56624b"
          strokeWidth="1.5"
        />
        <path d="M30 10V50" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className={`font-headline-lg ${textSize} text-on-background tracking-[0.08em] uppercase font-serif`}>
          Salon Orgænics
        </span>
        <span className="text-gold text-[9px] uppercase tracking-[0.25em] font-medium mt-0.5">
          Botanical Care
        </span>
      </div>
    </div>
  )
}
