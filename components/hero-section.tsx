export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-accent/5 py-20 md:py-32">
      {/* Neural network background grid */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full opacity-[0.03] dark:opacity-[0.05]" viewBox="0 0 1200 600">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="url(#gridGradient)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <rect width="1200" height="600" fill="url(#grid)" />
        </svg>
      </div>

      {/* Glow orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-48 -mt-48 dark:opacity-30 opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -ml-48 -mb-48 dark:opacity-30 opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-balance">
            Compare AI Minds.
          </span>
          <br />
          <span className="text-balance bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            In Real Time.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Kyrix.ai is an AI playground to run the same prompt across multiple large language models and analyze how they think, reason, and respond — side by side.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="group px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
            Enter the Playground
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </button>
          
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          {['GPT-4', 'Claude 3', 'Gemini Pro', 'DeepSeek'].map((model) => (
            <div key={model} className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-card-foreground backdrop-blur-sm">
              {model}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
