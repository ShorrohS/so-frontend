import React, { useState } from 'react'

export default function ServicesAccordion({ onOpenBookingModal }) {
  const [openIndices, setOpenIndices] = useState([0]) // default first open

  const services = [
    {
      title: 'Hair Styling',
      icon: 'content_cut',
      price: 'From $85',
      description: 'Bespoke cuts and holistic styling using pure, plant-based products to nourish your scalp and enhance your natural texture.'
    },
    {
      title: 'Organic Facials',
      icon: 'face',
      price: 'From $120',
      description: "Rejuvenating treatments tailored to your skin's unique needs, utilizing potent, ethically sourced botanical extracts and gentle massage."
    },
    {
      title: 'Botanical Treatments',
      icon: 'local_florist',
      price: 'From $150',
      description: 'Deeply restorative holistic body rituals designed to align your physical and mental well-being in a serene environment.'
    }
  ]

  const toggleService = (index) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter(i => i !== index))
    } else {
      setOpenIndices([...openIndices, index])
    }
  }

  return (
    <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg md:py-[96px] bg-[#F9F7F2]" id="services">
      <div className="text-center mb-stack-lg">
        <span className="text-gold font-label-md uppercase tracking-[0.2em] mb-4 block font-semibold">Our Offerings</span>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-6">Curated Services</h2>
        <div className="w-24 h-px bg-[#D4AF37] mx-auto"></div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {services.map((service, index) => {
          const isOpen = openIndices.includes(index)
          return (
            <div
              key={service.title}
              className={`bg-surface-container-lowest rounded-xl border transition-all duration-300 shadow-sm overflow-hidden ${
                isOpen ? 'border-gold/60 ring-1 ring-gold/20' : 'border-outline-variant/20 hover:border-gold/40'
              }`}
            >
              <button
                onClick={() => toggleService(index)}
                className="w-full flex justify-between items-center p-6 md:p-8 cursor-pointer text-left focus:outline-none"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
                    isOpen ? 'border-gold text-gold bg-gold/5' : 'border-gold/40 text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-2xl font-light">{service.icon}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-background">{service.title}</h3>
                </div>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-transform duration-300 ${
                  isOpen ? 'border-gold/50 text-gold rotate-45' : 'border-outline-variant/30 text-primary'
                }`}>
                  <span className="material-symbols-outlined text-lg">add</span>
                </div>
              </button>

              {isOpen && (
                <div className="px-6 md:px-8 pb-8 pt-0 ml-0 md:ml-[72px] animate-fadeIn">
                  <p className="text-on-surface-variant mb-6 font-body-md leading-relaxed">{service.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                    <span className="font-label-md uppercase text-on-surface-variant tracking-wider font-semibold">{service.price}</span>
                    <button
                      onClick={onOpenBookingModal}
                      className="text-gold font-label-md uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1 font-semibold"
                    >
                      Book Service
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-stack-lg text-center">
        <button
          onClick={onOpenBookingModal}
          className="border border-[#D4AF37] text-on-background px-10 py-4 rounded-full font-label-md uppercase tracking-wider hover:bg-[#D4AF37]/10 transition-colors duration-300 shadow-sm"
        >
          View Full Menu
        </button>
      </div>
    </section>
  )
}
