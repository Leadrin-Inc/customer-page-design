"use client"

import { Star } from "lucide-react"

interface HeroProps {
  buyerName: string
  dealershipName: string
  dealershipLogo?: string
  vehicleTitle: string
  salespersonName: string
  salespersonRating: number
}

export function Hero({
  buyerName,
  dealershipName,
  vehicleTitle,
  salespersonName,
  salespersonRating,
}: HeroProps) {
  const firstName = buyerName.split(" ")[0]

  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-indigo-50/50 to-white" />
      
      {/* Content - Compact */}
      <div className="relative px-6 pt-4 pb-4">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur border border-violet-100">
            <span className="text-[10px] font-medium text-foreground">{dealershipName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-violet-500 fill-violet-500" />
            <span className="text-xs text-muted-foreground">{salespersonRating}</span>
          </div>
        </div>

        {/* Compact Headline */}
        <p className="text-xs text-muted-foreground mb-0.5">Curated for {firstName}</p>
        <h1 className="text-xl font-semibold text-foreground">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
            {vehicleTitle}
          </span>
        </h1>
      </div>
    </section>
  )
}
