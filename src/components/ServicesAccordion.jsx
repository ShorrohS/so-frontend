import React, { useState } from 'react'

export default function ServicesAccordion({ onOpenBookingModal, onNavigate }) {
  const [openIndices, setOpenIndices] = useState([0])

  const categoriesOverview = [
    {
      title: 'For Him — Gentlemen’s Grooming',
      icon: 'content_cut',
      price: 'From ₹75 Member / ₹300 Standard',
      description: 'Precision cutting, beard sculpting, UV-sterilised razor rituals, and organic botanical cleansing for the modern gentleman.'
    },
    {
      title: 'For Her — Cut & Style Atelier',
      icon: 'face_retouching_natural',
      price: 'From ₹100 Member / ₹400 Standard',
      description: 'Personalised consultation, precision cutting, blow-dry styling, and vegan cleansing rituals crafted for healthy, radiant hair.'
    },
    {
      title: 'Colour Artistry',
      icon: 'palette',
      price: 'From ₹150 Member / ₹600 Standard',
      description: 'Schwarzkopf Professional root retouches, full global colour transformations, and hand-painted balayage highlights in Short, Medium & Long lengths.'
    },
    {
      title: 'Hair Spa Rituals',
      icon: 'local_florist',
      price: 'From ₹900 Member / ₹2,600 Standard',
      description: 'Restorative scalp and hair rituals featuring Kérastase, Moroccanoil, Wella Professionals, and Nashi Argan therapies.'
    },
    {
      title: 'Transformation & Repair',
      icon: 'auto_awesome',
      price: 'From ₹500 Member / ₹2,000 Standard',
      description: 'Defabulous Keratin Smoothing, Olaplex Bond Repair, and Bluetox Botanical therapies for structural rebuilding.'
    },
    {
      title: 'Skin, Hands & Body',
      icon: 'spa',
      price: 'From ₹90 Member / ₹350 Standard',
      description: 'Low-temperature Mediterranean Rica waxing, Aroma Magic hand & foot manicures, and Korean Hydra-Peptide facials.'
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
        <span className="text-gold font-label-md uppercase tracking-[0.2em] mb-4 block font-semibold">Salon Organics Catalogue</span>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-6">Curated Service Offerings</h2>
        <div className="w-24 h-px bg-[#D4AF37] mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {categoriesOverview.map((category, index) => {
          const isOpen = openIndices.includes(index)
          return (
            <div
              key={category.title}
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
                    <span className="material-symbols-outlined text-2xl font-light">{category.icon}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-background font-bold">{category.title}</h3>
                </div>
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-transform duration-300 ${
                  isOpen ? 'border-gold/50 text-gold rotate-45' : 'border-outline-variant/30 text-primary'
                }`}>
                  <span className="material-symbols-outlined text-lg">add</span>
                </div>
              </button>

              {isOpen && (
                <div className="px-6 md:px-8 pb-8 pt-0 ml-0 md:ml-[72px] animate-fadeIn">
                  <p className="text-on-surface-variant mb-6 font-body-md leading-relaxed text-xs md:text-sm">{category.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                    <span className="font-label-md uppercase text-on-surface-variant tracking-wider font-semibold text-xs">{category.price}</span>
                    <button
                      onClick={() => onNavigate ? onNavigate('/services') : (window.location.hash = '#/services')}
                      className="text-gold font-label-md uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1 font-bold text-xs cursor-pointer"
                    >
                      Explore Full Menu
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
          onClick={() => onNavigate ? onNavigate('/services') : (window.location.hash = '#/services')}
          className="border border-[#D4AF37] text-on-background px-10 py-4 rounded-full font-label-md uppercase tracking-wider hover:bg-[#D4AF37]/10 transition-colors duration-300 shadow-sm font-bold cursor-pointer"
        >
          View Full Catalogue (45 Services)
        </button>
      </div>
    </section>
  )
}
