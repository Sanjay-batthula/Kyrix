'use client'

import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import HeroSection from '@/components/hero-section'
import FeaturesSection from '@/components/features-section'
import HowItWorksSection from '@/components/how-it-works-section'
import TechStackSection from '@/components/tech-stack-section'
import Footer from '@/components/footer'

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
        <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-sm bg-background/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              
              <img src="/logo.png" alt="Logo" className="w-32 h-16" />
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

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
