import React, { useState, useEffect } from 'react'
import Logo from '../components/Logo'

export default function ServicesPage({ onOpenBookingModal, onNavigate }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [catalogItems, setCatalogItems] = useState([
    {
      id: 'srv-1',
      name: 'Botanical Hair & Scalp Treatment',
      category: 'Sanctuary Hair Rituals',
      subcategory: 'Scalp Health',
      description: 'Deep nourishing organic hair & scalp mask with custom herbal infusions to revitalize dormant follicles and restore balance.',
      bestForTag: 'Scalp Detox & Follicle Vitality',
      durationMinutes: 60,
      imageUrl: '/images/service-1.jpg',
      pricing: { base: 120, member: 100, vip: 85 }
    },
    {
      id: 'srv-2',
      name: 'Organic Glossing & Cuticle Repair',
      category: 'Sanctuary Hair Rituals',
      subcategory: 'Glossing',
      description: 'Plant-derived gloss restoration for ultimate shine, sealing damaged cuticles and protecting against environmental stress.',
      bestForTag: 'Shine & Damage Repair',
      durationMinutes: 45,
      imageUrl: '/images/service-2.jpg',
      pricing: { base: 95, member: 80, vip: 70 }
    },
    {
      id: 'srv-3',
      name: 'Balayage Ritual & Tonal Glaze',
      category: 'Botanical Colouring',
      subcategory: 'Highlights',
      description: 'Hand-painted ammonia-free organic highlight techniques paired with custom botanical tonal glaze for effortless dimension.',
      bestForTag: 'Dimensional Organic Colour',
      durationMinutes: 120,
      imageUrl: '/images/service-3.jpg',
      pricing: { base: 220, member: 190, vip: 160 }
    },
    {
      id: 'srv-4',
      name: 'Vegan Keratin Smoothing Ritual',
      category: 'Sanctuary Hair Rituals',
      subcategory: 'Smoothing',
      description: '100% Formaldehyde-free organic smoothing ritual providing long-lasting frizz reduction and silk-like botanical softness.',
      bestForTag: 'Frizzy & Unruly Texture',
      durationMinutes: 90,
      imageUrl: '/images/service-1.jpg',
      pricing: { base: 180, member: 150, vip: 130 }
    },
    {
      id: 'srv-5',
      name: 'Ammonia-Free Organic Root Touchup',
      category: 'Botanical Colouring',
      subcategory: 'Root Care',
      description: 'Gentle organic pigment application enriched with botanical oils for complete grey coverage and vibrant longevity.',
      bestForTag: 'Gentle Grey Coverage',
      durationMinutes: 60,
      imageUrl: '/images/service-2.jpg',
      pricing: { base: 110, member: 90, vip: 75 }
    },
    {
      id: 'srv-6',
      name: 'Holistic Organic Facial & Gua Sha',
      category: 'Organic Facials',
      subcategory: 'Skincare',
      description: 'Pure cold-pressed botanical oil facial massage with rose quartz Gua Sha sculpted lift to detoxify and illuminate complexion.',
      bestForTag: 'Radiance & Lymphatic Lift',
      durationMinutes: 75,
      imageUrl: '/images/service-3.jpg',
      pricing: { base: 140, member: 120, vip: 100 }
    }
  ])

  useEffect(() => {
    // Fetch live service catalog from API if available
    const fetchCatalog = async () => {
      try {
        let res = await fetch('/api/v1/admin/services?limit=100')
        if (!res.ok) {
          res = await fetch('http://localhost:3000/api/v1/admin/services?limit=100')
        }
        const data = await res.json()
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setCatalogItems(data.items)
        }
      } catch {}
    }
    fetchCatalog()
  }, [])

  const categories = ['all', 'Sanctuary Hair Rituals', 'Botanical Colouring', 'Organic Facials']

  const filteredServices = activeCategory === 'all'
    ? catalogItems
    : catalogItems.filter(item => item.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex flex-col font-body-md text-body-md">
      {/* Navigation Header */}
      <header className="w-full sticky top-0 z-50 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-gold/20">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-primary hover:text-gold transition-colors font-label-md uppercase tracking-wider text-xs font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Return to Sanctuary</span>
          </button>

          <a href="#" onClick={() => onNavigate('/')}>
            <Logo variant="header" />
          </a>

          <button
            onClick={onOpenBookingModal}
            className="bg-secondary text-on-secondary px-4 py-2 rounded-full font-label-md uppercase tracking-wider text-xs font-semibold hover:bg-on-secondary-fixed-variant transition-colors border border-gold/30 cursor-pointer"
          >
            Book Ritual
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg w-full">
        {/* Page Hero Title Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold font-label-md uppercase tracking-[0.25em] block mb-2 font-bold text-xs">
            Complete Sanctuary Catalog
          </span>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-on-background">
            Botanical Service Menu
          </h1>
          <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-4 mb-4"></div>
          <p className="font-body-lg text-on-surface-variant text-sm leading-relaxed">
            Explore our curated menu of pure organic hair, scalp, and skin rituals. Each service includes 3-tier pricing tailored to your membership status.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full font-label-md uppercase tracking-wider text-xs font-semibold transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary text-on-primary shadow-sm border border-gold/40'
                  : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-gold'
              }`}
            >
              {cat === 'all' ? 'All Botanical Rituals' : cat}
            </button>
          ))}
        </div>

        {/* Detailed Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredServices.map(service => {
            const basePrice = service.pricing?.base ?? service.basePrice ?? 120
            const memberPrice = service.pricing?.member ?? service.memberPrice ?? 100
            const vipPrice = service.pricing?.vip ?? service.vipPrice ?? 85

            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl border border-gold/30 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Image Banner */}
                  <div className="relative h-56 w-full bg-[#EEF2EE] overflow-hidden">
                    <img
                      src={service.imageUrl || '/images/service-1.jpg'}
                      alt={service.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-[#042C1D]/90 backdrop-blur-xs text-[#FAF6F0] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-gold/30">
                      {service.category}
                    </div>
                    {service.bestForTag && (
                      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs text-[#042C1D] text-[10px] font-bold tracking-wider px-3 py-1 rounded-full border border-gold/30">
                        ✨ {service.bestForTag}
                      </div>
                    )}
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 md:p-8 flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <h2 className="font-headline-lg text-xl text-on-background font-bold">{service.name}</h2>
                      <span className="bg-[#FAF6F0] text-primary text-xs font-semibold px-2.5 py-1 rounded-lg border border-gold/20 shrink-0">
                        ⏱ {service.durationMinutes || 60} mins
                      </span>
                    </div>

                    <p className="font-body-md text-on-surface-variant text-xs leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* 3-Tier Pricing & Action Footer */}
                <div className="p-6 md:p-8 pt-0 border-t border-outline-variant/15 flex flex-col gap-4 mt-2">
                  <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-gold/30 mt-4">
                    <span className="text-[10px] font-label-md uppercase tracking-wider text-primary font-bold block mb-2 text-center">
                      3-Tier Pricing Model
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white p-2 rounded-xl border border-outline-variant/20">
                        <span className="text-[9px] uppercase font-bold text-on-surface-variant block">Base Guest</span>
                        <span className="font-bold text-sm text-on-background">${basePrice}</span>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-gold/30">
                        <span className="text-[9px] uppercase font-bold text-primary block">Gold Member</span>
                        <span className="font-bold text-sm text-primary">${memberPrice}</span>
                      </div>
                      <div className="bg-[#042C1D] text-[#FAF6F0] p-2 rounded-xl border border-gold">
                        <span className="text-[9px] uppercase font-bold text-gold block">VIP Sanctuary</span>
                        <span className="font-extrabold text-sm text-gold">${vipPrice}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onOpenBookingModal}
                    className="w-full bg-secondary text-on-secondary py-3.5 rounded-full font-label-md uppercase tracking-wider text-xs font-bold hover:bg-on-secondary-fixed-variant transition-colors border border-gold/30 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">calendar_month</span>
                    <span>Book Service Ritual</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="bg-[#F9F7F2] py-8 text-center text-xs text-on-surface-variant border-t border-gold/20">
        © 2026 Salon Orgænics Sanctuary Services. All rights reserved.
      </footer>
    </div>
  )
}
