import React from 'react'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Portfolio from '../components/Portfolio'
import About from '../components/About'
import Contact from '../components/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <section id="portfolio">
        <Portfolio />
      </section>
      <section id="services">
        <Services />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </>
  )
} 