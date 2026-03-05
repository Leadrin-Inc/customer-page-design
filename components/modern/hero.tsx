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
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-indigo-50 to-white" />
      
      {/* Content */}
      <div className="relative px-6 pt-12 pb-10">
        {/* Dealership Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur border border-violet-100 mb-6">
          <span className="text-xs font-medium text-foreground">{dealershipName}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-[32px] font-semibold leading-tight text-foreground mb-4 max-w-[320px]">
          {firstName}, your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
            {vehicleTitle}
          </span>{" "}
          awaits
        </h1>

        {/* Subtext */}
        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-[300px] mb-8">
          A personalized experience prepared just for you by {salespersonName} at {dealershipName}.
        </p>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(salespersonRating)
                    ? "text-violet-500 fill-violet-500"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {salespersonRating} rating
          </span>
        </div>
      </div>
    </section>
  )
}
