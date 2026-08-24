import React, { useState } from 'react'
import Logo from '../components/Logo'
import catalogueData from '../data/serviceCatalogue.json'

export default function ServicesPage({ onOpenBookingModal, onNavigate }) {
  const { catalogue } = catalogueData
  const { categories, currency_symbol: symbol, catalogue_footer: footer } = catalogue

  const [activeCategoryId, setActiveCategoryId] = useState('for-him')
  const [selectedLengths, setSelectedLengths] = useState({}) // serviceId -> length

  const currentCategory = categories.find(c => c.id === activeCategoryId) || categories[0]

  const handleLengthChange = (serviceId, length) => {
    setSelectedLengths(prev => ({ ...prev, [serviceId]: length }))
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex flex-col font-body-md text-body-md">
      {/* Top Header Navigation */}
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
            className="bg-secondary text-on-secondary px-4 py-2 rounded-full font-label-md uppercase tracking-wider text-xs font-semibold hover:bg-on-secondary-fixed-variant transition-colors border border-gold/30 cursor-pointer shadow-xs"
          >
            Book Ritual
          </button>
        </div>
      </header>

      {/* Main Services Body */}
      <main className="flex-grow max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg w-full">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-gold font-label-md uppercase tracking-[0.25em] block mb-2 font-bold text-xs">
            {catalogue.brand} • Complete Ritual Menu
          </span>
          <h1 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-on-background">
            Services Catalogue
          </h1>
          <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-3 mb-4"></div>
          <p className="font-body-lg text-on-surface-variant text-sm leading-relaxed">
            Discover precision grooming, bespoke hair artistry, and organic spa rituals. All prices listed in Indian Rupees ({symbol}).
          </p>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10 border-b border-gold/20 pb-6">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-5 py-2.5 rounded-full font-label-md uppercase tracking-wider text-xs font-bold transition-all duration-300 cursor-pointer ${
                activeCategoryId === cat.id
                  ? 'bg-[#042C1D] text-[#FAF6F0] shadow-md border border-[#D4AF37]'
                  : 'bg-white text-on-surface-variant border border-outline-variant/30 hover:border-gold hover:text-primary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Current Active Category Description Banner */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gold/30 shadow-xs mb-10">
          <span className="text-gold text-[10px] font-label-md uppercase tracking-widest font-bold block mb-1">
            {currentCategory.display_label}
          </span>
          <h2 className="font-headline-lg text-2xl text-[#042C1D] mb-2 font-bold">{currentCategory.name}</h2>
          <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed max-w-3xl">
            {currentCategory.description}
          </p>
        </div>

        {/* Groups & Service Items List */}
        <div className="flex flex-col gap-12">
          {currentCategory.groups.map(group => (
            <div key={group.id} className="flex flex-col gap-6">
              {/* Group Header */}
              <div className="border-b-2 border-gold/30 pb-3 flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
                <div>
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest block">{group.display_label}</span>
                  <h3 className="font-headline-lg text-xl text-[#042C1D] font-bold">{group.name}</h3>
                </div>
                {group.descriptor && (
                  <span className="text-xs font-semibold text-gold bg-[#042C1D] px-3 py-1 rounded-full border border-gold/30">
                    {group.descriptor}
                  </span>
                )}
              </div>

              {group.description && (
                <p className="text-xs text-on-surface-variant italic -mt-3 mb-2">{group.description}</p>
              )}

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {group.services.map(service => {
                  const isLengthPriced = Boolean(service.length_pricing)
                  const isConsultation = service.pricing_type === 'consultation'
                  const activeLength = selectedLengths[service.id] || 'Short'

                  // Compute active prices
                  let memberPrice = service.pricing?.member
                  let offerPrice = service.pricing?.offer
                  let standardPrice = service.pricing?.standard

                  if (isLengthPriced) {
                    const lengthPricingObj = service.length_pricing[activeLength] || service.length_pricing['Short']
                    memberPrice = lengthPricingObj?.member
                    offerPrice = lengthPricingObj?.offer
                    standardPrice = lengthPricingObj?.standard
                  }

                  return (
                    <div
                      key={service.id}
                      className="bg-white rounded-3xl border border-gold/30 p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Service Title */}
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className="font-headline-lg text-lg text-[#042C1D] font-bold">{service.name}</h4>
                        </div>

                        {/* Description */}
                        <p className="font-body-md text-on-surface-variant text-xs leading-relaxed mb-4">
                          {service.description}
                        </p>

                        {/* Products Chip Tags */}
                        {service.products && service.products.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mb-3">
                            <span className="text-[10px] uppercase font-bold text-gold">Products:</span>
                            {service.products.map(p => (
                              <span key={p} className="bg-[#FAF6F0] text-[#042C1D] px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-gold/30">
                                {p}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Feature Bullets */}
                        {service.features && service.features.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mb-4">
                            {service.features.map(f => (
                              <span key={f} className="bg-[#EEF2EE] text-primary px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-primary/20">
                                ✓ {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Pricing Block */}
                      <div className="border-t border-outline-variant/20 pt-4 flex flex-col gap-3">
                        {/* Length Selector Tabs if length-priced */}
                        {isLengthPriced && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Select Length:</span>
                            <div className="flex bg-[#F9F7F2] p-1 rounded-xl border border-gold/20 gap-1 flex-grow">
                              {Object.keys(service.length_pricing).map(lenKey => (
                                <button
                                  key={lenKey}
                                  onClick={() => handleLengthChange(service.id, lenKey)}
                                  className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                                    activeLength === lenKey
                                      ? 'bg-[#042C1D] text-white shadow-xs'
                                      : 'text-on-surface-variant hover:text-[#042C1D]'
                                  }`}
                                >
                                  {lenKey}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Render Price Modes */}
                        {isConsultation ? (
                          <div className="bg-[#FAF6F0] border border-[#D4AF37] p-3 rounded-2xl text-center">
                            <span className="text-xs font-bold text-[#042C1D] uppercase tracking-wider">
                              ✨ {service.pricing_label || 'Priced on consultation'}
                            </span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2 text-center">
                            {/* Member */}
                            <div className="bg-[#042C1D] text-[#FAF6F0] p-2.5 rounded-2xl border border-gold">
                              <span className="text-[9px] uppercase font-bold text-gold block">Member</span>
                              <span className="font-extrabold text-sm text-gold">
                                {memberPrice === 'Complimentary' ? 'Complimentary' : `${symbol}${memberPrice}`}
                              </span>
                            </div>

                            {/* Offer */}
                            <div className="bg-[#FAF6F0] p-2.5 rounded-2xl border border-gold/40">
                              <span className="text-[9px] uppercase font-bold text-secondary block">Special Offer</span>
                              <span className="font-bold text-sm text-secondary">
                                {offerPrice === 0 ? 'Free' : `${symbol}${offerPrice}`}
                              </span>
                            </div>

                            {/* Standard */}
                            <div className="bg-white p-2.5 rounded-2xl border border-outline-variant/30">
                              <span className="text-[9px] uppercase font-bold text-on-surface-variant block">Standard</span>
                              <span className="font-bold text-sm text-on-background">{symbol}{standardPrice}</span>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={onOpenBookingModal}
                          className="w-full bg-[#042C1D] text-[#FAF6F0] py-3 rounded-full font-label-md uppercase tracking-wider text-xs font-bold hover:bg-[#084D34] transition-all border border-[#D4AF37]/40 shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-1"
                        >
                          <span className="material-symbols-outlined text-sm">calendar_month</span>
                          <span>Book Ritual</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Business Rules Box */}
        <div className="mt-16 bg-[#EEF2EE] p-6 rounded-3xl border border-gold/30 text-center text-xs text-[#042C1D] max-w-3xl mx-auto flex flex-col gap-1.5">
          <span className="font-bold text-gold uppercase tracking-widest text-[10px]">Sanctuary Business Rules</span>
          <p className="font-medium">{footer.text}</p>
          <p className="text-[11px] text-on-surface-variant">{footer.membership_rule}</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#F9F7F2] py-8 text-center text-xs text-on-surface-variant border-t border-gold/20">
        © 2026 Salon Organics Catalogue. All rights reserved.
      </footer>
    </div>
  )
}
