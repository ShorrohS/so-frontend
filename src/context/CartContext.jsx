import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  // Cart Items State: Array of selected service objects
  // Format: { id, title, price, audience, duration, length, pricing, length_pricing }
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('so_cart_items')
      return stored ? JSON.parse(stored) : [
        {
          id: 'classic-precision-cut',
          title: 'Classic Precision Cut',
          name: 'Classic Precision Cut',
          price: 75,
          audience: 'For Him',
          category: 'For Him',
          duration: 45
        },
        {
          id: 'black-edition-beard-ritual',
          title: 'Black Edition Beard Ritual',
          name: 'Black Edition Beard Ritual',
          price: 100,
          audience: 'For Him',
          category: 'For Him',
          duration: 45
        }
      ]
    } catch {
      return []
    }
  })

  // Selected Date/Time Slot State
  const [selectedSlot, setSelectedSlot] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return {
      date: tomorrow.toISOString().split('T')[0],
      time: '11:30 AM'
    }
  })

  // Cart Modal Visibility State
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Sync cart items with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('so_cart_items', JSON.stringify(cartItems))
    } catch {}
  }, [cartItems])

  // Calculate service price based on user status (Guest vs Member)
  const getServicePrice = (service, userTier = 'Guest') => {
    if (typeof service.price === 'number') return service.price
    if (service.pricing) {
      if (userTier === 'Member' || userTier === 'Gold Member') {
        return typeof service.pricing.member === 'number' ? service.pricing.member : (service.pricing.standard || 100)
      }
      if (userTier === 'VIP') {
        return typeof service.pricing.vip === 'number' ? service.pricing.vip : (service.pricing.member || 100)
      }
      return typeof service.pricing.standard === 'number' ? service.pricing.standard : 100
    }
    return 100
  }

  // Add service ritual to cart
  const addToCart = (service, activeLength = 'Short', userTier = 'Guest') => {
    const serviceId = service.id || `srv_${Date.now()}`
    
    // Check if already in cart
    const exists = cartItems.some(item => item.id === serviceId)
    if (!exists) {
      let price = getServicePrice(service, userTier)

      if (service.length_pricing && service.length_pricing[activeLength]) {
        const lenObj = service.length_pricing[activeLength]
        if (userTier === 'Member' || userTier === 'Gold Member') {
          price = typeof lenObj.member === 'number' ? lenObj.member : lenObj.standard
        } else {
          price = typeof lenObj.standard === 'number' ? lenObj.standard : 100
        }
      }

      const newItem = {
        id: serviceId,
        title: service.name || service.title,
        name: service.name || service.title,
        price: price,
        audience: service.category || service.audience || 'For All',
        category: service.category || service.audience || 'For All',
        duration: service.durationMinutes || service.duration || 45,
        length: service.length_pricing ? activeLength : null,
        pricing: service.pricing,
        length_pricing: service.length_pricing
      }
      setCartItems(prev => [...prev, newItem])
    }
    setIsCartOpen(true)
  }

  // Remove item from cart by ID
  const removeFromCart = (serviceId) => {
    setCartItems(prev => prev.filter(item => item.id !== serviceId))
  }

  // Clear entire cart
  const clearCart = () => {
    setCartItems([])
  }

  // Check if a service is in cart
  const isInCart = (serviceId) => {
    return cartItems.some(item => item.id === serviceId)
  }

  // Calculate total price dynamically
  const calculateCartTotal = (userTier = 'Guest') => {
    return cartItems.reduce((sum, item) => {
      let itemPrice = item.price
      if (item.length_pricing && item.length) {
        const lenObj = item.length_pricing[item.length]
        if (userTier === 'Member' || userTier === 'Gold Member') {
          itemPrice = typeof lenObj.member === 'number' ? lenObj.member : lenObj.standard
        } else {
          itemPrice = typeof lenObj.standard === 'number' ? lenObj.standard : 100
        }
      } else if (item.pricing) {
        if (userTier === 'Member' || userTier === 'Gold Member') {
          itemPrice = typeof item.pricing.member === 'number' ? item.pricing.member : item.pricing.standard
        } else {
          itemPrice = typeof item.pricing.standard === 'number' ? item.pricing.standard : 100
        }
      }
      return sum + (typeof itemPrice === 'number' ? itemPrice : 0)
    }, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        selectedSlot,
        setSelectedSlot,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        calculateCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
