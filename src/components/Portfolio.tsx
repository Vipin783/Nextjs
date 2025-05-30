'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'

const portfolioItems = [
  {
    id: 1,
    title: 'Cinematic Wedding Stories',
    category: 'Wedding',
    imageUrl: '/portfolio/wedding.jpg',
  },
  {
    id: 2,
    title: 'Premium Commercial Production',
    category: 'Commercial',
    imageUrl: '/portfolio/commercial.jpg',
  },
  {
    id: 3,
    title: 'Dynamic Event Coverage',
    category: 'Events',
    imageUrl: '/portfolio/event.jpg',
  },
  {
    id: 4,
    title: 'Professional Music Videos',
    category: 'Music',
    imageUrl: '/portfolio/music.jpg',
  },
  {
    id: 5,
    title: 'Compelling Documentaries',
    category: 'Documentary',
    imageUrl: '/portfolio/documentary.jpg',
  },
  {
    id: 6,
    title: 'Corporate Excellence',
    category: 'Commercial',
    imageUrl: '/portfolio/corporate.jpg',
  },
  {
    id: 7,
    title: 'Destination Wedding',
    category: 'Wedding',
    imageUrl: '/portfolio/wedding-2.jpg',
  },
  {
    id: 8,
    title: 'Fashion Collection Launch',
    category: 'Commercial',
    imageUrl: '/portfolio/fashion.jpg',
  },
  {
    id: 9,
    title: 'Live Concert Coverage',
    category: 'Music',
    imageUrl: '/portfolio/concert.jpg',
  },
  {
    id: 10,
    title: 'Cultural Festival',
    category: 'Events',
    imageUrl: '/portfolio/festival.jpg',
  },
  {
    id: 11,
    title: 'Nature Documentary',
    category: 'Documentary',
    imageUrl: '/portfolio/nature-doc.jpg',
  },
  {
    id: 12,
    title: 'Product Launch Event',
    category: 'Events',
    imageUrl: '/portfolio/product-launch.jpg',
  },
  {
    id: 13,
    title: 'Beach Wedding Ceremony',
    category: 'Wedding',
    imageUrl: '/portfolio/wedding-3.jpg',
  },
  {
    id: 14,
    title: 'Tech Conference Coverage',
    category: 'Events',
    imageUrl: '/portfolio/conference.jpg',
  },
  {
    id: 15,
    title: 'Brand Campaign',
    category: 'Commercial',
    imageUrl: '/portfolio/brand.jpg',
  }
]

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  // Get unique categories
  const categories = useMemo(() => {
    const cats = portfolioItems.map(item => item.category)
    return ['All', ...Array.from(new Set(cats))]
  }, [])

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return portfolioItems
    return portfolioItems.filter(item => item.category === selectedCategory)
  }, [selectedCategory])

  return (
    <div className="section-header">
      <h2 className="section-title">Featured Work</h2>
      <p className="section-subtitle">Capturing moments that tell your story</p>
      
      {/* Category Filter Buttons */}
      <div className="portfolio-filters">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`filter-btn ${selectedCategory === category ? 'filter-btn-active' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="portfolio-item">
            <div className="portfolio-image">
              <Image
                src={item.imageUrl}
                alt={item.title}
                width={1200}
                height={800}
                className="portfolio-img"
                priority={item.id <= 2}
              />
            </div>
            <div className="portfolio-overlay">
              <h3 className="portfolio-title">{item.title}</h3>
              <span className="portfolio-category">{item.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 