import React from 'react'

export default function Philosophy() {
  return (
    <section className="w-full bg-light-sage py-stack-lg md:py-[96px]" id="philosophy">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">
          <div className="order-2 md:order-1 rounded-2xl overflow-hidden aspect-[4/5] relative border border-gold/30 shadow-sm bg-surface-container-lowest p-2">
            <div
              className="bg-cover bg-center w-full h-full rounded-xl transition-transform duration-700 hover:scale-105"
              data-alt="Macro close-up photography of natural botanical ingredients"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8x0o5ILiD2a0pNShMUCtp0Wk8Y3_oOBKEhYP9ScXcUla_e30Az-9HAAbO-3NnGU3tSLJrGMyd9G_y3oJl76P8aR6wIJsxyScFCQkMruX2C5btqNsWE3p5sJ3fg_YNtTfy9m8lZOhFIivX6UuGrlo1Bg17h8DcFcxWVQNE2wgb09fT3qDjJUgWZGrqMm_IJVEgdZR-8pG92hz-w8az7zJmGY4lU9RIp3CKbvPxXx5t1pGj9Gh_4a0')",
              }}
            ></div>
          </div>
          <div className="order-1 md:order-2 flex flex-col gap-6 md:pl-8 bg-surface-container-lowest p-8 md:p-12 rounded-2xl shadow-sm border border-gold/20">
            <span className="font-label-md text-gold uppercase tracking-[0.2em] font-semibold">Our Philosophy</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Rooted in Nature. Designed for You.</h2>
            <div className="w-16 h-px bg-[#D4AF37]"></div>
            <p className="text-on-surface-variant font-body-lg text-body-lg leading-relaxed">
              We believe that true beauty stems from a harmonious relationship with nature. Our sanctuary is dedicated to providing high-end, transformative experiences using only the purest organic ingredients.
            </p>
            <p className="text-on-surface-variant font-body-lg text-body-lg leading-relaxed">
              Every treatment is a ritual, carefully considered to minimize our environmental footprint while maximizing your personal well-being. We embrace quiet luxury—where sustainability meets sophisticated care.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
