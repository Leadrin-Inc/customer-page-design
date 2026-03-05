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

  // Handle scroll to update current index
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

  // No vehicle match state
  if (noVehicleMessage || photos.length === 0) {
    return (
      <section className="px-5 py-8 bg-secondary">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {noVehicleMessage || "Based on what you're looking for, we'll find the perfect match for you."}
        </p>
      </section>
    )
  }

  const vehicleTitle = `${year} ${make} ${model}${trim ? ` ${trim}` : ""}`

  return (
    <section className="bg-card">
      {/* Photo Gallery */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
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
                "absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-card/90 flex items-center justify-center shadow-md transition-opacity",
                currentIndex === 0 ? "opacity-0" : "opacity-100"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollTo(currentIndex + 1)}
              disabled={currentIndex === photos.length - 1}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-card/90 flex items-center justify-center shadow-md transition-opacity",
                currentIndex === photos.length - 1 ? "opacity-0" : "opacity-100"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Counter */}
        {photos.length > 1 && (
          <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-foreground/80 text-primary-foreground text-xs font-medium">
            {currentIndex + 1} / {photos.length}
          </div>
        )}
      </div>

      {/* Vehicle Info */}
      <div className="px-5 py-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-foreground">
              {vehicleTitle}
            </h2>
          </div>
          <p className="text-xl font-semibold text-foreground whitespace-nowrap">
            ${price.toLocaleString()}
          </p>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-5">
          {mileage && (
            <div className="flex items-center gap-1.5">
              <Gauge className="h-4 w-4" />
              <span>{mileage.toLocaleString()} mi</span>
            </div>
          )}
          {fuelType && (
            <div className="flex items-center gap-1.5">
              <Fuel className="h-4 w-4" />
              <span>{fuelType}</span>
            </div>
          )}
          {transmission && (
            <div className="flex items-center gap-1.5">
              <Settings className="h-4 w-4" />
              <span>{transmission}</span>
            </div>
          )}
        </div>

        {/* Carfax Badge */}
        {carfaxUrl && (
          <a
            href={carfaxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-border transition-colors"
          >
            <Image
              src="/carfax-badge.svg"
              alt="Carfax"
              width={60}
              height={20}
              className="h-5 w-auto"
            />
            <span>View Vehicle History</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
        )}
      </div>
    </section>
  )
}
