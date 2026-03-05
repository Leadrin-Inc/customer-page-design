"use client"

import { Star } from "lucide-react"
import Image from "next/image"

interface HeroProps {
  buyerName: string
  dealershipName: string
  dealershipLogo?: string
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
  vehicleTitle,
  salesperson,
  rating,
}: HeroProps) {
  return (
    <section className="bg-foreground text-primary-foreground px-6 pt-14 pb-12">
      {/* Dealership Logo/Name */}
      <div className="text-center mb-10">
        {dealershipLogo ? (
          <Image
            src={dealershipLogo}
            alt={dealershipName}
            width={120}
            height={32}
            className="h-6 w-auto mx-auto brightness-0 invert"
          />
        ) : (
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-primary-foreground/50">
            {dealershipName}
          </span>
        )}
      </div>

      {/* Main Headline */}
      <h1 className="font-serif text-[2.75rem] leading-[1.1] text-center text-balance mb-6">
        Hi {buyerName}.
        <br />
        <span className="italic">Your ride awaits.</span>
      </h1>

      {/* Subtitle */}
      {vehicleTitle && (
        <p className="text-center text-primary-foreground/70 text-sm leading-relaxed max-w-[280px] mx-auto mb-10">
          We've prepared a personalized experience for your {vehicleTitle}. Explore everything below.
        </p>
      )}

      {/* Stats Row */}
      <div className="flex justify-center gap-10 mb-10">
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-primary-foreground/40 mb-1">
            Rating
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <Star className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
            <span className="text-2xl font-serif">{rating.stars.toFixed(1)}</span>
          </div>
          <p className="text-[10px] text-primary-foreground/40 mt-0.5">
            {rating.count.toLocaleString()} reviews
          </p>
        </div>
        <div className="w-px bg-primary-foreground/15" />
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-primary-foreground/40 mb-1">
            Your Consultant
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="relative h-7 w-7 overflow-hidden rounded-full">
              <Image
                src={salesperson.photo}
                alt={salesperson.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm font-medium">{salesperson.name}</span>
          </div>
          <p className="text-[10px] text-primary-foreground/40 mt-0.5">
            {salesperson.title}
          </p>
        </div>
      </div>
    </section>
  )
}
