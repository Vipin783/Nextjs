'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <div className="logo-container">
            <Image
              src="/logo.svg"
              alt="Capture Studio Logo"
              width={200}
              height={50}
              className="logo-image"
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
        </Link>

        <button
          className={`nav-toggle ${isMenuOpen ? 'nav-toggle-active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-active' : ''}`}>
          <Link href="/#about" className="nav-link">
            About
          </Link>
          <Link href="/#services" className="nav-link">
            Services
          </Link>
          <Link href="/#portfolio" className="nav-link">
            Portfolio
          </Link>
          <Link href="/#contact" className="nav-link">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
} 