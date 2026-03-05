import Link from "next/link"

const themes = [
  {
    id: "classic",
    name: "Classic",
    description: "Warm, inviting, and approachable. Inspired by Airbnb's friendly design language with Toyota red accents. Perfect for mainstream dealerships.",
    bestFor: "Honda, Toyota, Ford, Chevrolet",
    colors: ["#ffffff", "#eb4432", "#1a1a1a", "#f5f5f5"],
  },
  {
    id: "prestige",
    name: "Prestige",
    description: "Bold editorial aesthetic inspired by Lucid Motors. Alternating dark/light sections, serif headlines, and sharp geometric lines.",
    bestFor: "BMW, Mercedes, Audi, Lexus",
    colors: ["#0a0a0a", "#faf9f7", "#c4a962", "#ffffff"],
  },
  {
    id: "modern",
    name: "Modern",
    description: "Tech-forward and sleek. Inspired by Stripe's clean design with purple/indigo gradients, rounded elements, and a contemporary feel.",
    bestFor: "Tesla, Rivian, Polestar, Lucid",
    colors: ["#ffffff", "#7c3aed", "#6366f1", "#f5f3ff"],
  },
]

export default function ThemeSelectionPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 pt-16 pb-12 text-center max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Leadrin Design System
        </p>
        <h1 className="text-3xl font-semibold text-foreground mb-4">
          Customer Page Themes
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Choose a design theme that matches your dealership brand. Each theme is fully customizable and optimized for mobile-first customer experiences.
        </p>
      </header>

      {/* Theme Cards */}
      <div className="px-6 pb-16 max-w-2xl mx-auto">
        <div className="space-y-6">
          {themes.map((theme) => (
            <Link
              key={theme.id}
              href={`/${theme.id}`}
              className="block border border-border rounded-xl p-6 hover:border-foreground transition-colors group"
            >
              {/* Color Palette Preview */}
              <div className="flex gap-2 mb-4">
                {theme.colors.map((color, index) => (
                  <div
                    key={index}
                    className="h-8 w-8 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Theme Info */}
              <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {theme.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {theme.description}
              </p>

              {/* Best For */}
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Best for:
                </span>
                <span className="text-xs text-foreground">
                  {theme.bestFor}
                </span>
              </div>

              {/* Preview Link */}
              <div className="mt-4 pt-4 border-t border-border">
                <span className="text-sm font-medium text-primary group-hover:underline">
                  Preview theme →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 text-center border-t border-border">
        <p className="text-xs text-muted-foreground">
          More themes coming soon: Sport, Eco
        </p>
      </footer>
    </main>
  )
}
