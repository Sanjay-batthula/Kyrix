import { Zap, Users, TrendingUp, Share2 } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: Users,
      title: 'Multi-LLM Comparison',
      description: 'Compare outputs from GPT, Gemini, Claude, DeepSeek and more.',
    },
    {
      icon: Zap,
      title: 'AI Tribunal',
      description: 'Structured debates where models evaluate each other.',
    },
    {
      icon: TrendingUp,
      title: 'Deep Analytics',
      description: 'Similarity, originality, reasoning depth, and performance metrics.',
    },
    {
      icon: Share2,
      title: 'Replay & Share',
      description: 'Save, replay, and share AI comparison sessions.',
    },
  ]

  return (
    <section className="py-20 md:py-32 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Powerful Features for Deep AI Analysis
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to understand how different AI models approach the same problem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent/80 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Border glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-lg pointer-events-none transition-opacity duration-300" style={{
                  background: 'radial-gradient(circle at 30% 70%, rgba(124, 58, 237, 0.2), transparent)',
                }} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
