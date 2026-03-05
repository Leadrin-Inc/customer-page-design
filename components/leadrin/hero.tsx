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
    <section className="bg-foreground text-primary-foreground px-6 pt-14 pb-14">
      {/* Dealership Logo/Name */}
      <div className="text-center mb-12">
        {dealershipLogo ? (
          <Image
            src={dealershipLogo}
            alt={dealershipName}
            width={120}
            height={32}
            className="h-5 w-auto mx-auto brightness-0 invert opacity-60"
          />
        ) : (
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-primary-foreground/40">
            {dealershipName}
          </span>
        )}
      </div>

      {/* Prepared For Label */}
      <p className="text-center text-[10px] font-medium uppercase tracking-[0.25em] text-primary-foreground/35 mb-5">
        Prepared for you
      </p>

      {/* Main Headline */}
      <h1 className="font-serif text-[2.5rem] leading-[1.08] text-center text-balance mb-4">
        Hi {buyerName}.
        <br />
        <span className="italic">Your ride awaits.</span>
      </h1>

      {/* Subtitle */}
      {vehicleTitle && (
        <p className="text-center text-primary-foreground/55 text-[15px] leading-relaxed max-w-[300px] mx-auto mb-12">
          {"We've prepared a personalized experience for your"} {vehicleTitle}.
        </p>
      )}

      {/* Thin Divider */}
      <div className="w-12 h-px bg-primary-foreground/15 mx-auto mb-10" />

      {/* Salesperson + Rating Row */}
      <div className="flex justify-center gap-10">
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-primary-foreground/30 mb-2">
            Your Consultant
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-primary-foreground/10">
              <Image
                src={salesperson.photo}
                alt={salesperson.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <span className="text-sm font-medium block">{salesperson.name}</span>
              <span className="text-[11px] text-primary-foreground/40">{salesperson.title}</span>
            </div>
          </div>
        </div>
        <div className="w-px bg-primary-foreground/10" />
        <div className="text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-primary-foreground/30 mb-2">
            Dealer Rating
          </p>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Star className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
            <span className="text-xl font-serif">{rating.stars.toFixed(1)}</span>
          </div>
          <p className="text-[10px] text-primary-foreground/35">
            {rating.count.toLocaleString()} reviews
          </p>
        </div>
      </div>
    </section>
  )
}
