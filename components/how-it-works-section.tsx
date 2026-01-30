import { useRef, useEffect } from 'react'
import { Edit, CheckSquare2, Zap, BarChart3 } from 'lucide-react'

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: Edit,
      title: 'Enter a Prompt',
      description: 'Type your question or task that you want multiple AI models to tackle.',
      color: "from-blue-500 to-blue-600"
    },
    {
      number: '02',
      icon: CheckSquare2,
      title: 'Select Models',
      description: 'Choose which AI models you want to compare for comprehensive analysis.',
      color: "from-orange-500 to-orange-600"
    },
    {
      number: '03',
      icon: Zap,
      title: 'Run Comparison',
      description: 'Execute your prompt across all selected models simultaneously.',
      color: "from-purple-500 to-purple-600"
    },
    {
      number: '04',
      icon: BarChart3,
      title: 'Analyze Insights',
      description: 'Review detailed metrics and understand how each model thinks differently.',
      color: "from-green-500 to-green-600"
    },
  ]

  // Track scroll for the icon position
  const timelineRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleScroll() {
      if (!timelineRef.current || !iconRef.current) return
      const rect = timelineRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const timelineTop = rect.top + window.scrollY
      const timelineHeight = rect.height
      const scrollY = window.scrollY + windowHeight / 2
      // Clamp icon position between start and end of timeline
      const minY = timelineTop
      const maxY = timelineTop + timelineHeight - 80 // 80px icon height
      let iconY = scrollY - 40 // center icon
      if (iconY < minY) iconY = minY
      if (iconY > maxY) iconY = maxY
      iconRef.current.style.top = `${iconY - timelineTop}px`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-white dark:from-background dark:to-background overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            See How{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Kyrix Works
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative" ref={timelineRef}>
          {/* Center Line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary/20 via-accent/20 to-primary/20"></div>

          {/* Floating Icon in the middle */}
          <div
            ref={iconRef}
            className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-30 w-20 h-20 items-center justify-center"
            style={{ top: 0, transition: 'top 0.2s cubic-bezier(.4,0,.2,1)' }}
          >
            <img
              src="/icon.png"
              alt="Timeline Icon"
              className="w-14 h-14 rounded-full border-4 border-white shadow-lg object-cover bg-white"
              style={{ pointerEvents: "auto" }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } animate-fadeInUp`}
                >
                  {/* Content Card */}
                  <div className={`flex-1 lg:w-5/12`}>
                    <div
                      className={`group bg-white dark:bg-background rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-border hover:border-primary/30 cursor-pointer ${
                        index % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'
                      }`}
                    >
                      {/* Icon & Step Number */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${step.color} text-white text-lg font-bold shadow-lg`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold text-primary">{step.number}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {/* Empty space for alternating layout */}
                  <div className="hidden lg:block flex-1 lg:w-5/12"></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </section>
  )
}
