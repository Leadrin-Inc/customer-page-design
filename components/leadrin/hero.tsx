"use client"

import { Star } from "lucide-react"
import Image from "next/image"

interface HeroProps {
  buyerName: string
  dealershipName: string
  dealershipLogo?: string
  primaryColor: string
  vehicleTitle?: string
  salesperson: {
    name: string
    title: string
    photo: string
  }
  rating: {
    stars: number
    count: number
  }
}

export function Hero({
  buyerName,
  dealershipName,
  dealershipLogo,
  primaryColor,
  vehicleTitle,
  salesperson,
  rating,
}: HeroProps) {
  return (
    <section
      className="relative px-5 pt-12 pb-8"
      style={{
        background: `linear-gradient(180deg, ${primaryColor} 0%, ${primaryColor}dd 50%, ${primaryColor}99 100%)`,
      }}
    >
      {/* Dealership Logo/Name */}
      <div className="mb-8">
        {dealershipLogo ? (
          <Image
            src={dealershipLogo}
            alt={dealershipName}
            width={120}
            height={32}
            className="h-8 w-auto brightness-0 invert"
          />
        ) : (
          <span className="text-sm font-medium tracking-wide text-primary-foreground/90">
            {dealershipName}
          </span>
        )}
      </div>

      {/* Prepared Label */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/70 mb-2">
        Prepared for you
      </p>

      {/* Greeting */}
      <h1 className="font-serif text-4xl font-medium tracking-tight text-primary-foreground mb-3">
        Hi {buyerName}
      </h1>

      {/* Subtitle */}
      {vehicleTitle && (
        <p className="text-base text-primary-foreground/90 mb-6 leading-relaxed">
          Your {vehicleTitle} is ready to explore
        </p>
      )}

      {/* Salesperson Row */}
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-primary-foreground/20">
          <Image
            src={salesperson.photo}
            alt={salesperson.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary-foreground">
            {salesperson.name}
          </p>
          <p className="text-xs text-primary-foreground/70">{salesperson.title}</p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium text-primary-foreground">
            {rating.stars.toFixed(1)}
          </span>
          <span className="text-xs text-primary-foreground/60">
            ({rating.count.toLocaleString()})
          </span>
        </div>
      </div>
    </section>
  )
}
