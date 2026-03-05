"use client"

import { Star } from "lucide-react"
import Image from "next/image"

interface HeroProps {
  buyerName: string
  dealershipName: string
  dealershipLogo?: string
  vehicleTitle?: string
  rating: {
    stars: number
    count: number
  }
}

export function Hero({
  buyerName,
  dealershipName,
  dealershipLogo,
  vehicleTitle,
  rating,
}: HeroProps) {
  return (
    <section className="bg-background px-6 pt-4 pb-3">
      {/* Compact Header Row */}
      <div className="flex items-center justify-between mb-3">
        {dealershipLogo ? (
          <Image
            src={dealershipLogo}
            alt={dealershipName}
            width={80}
            height={24}
            className="h-4 w-auto opacity-60"
          />
        ) : (
          <span className="text-xs text-muted-foreground">{dealershipName}</span>
        )}
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
          <span className="text-xs font-medium">{rating.stars.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">({rating.count.toLocaleString()})</span>
        </div>
      </div>

      {/* Personalized Greeting - Compact */}
      <h1 className="text-lg font-semibold text-foreground">
        Curated for {buyerName}
      </h1>
      {vehicleTitle && (
        <p className="text-sm text-muted-foreground">{vehicleTitle}</p>
      )}
    </section>
  )
}
