"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, ExternalLink, Fuel, Gauge, Settings } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface VehicleDetailsProps {
  photos: string[]
  year: number
  make: string
  model: string
  trim?: string
  price: number
  mileage?: number
  fuelType?: string
  transmission?: string
  carfaxUrl?: string
  noVehicleMessage?: string
}

export function VehicleDetails({
  photos,
  year,
  make,
  model,
  trim,
  price,
  mileage,
  fuelType,
  transmission,
  carfaxUrl,
  noVehicleMessage,
}: VehicleDetailsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const itemWidth = container.offsetWidth
      const newIndex = Math.round(scrollLeft / itemWidth)
      setCurrentIndex(newIndex)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (index: number) => {
    scrollRef.current?.scrollTo({
      left: index * (scrollRef.current?.offsetWidth || 0),
      behavior: "smooth",
    })
  }

  if (noVehicleMessage || photos.length === 0) {
    return (
      <section className="px-6 py-16 bg-foreground text-center">
        <p className="text-sm text-primary-foreground/55 leading-loose max-w-[280px] mx-auto">
          {noVehicleMessage || "Based on what you're looking for, we'll find the perfect match for you."}
        </p>
      </section>
    )
  }

  const vehicleTitle = `${year} ${make} ${model}${trim ? ` ${trim}` : ""}`

  return (
    <section className="bg-foreground text-primary-foreground">
      {/* Photo Gallery */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {photos.map((photo, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full aspect-[4/3] snap-center relative"
            >
              <Image
                src={photo}
                alt={`${vehicleTitle} - Photo ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Photo Counter */}
        {photos.length > 1 && (
          <div className="absolute top-4 right-4 bg-foreground/70 backdrop-blur-sm text-primary-foreground text-[11px] font-medium tracking-wider px-3 py-1.5 rounded-full">
            {currentIndex + 1}/{photos.length}
          </div>
        )}

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={() => scrollTo(currentIndex - 1)}
              disabled={currentIndex === 0}
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-foreground/50 backdrop-blur-sm flex items-center justify-center transition-opacity",
                currentIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5 text-primary-foreground" />
            </button>
            <button
              onClick={() => scrollTo(currentIndex + 1)}
              disabled={currentIndex === photos.length - 1}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-foreground/50 backdrop-blur-sm flex items-center justify-center transition-opacity",
                currentIndex === photos.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5 text-primary-foreground" />
            </button>
          </>
        )}
      </div>

      {/* Vehicle Info - Sotheby's structured layout */}
      <div className="px-6 pt-10 pb-12">
        {/* Location-style label */}
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary-foreground/35 mb-2">
          {make} {model}
        </p>
        <h2 className="font-serif text-[1.65rem] leading-tight text-balance mb-8">
          {vehicleTitle}
        </h2>

        {/* Structured Detail Grid - Sotheby's style */}
        <div className="grid grid-cols-3 gap-x-6 gap-y-6 mb-8">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-primary-foreground/35 mb-1.5">
              Price
            </p>
            <p className="text-lg font-serif">${price.toLocaleString()}</p>
          </div>
          {mileage !== undefined && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-primary-foreground/35 mb-1.5">
                Mileage
              </p>
              <p className="text-lg font-serif">{mileage.toLocaleString()}</p>
              <p className="text-[10px] text-primary-foreground/30">miles</p>
            </div>
          )}
          {fuelType && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-primary-foreground/35 mb-1.5">
                Fuel
              </p>
              <p className="text-lg font-serif">{fuelType}</p>
            </div>
          )}
        </div>

        {/* Specs Row */}
        {transmission && (
          <div className="border-t border-primary-foreground/10 pt-6 mb-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-primary-foreground/35 mb-1.5">
                  Transmission
                </p>
                <p className="text-sm font-medium">{transmission}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-primary-foreground/35 mb-1.5">
                  Year
                </p>
                <p className="text-sm font-medium">{year}</p>
              </div>
            </div>
          </div>
        )}

        {/* Carfax Link */}
        {carfaxUrl && (
          <a
            href={carfaxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          >
            View Vehicle History
            <ArrowRight className="h-3 w-3" />
          </a>
        )}
      </div>
    </section>
  )
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
