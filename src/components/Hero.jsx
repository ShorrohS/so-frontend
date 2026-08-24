import React from 'react'
import Logo from './Logo'

export default function Hero({ cmsSettings, onOpenBookingModal }) {
  const title = cmsSettings?.heroTitle || 'Beauty, Naturally Defined.'
  const subtitle = cmsSettings?.heroSubtitle || 'Organic hair and skin treatments tailored to your natural glow. Experience professional excellence rooted in botanical tranquility.'
  const tagline = cmsSettings?.tagline || 'ORGANIC SANCTUARY'

  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center px-margin-mobile md:px-margin-desktop py-stack-lg bg-[#F9F7F2]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="bg-cover bg-center w-full h-full opacity-60 scale-105 transition-transform duration-1000"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA6rezLe2pPOwxQXqGeODWfkpH1V1rVXZJcd7366iTDdk4Wq0vOkdy6F4FKHtsnctC0nKViRJTPQgBjWjNTgaP0vn0z4Q1D6_mqfwywmFTjmQB__aizY5lMvCvVk9lgr0P21KzEVJAeOADeyjlqWWyuahmCp0nG9WuXsEC1-chU_nSylDyVgTXFrtdEkM_5fSGM-eYwIuWJ_CLjRZFgZtv7zo9SsVN7SgJ8h2101ynfdSEIj_nmvGw')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#F9F7F2]/40 via-[#F9F7F2]/70 to-[#F9F7F2]"></div>
      </div>
      <div className="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center gap-stack-md mt-16 md:mt-0">
        <Logo variant="hero" className="mb-4" />
        <span className="text-gold font-label-md uppercase tracking-[0.2em] mb-2 font-semibold">
          {tagline}
        </span>
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-background">
          {title}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="w-12 h-px bg-[#D4AF37] mb-2"></div>
          <button
            onClick={onOpenBookingModal}
            className="bg-secondary text-on-secondary px-10 py-4 rounded-full font-label-md uppercase tracking-wider shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-[#D4AF37]/30"
          >
            Book an Appointment
          </button>
        </div>
      </div>
    </section>
  )
}
