import { Edit, CheckSquare2, Zap, BarChart3 } from 'lucide-react'

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      icon: Edit,
      title: 'Enter a Prompt',
      description: 'Type your question or task that you want multiple AI models to tackle.',
    },
    {
      number: '02',
      icon: CheckSquare2,
      title: 'Select Models',
      description: 'Choose which AI models you want to compare for comprehensive analysis.',
    },
    {
      number: '03',
      icon: Zap,
      title: 'Run Comparison',
      description: 'Execute your prompt across all selected models simultaneously.',
    },
    {
      number: '04',
      icon: BarChart3,
      title: 'Analyze Insights',
      description: 'Review detailed metrics and understand how each model thinks differently.',
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-card/30 backdrop-blur-sm relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent/15 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, intuitive workflow to compare and analyze AI models in real time.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 md:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent transform -translate-y-1/2" />
                )}

                <div className="relative bg-background border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-colors duration-300">
                  {/* Step number circle */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold flex items-center justify-center text-sm border-4 border-background">
                    {step.number}
                  </div>

                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/15 text-primary mb-4">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
