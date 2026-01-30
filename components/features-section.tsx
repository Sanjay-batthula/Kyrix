import { useState, useRef, useEffect } from 'react'
import { Zap, Users, TrendingUp, Share2, ShieldCheck } from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Multi-LLM Comparison',
    description: 'Compare outputs from GPT, Gemini, Claude, DeepSeek and more.',
    image: '/features/llm.png',
  },
  {
    icon: Zap,
    title: 'AI Tribunal',
    description: 'Structured debates where models evaluate each other.',
    image: 'https://i0.wp.com/justicespeakersinstitute.com/wp-content/uploads/2025/09/AI-Courts-1.jpg?ssl=1',
  },
  {
    icon: TrendingUp,
    title: 'Deep Analytics',
    description: 'Similarity, originality, reasoning depth, and performance metrics.',
    image: 'https://thumbs.dreamstime.com/b/magnifying-glass-over-computer-screen-program-code-charts-software-deep-analysis-heuristic-evaluation-ux-user-367395152.jpg',
  },
  {
    icon: Share2,
    title: 'Replay & Share',
    description: 'Save, replay, and share AI comparison sessions.',
    image: '/features/share.png',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    description: 'Your prompts and results are never shared or stored.',
    image: 'https://blogs.perficient.com/files/2018/06/security.jpg',
  },
]

export default function FeaturesSection() {
  const [index, setIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const autoRef = useRef<NodeJS.Timeout | null>(null)

  const goTo = (newIndex: number) => {
    if (animating) return
    setAnimating(true)
    setIndex((newIndex + features.length) % features.length)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setAnimating(false), 600)
  }

  // Auto-advance every 2 seconds
  useEffect(() => {
    if (autoRef.current) clearTimeout(autoRef.current)
    autoRef.current = setTimeout(() => {
      goTo(index + 1)
    }, 2000)
    return () => {
      if (autoRef.current) clearTimeout(autoRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (autoRef.current) clearTimeout(autoRef.current)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goTo(index - 1)
      if (e.key === 'ArrowRight') goTo(index + 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index, animating])

  // Touch navigation
  useEffect(() => {
    let touchStart = 0
    let touchEnd = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStart = e.changedTouches[0].screenX
    }
    const onTouchEnd = (e: TouchEvent) => {
      touchEnd = e.changedTouches[0].screenX
      const diff = touchStart - touchEnd
      if (Math.abs(diff) > 50) {
        if (diff > 0) goTo(index + 1)
        else goTo(index - 1)
      }
    }
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [index, animating])

  return (
    <section className="py-20 md:py-32 bg-background relative flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance text-center">
        Powerful Features for Deep AI Analysis
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 text-center">
        Everything you need to understand how different AI models approach the same problem.
      </p>
      <div className="relative crew-carousel w-full max-w-5xl h-[420px] md:h-[450px] flex items-center justify-center">
        <button
          className="crew-arrow crew-left absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-primary/70 text-white w-10 h-10 rounded-full border-none text-xl flex items-center justify-center z-20"
          onClick={() => goTo(index - 1)}
          aria-label="Previous feature"
        >
          ‹
        </button>
        <div className="crew-track w-full h-full flex items-center justify-center relative">
          {features.map((feature, i) => {
            const offset = (i - index + features.length) % features.length
            let cardClass =
              "crew-card absolute w-56 md:w-64 lg:w-72 h-80 md:h-96 rounded-2xl overflow-hidden bg-white shadow-xl transition-all duration-600 cursor-pointer flex flex-col items-center justify-center px-4 md:px-6 py-6 md:py-8"
            // Show 5 cards: center (focus), left-1, left-2, right-1, right-2
            if (offset === 0) cardClass += " center z-20 scale-110 ring-4 ring-primary/30"
            else if (offset === 1) cardClass += " right-1 z-10 opacity-90 grayscale"
            else if (offset === 2) cardClass += " right-2 z-0 opacity-70 grayscale"
            else if (offset === features.length - 1) cardClass += " left-1 z-10 opacity-90 grayscale"
            else if (offset === features.length - 2) cardClass += " left-2 z-0 opacity-70 grayscale"
            else cardClass += " hidden opacity-0 pointer-events-none"
            // Center the cards using left: 50% and translateX(-50%)
            let left = '50%'
            if (offset === 1) left = '70%'
            else if (offset === 2) left = '88%'
            else if (offset === features.length - 1) left = '30%'
            else if (offset === features.length - 2) left = '12%'
            return (
              <div
                key={i}
                className={cardClass}
                style={{
                  transition: 'all 0.6s cubic-bezier(.77,0,.18,1)',
                  left,
                  transform:
                    offset === 0
                      ? 'translate(-50%, 0) scale(1.12)'
                      : offset === 1
                      ? 'translate(-50%, 0) scale(0.98)'
                      : offset === 2
                      ? 'translate(-50%, 0) scale(0.92)'
                      : offset === features.length - 1
                      ? 'translate(-50%, 0) scale(0.98)'
                      : offset === features.length - 2
                      ? 'translate(-50%, 0) scale(0.92)'
                      : 'translate(-50%, 0) scale(0.8)',
                }}
                onClick={() => goTo(i)}
              >
                <div className="w-full h-32 md:h-40 rounded-xl overflow-hidden mb-6 flex items-center justify-center bg-gray-100">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-black dark:text-black text-center">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-center text-black dark:text-black">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
        <button
          className="crew-arrow crew-right absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-primary/70 text-white w-10 h-10 rounded-full border-none text-xl flex items-center justify-center z-20"
          onClick={() => goTo(index + 1)}
          aria-label="Next feature"
        >
          ›
        </button>
      </div>
      <div className="crew-dots flex justify-center gap-3 mt-8">
        {features.map((_, i) => (
          <div
            key={i}
            className={`crew-dot w-3 h-3 rounded-full ${i === index ? 'bg-primary' : 'bg-primary/20'} cursor-pointer transition-colors`}
            onClick={() => goTo(i)}
            aria-label={`Go to feature ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
