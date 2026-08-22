import React from 'react'

export default function Hero({ onOpenBookingModal }) {
  return (
    <section class="relative w-full min-h-[80vh] flex items-center justify-center px-margin-mobile md:px-margin-desktop py-stack-lg bg-[#F9F7F2]">
      <div class="absolute inset-0 z-0 overflow-hidden">
        <div
          class="bg-cover bg-center w-full h-full opacity-60 scale-105 transition-transform duration-1000"
          data-alt="Abstract botanical texture background"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA6rezLe2pPOwxQXqGeODWfkpH1V1rVXZJcd7366iTDdk4Wq0vOkdy6F4FKHtsnctC0nKViRJTPQgBjWjNTgaP0vn0z4Q1D6_mqfwywmFTjmQB__aizY5lMvCvVk9lgr0P21KzEVJAeOADeyjlqWWyuahmCp0nG9WuXsEC1-chU_nSylDyVgTXFrtdEkM_5fSGM-eYwIuWJ_CLjRZFgZtv7zo9SsVN7SgJ8h2101ynfdSEIj_nmvGw')",
          }}
        ></div>
        <div class="absolute inset-0 bg-gradient-to-b from-[#F9F7F2]/40 via-[#F9F7F2]/70 to-[#F9F7F2]"></div>
      </div>
      <div class="relative z-10 text-center max-w-3xl mx-auto flex flex-col items-center gap-stack-md mt-16 md:mt-0">
        <img
          alt="Salon Orgænics Logo"
          class="h-32 md:h-48 object-contain mb-4 opacity-90 transition-opacity hover:opacity-100"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGjxMrNAoqzLnjiH-wGT55_xZuzqp9HeLtpbEjGOq-7DBQRJpULUGZ4pWKbZlYwzIE4zYcdgNT0xT8ENopzANWy9LV8fUETlBXzgc8XEjj0YTC4QHA4a_cyDmySGO-q45-JGYE3zSmlBT-C8zwihix0TQ5eb_C_igtWwWXmxQCzGjC86D02ockxHlIpBvckSx4JT1Yu9d6iClOH00jt4RE6kg6SOkgmO2hI-p-H6mxtYCpfb80tFgIt6pZTyp7uWRS"
        />
        <span class="text-gold font-label-md uppercase tracking-[0.2em] mb-2 font-semibold">
          Organic Sanctuary
        </span>
        <h1 class="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-background">
          Beauty, Naturally Defined.
        </h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          Organic hair and skin treatments tailored to your natural glow. Experience professional excellence rooted in botanical tranquility.
        </p>
        <div class="mt-8 flex flex-col items-center gap-4">
          <div class="w-12 h-px bg-[#D4AF37] mb-2"></div>
          <button
            onClick={onOpenBookingModal}
            class="bg-secondary text-on-secondary px-10 py-4 rounded-full font-label-md uppercase tracking-wider shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-[#D4AF37]/30"
          >
            Book an Appointment
          </button>
        </div>
      </div>
    </section>
  )
}
