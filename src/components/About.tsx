import React from 'react'
import Image from 'next/image'

export default function About() {
  return (
    <div className="section-header">
      <h2 className="section-title">About Me</h2>
      <p className="section-subtitle">Crafting visual stories with passion and precision</p>
      
      <div className="about-container">
        <div className="about-image">
          <Image
            src="/about-image.jpg"
            alt="Professional Photographer"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="image-cover"
          />
        </div>
        
        <div className="about-content">
          <p className="about-text">
            With over a decade of experience in videography and photography, I've
            had the privilege of capturing countless precious moments and telling
            compelling visual stories for clients worldwide.
          </p>
          
          <p className="about-text">
            My passion lies in creating cinematic experiences that resonate with
            audiences and preserve memories that last a lifetime. Whether it's a
            wedding, corporate event, or creative project, I bring technical
            expertise and artistic vision to every shoot.
          </p>
          
          <p className="about-text">
            I work with state-of-the-art equipment and stay current with the
            latest industry trends to deliver exceptional quality in every
            project. My goal is to exceed your expectations and create visual
            content that you'll be proud to share.
          </p>
        </div>
      </div>
    </div>
  )
} 