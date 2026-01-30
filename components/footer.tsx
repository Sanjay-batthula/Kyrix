import { Github, ArrowUp } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <footer className="relative border-t border-border/30 bg-transparent backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-2">
            <img src="/logo.png" alt="Logo" className="w-32 h-16" />
          </div>
          <span className="text-muted-foreground text-sm mb-2">
            An AI Playground for Curious Minds
          </span>
          <a
            href="https://github.com/Sanjay-batthula/Kyrix"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </footer>
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg hover:bg-muted transition-all"
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  )
}
