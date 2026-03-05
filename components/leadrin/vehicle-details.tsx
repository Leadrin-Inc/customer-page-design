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
      <section className="px-6 py-14 bg-foreground text-center">
        <p className="text-sm text-primary-foreground/60 leading-relaxed">
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

        {/* Navigation Arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={() => scrollTo(currentIndex - 1)}
              disabled={currentIndex === 0}
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-primary-foreground/20 bg-foreground/60 backdrop-blur flex items-center justify-center transition-opacity",
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
                "absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-primary-foreground/20 bg-foreground/60 backdrop-blur flex items-center justify-center transition-opacity",
                currentIndex === photos.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"
              )}
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5 text-primary-foreground" />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  index === currentIndex
                    ? "w-6 bg-primary-foreground"
                    : "w-1.5 bg-primary-foreground/30"
                )}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Vehicle Info - Centered editorial style */}
      <div className="px-6 py-12 text-center">
        <h2 className="font-serif text-3xl text-balance mb-3">
          {vehicleTitle}
        </h2>

        {/* Price and Stats */}
        <div className="flex justify-center gap-8 mt-8 mb-8">
          <div className="text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-primary-foreground/40 mb-1">
              Price
            </p>
            <p className="text-2xl font-serif">${price.toLocaleString()}</p>
          </div>
          {mileage && (
            <>
              <div className="w-px bg-primary-foreground/15" />
              <div className="text-center">
                <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-primary-foreground/40 mb-1">
                  Mileage
                </p>
                <p className="text-2xl font-serif">{mileage.toLocaleString()}</p>
                <p className="text-[10px] text-primary-foreground/40 mt-0.5">miles</p>
              </div>
            </>
          )}
        </div>

        {/* Specs */}
        <div className="flex justify-center gap-6 text-xs text-primary-foreground/50 mb-10">
          {fuelType && (
            <div className="flex items-center gap-1.5">
              <Fuel className="h-3.5 w-3.5" />
              <span>{fuelType}</span>
            </div>
          )}
          {transmission && (
            <div className="flex items-center gap-1.5">
              <Settings className="h-3.5 w-3.5" />
              <span>{transmission}</span>
            </div>
          )}
          {mileage && (
            <div className="flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5" />
              <span>{mileage.toLocaleString()} mi</span>
            </div>
          )}
        </div>

        {/* Carfax */}
        {carfaxUrl && (
          <a
            href={carfaxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary-foreground/30 text-primary-foreground text-xs font-semibold uppercase tracking-[0.1em] hover:bg-primary-foreground/10 transition-colors"
          >
            View Vehicle History
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </section>
  )
}
