import { useState } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import UseCases from '../components/UseCases'
import TechStack from '../components/TechStack'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import UploadModal from '../components/UploadModal'

export default function Landing() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <Navbar onGetStarted={() => setModalOpen(true)} />
      <main>
        <Hero onGetStarted={() => setModalOpen(true)} />
        <Features />
        <HowItWorks />
        <UseCases />
        <TechStack />
        <Testimonials />
        <CTA onGetStarted={() => setModalOpen(true)} />
      </main>
      <Footer />
      {modalOpen && <UploadModal onClose={() => setModalOpen(false)} />}
    </>
  )
}
