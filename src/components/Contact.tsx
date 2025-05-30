'use client'

import React, { useState } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Contact form error:', error)
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <section id="contact" className="contact">
      <div className="section-header">
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">Get in touch for your next project</p>
      </div>

      <div className="container">
        <div className="contact-container">
          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {status === 'success' && (
                <div className="form-message success">
                  Message sent successfully! We'll get back to you soon.
                </div>
              )}

              {status === 'error' && (
                <div className="form-message error">
                  {errorMessage || 'Failed to send message. Please try again.'}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="contact-info">
            <div className="contact-info-item">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <div className="contact-text">
                <h3>Email</h3>
                <p>info@yourcompany.com</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <FaPhone />
              </div>
              <div className="contact-text">
                <h3>Phone</h3>
                <p>+91 1234567890</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="contact-text">
                <h3>Location</h3>
                <p>123 Business Street, City, Country</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 