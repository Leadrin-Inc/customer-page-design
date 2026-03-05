"use client"

import { Star } from "lucide-react"
import Image from "next/image"

interface PrestigeHeroProps {
  buyerName: string
  dealershipName: string
  dealershipLogo?: string
  vehicleTitle: string
  salesperson: {
    name: string
    title: string
    photo: string
  }
  rating?: {
    stars: number
    count: number
  }
}

export function PrestigeHero({
  buyerName,
  vehicleTitle,
  salesperson,
  rating,
}: PrestigeHeroProps) {
  return (
    <section className="bg-foreground text-background px-6 pt-16 pb-20">
      {/* Personal Greeting */}
      <p className="text-xs uppercase tracking-[0.25em] text-background/50 mb-6 text-center">
        Curated for {buyerName}
      </p>

      {/* Vehicle Title - Large Serif */}
      <h1 className="font-serif text-[42px] leading-[1.05] font-normal text-center mb-10 text-balance">
        {vehicleTitle}
      </h1>

      {/* Stats Row */}
      {rating && (
        <div className="flex items-center justify-center gap-8 mb-12">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-background/50 mb-1">
              Rating
            </p>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-light">{rating.stars}</span>
              <Star className="h-4 w-4 fill-background text-background" />
            </div>
          </div>
          <div className="w-px h-10 bg-background/20" />
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-background/50 mb-1">
              Reviews
            </p>
            <span className="text-2xl font-light">{rating.count.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Salesperson */}
      <div className="flex items-center justify-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-background/30">
          <Image
            src={salesperson.photo}
            alt={salesperson.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium">{salesperson.name}</p>
          <p className="text-xs text-background/60">{salesperson.title}</p>
        </div>
      </div>
    </section>
  )
}
