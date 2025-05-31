'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'

const portfolioItems = [
  {
    id: 1,
    title: 'Cinematic Wedding Stories',
    category: 'Wedding',
    imageUrl: '/portfolio/wedding.jpg',
    isGallery: true,
    galleryImages: [
      '/portfolio/wedding/wedding1.jpg',
      '/portfolio/wedding/wedding2.jpg',
      '/portfolio/wedding/wedding3.jpg',
      '/portfolio/wedding/wedding4.jpg',
      '/portfolio/wedding/wedding5.jpg'
    ]
  },
  {
    id: 2,
    title: 'Premium Commercial Production',
    category: 'Commercial',
    imageUrl: '/portfolio/commercial.jpg',
    isGallery: true,
    galleryImages: [
      '/portfolio/commercial/corporate1.jpg',
      '/portfolio/commercial/corporate2.jpg',
      '/portfolio/commercial/corporate3.jpg',
      '/portfolio/commercial/corporate4.jpg',
      '/portfolio/commercial/corporate5.jpg'
    ]
  },
  {
    id: 3,
    title: 'Dynamic Event Coverage',
    category: 'Events',
    imageUrl: '/portfolio/event.jpg',
    isGallery: true,
    galleryImages: [
      '/portfolio/events/conference1.jpg',
      '/portfolio/events/conference2.jpg',
      '/portfolio/events/conference4.jpg',
      '/portfolio/events/festival1.jpg',
      '/portfolio/events/festival2.jpg'
    ]
  },
  {
    id: 4,
    title: 'Bhojpuri Hit Song - "Lollipop Lagelu"',
    category: 'Music',
    imageUrl: '/portfolio/music.jpg',
    videoUrl: 'https://www.youtube.com/embed/Gr8G_ldltDE?enablejsapi=1',
    isVideo: true
  },
  {
    id: 5,
    title: 'Compelling Documentaries',
    category: 'Documentary',
    imageUrl: '/portfolio/documentary.jpg',
    isGallery: true,
    galleryImages: [
      '/portfolio/documentary/nature1.jpg',
      '/portfolio/documentary/nature2.jpg',
      '/portfolio/documentary/nature3.jpg',
      '/portfolio/documentary/nature4.jpg',
      '/portfolio/documentary/nature5.jpg'
    ]
  },
  {
    id: 6,
    title: 'Corporate Excellence',
    category: 'Commercial',
    imageUrl: '/portfolio/corporate.jpg',
    isGallery: true,
    galleryImages: [
      '/portfolio/commercial/product1.jpg',
      '/portfolio/commercial/product2.jpg',
      '/portfolio/commercial/product3.jpg',
      '/portfolio/commercial/product4.jpg',
      '/portfolio/commercial/product5.jpg'
    ]
  },
  {
    id: 7,
    title: 'Traditional Indian Wedding',
    category: 'Wedding',
    imageUrl: '/portfolio/wedding-2.jpg',
    isGallery: true,
    galleryImages: [
      '/portfolio/wedding/indian1.jpg',
      '/portfolio/wedding/indian2.jpg',
      '/portfolio/wedding/indian3.jpg',
      '/portfolio/wedding/indian4.jpg',
      '/portfolio/wedding/indian5.jpg'
    ]
  },
  {
    id: 8,
    title: 'Fashion Collection Launch',
    category: 'Commercial',
    imageUrl: '/portfolio/fashion.jpg',
    isGallery: true,
    galleryImages: [
      '/portfolio/commercial/fashion1.jpg',
      '/portfolio/commercial/fashion2.jpg',
      '/portfolio/commercial/brand1.jpg',
      '/portfolio/commercial/brand2.jpg',
      '/portfolio/commercial/brand3.jpg'
    ]
  },
  {
    id: 9,
    title: 'Bhojpuri Dance Hit - "Kamariya Kare Lapalap"',
    category: 'Music',
    imageUrl: '/portfolio/concert.jpg',
    videoUrl: 'https://www.youtube.com/embed/yIIGQB6EMAM?enablejsapi=1',
    isVideo: true
  },
  {
    id: 10,
    title: 'Cultural Festival Coverage',
    category: 'Events',
    imageUrl: '/portfolio/festival.jpg',
    isGallery: true,
    galleryImages: [
      '/portfolio/events/festival3.jpg',
      '/portfolio/events/festival5.jpg',
      '/portfolio/events/concert1.jpg',
      '/portfolio/events/concert2.jpg',
      '/portfolio/events/concert3.jpg'
    ]
  },
  {
    id: 11,
    title: 'Urban Life Documentary',
    category: 'Documentary',
    imageUrl: '/portfolio/nature-doc.jpg',
    isGallery: true,
    galleryImages: [
      '/portfolio/documentary/urban1.jpg',
      '/portfolio/documentary/urban2.jpg',
      '/portfolio/documentary/urban3.jpg',
      '/portfolio/documentary/urban4.jpg',
      '/portfolio/documentary/urban5.jpg'
    ]
  },
  {
    id: 12,
    title: 'Bhojpuri Folk Song - "Nirahua Satal Rahe"',
    category: 'Music',
    imageUrl: '/portfolio/product-launch.jpg',
    videoUrl: 'https://www.youtube.com/embed/SXkqyNQwqWE?enablejsapi=1',
    isVideo: true
  },
  {
    id: 13,
    title: 'Destination Beach Wedding',
    category: 'Wedding',
    imageUrl: '/portfolio/wedding-3.jpg',
    isGallery: true,
    galleryImages: [
      '/portfolio/wedding/beach1.jpg',
      '/portfolio/wedding/beach2.jpg',
      '/portfolio/wedding/beach3.jpg',
      '/portfolio/wedding/beach4.jpg',
      '/portfolio/wedding/beach5.jpg'
    ]
  },
  {
    id: 14,
    title: 'Cultural Heritage Series',
    category: 'Documentary',
    imageUrl: '/portfolio/conference.jpg',
    isGallery: true,
    galleryImages: [
      '/portfolio/documentary/culture1.jpg',
      '/portfolio/documentary/culture2.jpg',
      '/portfolio/documentary/culture3.jpg',
      '/portfolio/documentary/culture4.jpg',
      '/portfolio/documentary/urban1.jpg'
    ]
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
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [selectedGallery, setSelectedGallery] = useState<string[] | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const getVideoUrl = (url: string) => {
    return `${url}&autoplay=1&rel=0&mute=0`;
  }

  const categories = useMemo(() => {
    const cats = portfolioItems.map(item => item.category)
    return ['All', ...Array.from(new Set(cats))]
  }, [])

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return portfolioItems
    return portfolioItems.filter(item => item.category === selectedCategory)
  }, [selectedCategory])

  const handleItemClick = (item: any) => {
    if (item.isVideo) {
      setSelectedVideo(item.videoUrl)
    } else if (item.isGallery) {
      setSelectedGallery(item.galleryImages)
      setCurrentImageIndex(0)
    }
  }

  const nextImage = () => {
    if (selectedGallery) {
      setCurrentImageIndex((prev) => 
        prev === selectedGallery.length - 1 ? 0 : prev + 1
      )
    }
  }

  const previousImage = () => {
    if (selectedGallery) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedGallery.length - 1 : prev - 1
      )
    }
  }

  return (
    <div className="section-header">
      <h2 className="section-title">Featured Work</h2>
      <p className="section-subtitle">Capturing moments that tell your story</p>
      
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
          <div 
            key={item.id} 
            className="portfolio-item"
            onClick={() => handleItemClick(item)}
            style={{ cursor: (item.isVideo || item.isGallery) ? 'pointer' : 'default' }}
          >
            <div className="portfolio-image">
              {item.isVideo ? (
                <div className="video-thumbnail">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={1200}
                    height={800}
                    className="portfolio-img"
                    priority={item.id <= 2}
                  />
                  <div className="play-button">▶</div>
                </div>
              ) : (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={1200}
                  height={800}
                  className="portfolio-img"
                  priority={item.id <= 2}
                />
              )}
            </div>
            <div className="portfolio-overlay">
              <h3 className="portfolio-title">{item.title}</h3>
              <span className="portfolio-category">{item.category}</span>
              {(item.isVideo || item.isGallery) && 
                <span className="portfolio-play-text">
                  {item.isVideo ? 'Click to Play' : 'View Gallery'}
                </span>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal-content" onClick={e => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setSelectedVideo(null)}>×</button>
            <iframe
              width="100%"
              height="100%"
              src={getVideoUrl(selectedVideo)}
              title="Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {selectedGallery && (
        <div className="gallery-modal" onClick={() => setSelectedGallery(null)}>
          <div className="gallery-modal-content" onClick={e => e.stopPropagation()}>
            <button className="gallery-modal-close" onClick={() => setSelectedGallery(null)}>×</button>
            <button className="gallery-nav prev" onClick={(e) => { e.stopPropagation(); previousImage(); }}>❮</button>
            <button className="gallery-nav next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>❯</button>
            <div className="gallery-image-container">
              <Image
                src={selectedGallery[currentImageIndex]}
                alt={`Wedding Photo ${currentImageIndex + 1}`}
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <div className="gallery-counter">
              {currentImageIndex + 1} / {selectedGallery.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}