export default function TechStackSection() {
  // const technologies = [
  //   { name: 'FastAPI', category: 'Backend' },
  //   { name: 'React / Next.js', category: 'Frontend' },
  //   { name: 'Multiple LLM APIs', category: 'AI' },
  //   { name: 'Analytics Engine', category: 'Data' },
  // ]

  return (
    <section className="py-16 md:py-24 bg-background border-t border-border/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-lg font-semibold text-primary mb-2">Built with Modern Tech</h3>
          <h2 className="text-3xl md:text-4xl font-bold text-balance">
            Powerful Technology Stack
          </h2>
        </div>

        <div className="flex flex-wrap gap-3 justify-center items-center">
          {/* {technologies.map((tech, index) => (
            <div
              key={index}
              className="group px-4 py-3 rounded-full border border-border/50 bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 cursor-default"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-card-foreground">{tech.name}</span>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full group-hover:bg-primary/20 transition-colors">
                  {tech.category}
                </span>
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </section>
  )
}
