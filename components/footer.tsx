import { Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border/30 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Brand section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 30L35 20L65 20L75 30M25 30L35 40L65 40L75 30M35 40L35 60L65 60L65 40" stroke="url(#grad)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-lg font-bold text-foreground">Kyrix.ai</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              An AI Playground for Curious Minds
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
