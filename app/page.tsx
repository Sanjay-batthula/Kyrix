'use client'

import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import HeroSection from '@/components/hero-section'
import FeaturesSection from '@/components/features-section'
import HowItWorksSection from '@/components/how-it-works-section'
import TechStackSection from '@/components/tech-stack-section'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'

export default function Home() {
  const [isDark, setIsDark] = useState(true)

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (isDark) {
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Header */}
        <Navbar isDark={isDark} toggleTheme={toggleTheme} />
        {/* Main Content */}
        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <TechStackSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
