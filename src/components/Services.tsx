'use client'

import React, { useState } from 'react'
import { 
  FaVideo, FaCamera, FaPlane, FaEdit, 
  FaRing, FaBuilding, FaFilm, FaPhotoVideo,
  FaShoppingCart, FaTimes
} from 'react-icons/fa'
import Cart from './Cart'

const services = [
  {
    icon: FaVideo,
    title: 'Event Videography',
    description: 'Professional video coverage for all types of events. From corporate functions to social gatherings, we capture every moment with cinematic excellence.',
    packages: [
      {
        name: 'Basic Package',
        price: '₹15,000',
        features: [
          '4 hours coverage',
          'Edited highlight video (5-7 minutes)',
          'Full HD delivery',
          'Basic color grading',
          'Background music',
          'Online delivery'
        ]
      },
      {
        name: 'Premium Package',
        price: '₹25,000',
        features: [
          '8 hours coverage',
          'Highlight video (10-15 minutes)',
          '4K Ultra HD delivery',
          'Advanced color grading',
          'Drone shots included',
          'Same-day edit preview',
          'Custom music selection',
          'Raw footage included'
        ]
      }
    ]
  },
  {
    icon: FaRing,
    title: 'Wedding Cinematography',
    description: 'Cinematic wedding films that tell your love story.',
    packages: [
      {
        name: 'Silver Package',
        price: '₹45,000',
        features: [
          'Full day coverage',
          'Highlight film (15-20 minutes)',
          'Ceremony documentary edit',
          '4K Ultra HD delivery',
          'Drone coverage',
          '2 cinematographers'
        ]
      },
      {
        name: 'Gold Package',
        price: '₹75,000',
        features: [
          '2 days coverage',
          'Cinematic highlight film (20-25 minutes)',
          'Full ceremony & events coverage',
          'Pre-wedding shoot',
          '3 cinematographers',
          'Same-day edit preview',
          'Instagram teaser'
        ]
      }
    ]
  },
  {
    icon: FaCamera,
    title: 'Photography',
    description: 'Capturing moments that last forever.',
    packages: [
      {
        name: 'Portrait Session',
        price: '₹10,000',
        features: [
          '2 hours session',
          '20 edited photos',
          'Location of your choice',
          'Digital delivery',
          'Print release'
        ]
      },
      {
        name: 'Event Coverage',
        price: '₹20,000',
        features: [
          '4 hours coverage',
          '100+ edited photos',
          'Online gallery',
          'Professional lighting',
          'Assistant photographer'
        ]
      }
    ]
  },
  {
    icon: FaPlane,
    title: 'Aerial Photography',
    description: 'Breathtaking aerial shots for unique perspectives.',
    packages: [
      {
        name: 'Property Package',
        price: '₹12,000',
        features: [
          'Up to 1 hour flight time',
          '10 edited photos',
          '4K video footage',
          'Licensed drone pilot',
          'Property highlight video'
        ]
      },
      {
        name: 'Event Aerial Coverage',
        price: '₹25,000',
        features: [
          'Multiple flight sessions',
          'Aerial photography & videography',
          'Integration with ground footage',
          'FAA licensed pilot',
          'Insurance coverage'
        ]
      }
    ]
  },
  {
    icon: FaBuilding,
    title: 'Corporate Videos',
    description: 'Professional corporate and promotional videos.',
    packages: [
      {
        name: 'Startup Package',
        price: '₹35,000',
        features: [
          'Company profile video',
          'Product showcase',
          'Interview setups',
          'Professional voiceover',
          'Motion graphics'
        ]
      },
      {
        name: 'Enterprise Package',
        price: '₹75,000',
        features: [
          'Multiple video content',
          'Brand story documentary',
          'Aerial footage',
          'Social media cuts',
          'Professional script writing'
        ]
      }
    ]
  },
  {
    icon: FaEdit,
    title: 'Post-Production',
    description: 'Professional editing and color grading services.',
    packages: [
      {
        name: 'Basic Edit',
        price: '₹10,000',
        features: [
          'Basic color correction',
          'Simple transitions',
          'Background music',
          '2 revisions',
          'Fast delivery'
        ]
      },
      {
        name: 'Premium Edit',
        price: '₹25,000',
        features: [
          'Advanced color grading',
          'Custom motion graphics',
          'Sound design',
          'Unlimited revisions',
          'Multiple format delivery'
        ]
      }
    ]
  }
]

interface CartItem {
  serviceTitle: string
  packageName: string
  price: string
}

export default function Services() {
  const [selectedService, setSelectedService] = useState<number | null>(0)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Load cart items from localStorage on component mount
  React.useEffect(() => {
    const savedCart = localStorage.getItem('cartItems')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart items to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (serviceTitle: string, packageName: string, price: string) => {
    const newCartItems = [...cartItems, { serviceTitle, packageName, price }]
    setCartItems(newCartItems)
    setIsCartOpen(true)
  }

  const removeFromCart = (index: number) => {
    const newCartItems = cartItems.filter((_, i) => i !== index)
    setCartItems(newCartItems)
  }

  return (
    <section id="services" className="section-header">
      <h2 className="section-title">Our Services</h2>
      <p className="section-subtitle">Professional solutions for your creative needs</p>
      
      <div className="services-grid">
        {services.map((service, index) => (
          <div 
            key={index} 
            className={`service-card ${selectedService === index ? 'service-card-active' : ''}`}
          >
            <div className="service-card-inner">
              {/* Front of the card */}
              <div className="service-card-front">
                <div className="service-icon">
                  <service.icon />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setSelectedService(index)}
                  style={{ marginTop: 'auto' }}
                >
                  View Packages
                </button>
              </div>

              {/* Back of the card (Packages) */}
              <div className="service-card-back">
                <button 
                  className="close-packages"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedService(null)
                  }}
                >
                  <FaTimes />
                </button>
                <div className="service-packages">
                  {service.packages.map((pkg, pkgIndex) => (
                    <div key={pkgIndex} className="package-card">
                      <div className="package-content">
                        <h4 className="package-name">{pkg.name}</h4>
                        <div className="package-price">{pkg.price}</div>
                        <ul className="package-features">
                          {pkg.features.map((feature, featureIndex) => (
                            <li key={featureIndex}>{feature}</li>
                          ))}
                        </ul>
                        <button 
                          className="btn btn-primary package-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(service.title, pkg.name, pkg.price)
                          }}
                          style={{ width: '100%', marginTop: 'auto' }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Toggle Button */}
      <button 
        className="cart-toggle"
        onClick={(e) => {
          e.stopPropagation()
          setIsCartOpen(true)
        }}
        aria-label="Open Cart"
      >
        <FaShoppingCart />
        {cartItems.length > 0 && (
          <span className="cart-badge">{cartItems.length}</span>
        )}
      </button>

      {/* Cart Modal */}
      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={removeFromCart}
      />
    </section>
  )
} 