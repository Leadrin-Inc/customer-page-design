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
      <section className="px-6 py-12 bg-background text-center border-b border-border">
        <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
          {noVehicleMessage || "Based on what you are looking for, we will find the perfect match for you."}
        </p>
      </section>
    )
  }

  const vehicleTitle = `${year} ${make} ${model}${trim ? ` ${trim}` : ""}`

  return (
    <section className="bg-background border-b border-border">
      {/* Section Header */}
      <div className="px-6 pt-6">
        <h2 className="text-[22px] font-semibold text-foreground mb-1">
          {vehicleTitle}
        </h2>
        <p className="text-muted-foreground text-[15px] mb-4">
          {[mileage && `${mileage.toLocaleString()} miles`, fuelType, transmission].filter(Boolean).join(" · ")}
        </p>
      </div>

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

        {/* Photo Counter - Airbnb style */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-foreground/80 text-background text-xs font-medium px-2.5 py-1 rounded-md">
            {currentIndex + 1} / {photos.length}
          </div>
        )}

        {/* Navigation Dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  currentIndex === index
                    ? "w-1.5 bg-white"
                    : "w-1.5 bg-white/50"
                )}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Price and Details - Airbnb style */}
      <div className="px-6 py-6">
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-[22px] font-semibold text-foreground">
            ${price.toLocaleString()}
          </span>
        </div>

        {/* Specs Grid - Airbnb amenity style */}
        <div className="grid grid-cols-2 gap-4 py-6 border-t border-border">
          {mileage !== undefined && (
            <div className="flex items-center gap-3">
              <Gauge className="h-6 w-6 text-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{mileage.toLocaleString()} miles</p>
                <p className="text-xs text-muted-foreground">Odometer</p>
              </div>
            </div>
          )}
          {fuelType && (
            <div className="flex items-center gap-3">
              <Fuel className="h-6 w-6 text-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{fuelType}</p>
                <p className="text-xs text-muted-foreground">Fuel type</p>
              </div>
            </div>
          )}
          {transmission && (
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">{transmission}</p>
                <p className="text-xs text-muted-foreground">Transmission</p>
              </div>
            </div>
          )}
        </div>

        {/* Carfax Link - Airbnb underline style */}
        {carfaxUrl && (
          <a
            href={carfaxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground underline hover:text-muted-foreground transition-colors"
          >
            View vehicle history report
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </section>
  )
}
