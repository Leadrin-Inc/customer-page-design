import { Star } from "lucide-react"

interface PrestigeHeroProps {
  buyerName: string
  vehicleTitle: string
  rating?: {
    stars: number
    count: number
  }
}

export function PrestigeHero({
  buyerName,
  vehicleTitle,
  rating,
}: PrestigeHeroProps) {
  return (
    <section className="bg-foreground text-background px-6 pt-6 pb-6">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-background/50">
          Curated for {buyerName}
        </p>
        {rating && (
          <div className="flex items-center gap-1 text-background/70">
            <Star className="h-3 w-3 fill-background/70" />
            <span className="text-xs">{rating.stars}</span>
            <span className="text-[10px] text-background/40">({rating.count.toLocaleString()})</span>
          </div>
        )}
      </div>

      {/* Vehicle Title - Serif but smaller */}
      <h1 className="font-serif text-[28px] leading-tight font-normal text-balance">
        {vehicleTitle}
      </h1>
    </section>
  )
}
