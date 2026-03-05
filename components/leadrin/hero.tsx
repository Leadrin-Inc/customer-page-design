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
    <section className="bg-background px-6 pt-6 pb-4">
      {/* Dealership Name - subtle */}
      <div className="text-center mb-6">
        {dealershipLogo ? (
          <Image
            src={dealershipLogo}
            alt={dealershipName}
            width={100}
            height={28}
            className="h-5 w-auto mx-auto opacity-60"
          />
        ) : (
          <span className="text-xs text-muted-foreground">
            {dealershipName}
          </span>
        )}
      </div>

      {/* Main Headline - Airbnb style */}
      <h1 className="text-[22px] font-semibold leading-tight text-foreground mb-1">
        Hi {buyerName}, your vehicle is ready
      </h1>

      {/* Subtitle */}
      {vehicleTitle && (
        <p className="text-muted-foreground text-[15px] leading-relaxed mb-6">
          {vehicleTitle}
        </p>
      )}

      {/* Guest Favorite style badge - like Airbnb */}
      <div className="flex items-center justify-between py-5 border-y border-border">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={salesperson.photo}
              alt={salesperson.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Hosted by {salesperson.name.split(" ")[0]}</p>
            <p className="text-xs text-muted-foreground">{salesperson.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-foreground text-foreground" />
            <span className="text-sm font-semibold">{rating.stars.toFixed(2)}</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm font-semibold underline">
            {rating.count.toLocaleString()} reviews
          </span>
        </div>
      </div>
    </section>
  )
}
