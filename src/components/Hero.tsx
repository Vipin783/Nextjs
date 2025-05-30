'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className="hero">
      {/* Background Image */}
      <div className="hero-background">
        <Image
          src="/hero-background.jpg"
          alt="Hero Background"
          fill
          priority
          quality={100}
          style={{ objectFit: 'cover' }}
        />
      </div>
      
      {/* Dark overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="hero-content">
        <h1 className="hero-title">
          Capturing Life's Stories
        </h1>
        <p className="hero-subtitle">
          Professional videography and photography that brings your vision to life
        </p>
        <div className="hero-buttons">
          <Link href="#portfolio" className="btn btn-primary">
            View My Work
          </Link>
          <Link href="#contact" className="btn btn-outline">
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  )
} 