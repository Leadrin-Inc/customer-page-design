"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Fuel, Gauge, Settings, ExternalLink } from "lucide-react"
import Image from "next/image"

interface VehicleDetailsProps {
  photos: string[]
  price: number
  mileage: number
  fuelType: string
  transmission: string
  vehicleTitle: string
  carfaxUrl?: string
}

export function VehicleDetails({
  photos,
  price,
  mileage,
  fuelType,
  transmission,
  vehicleTitle,
  carfaxUrl,
}: VehicleDetailsProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const nextPhoto = () => setCurrentPhotoIndex((i) => (i + 1) % photos.length)
  const prevPhoto = () => setCurrentPhotoIndex((i) => (i - 1 + photos.length) % photos.length)

  const specs = [
    { icon: Gauge, label: "Mileage", value: `${mileage.toLocaleString()} mi` },
    { icon: Fuel, label: "Fuel", value: fuelType },
    { icon: Settings, label: "Transmission", value: transmission },
  ]

  return (
    <section className="bg-white px-6 py-8 border-t border-border">
      {/* Section Header with Stripe accent */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
        <h2 className="text-xl font-semibold text-foreground">Vehicle Details</h2>
      </div>

      {/* Photo Gallery */}
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-secondary mb-6">
        <Image
          src={photos[currentPhotoIndex]}
          alt={`${vehicleTitle} photo ${currentPhotoIndex + 1}`}
          fill
          className="object-cover"
        />

        {photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-medium text-foreground">
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Price - Large gradient text */}
      <div className="mb-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Price</p>
        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
          ${price.toLocaleString()}
        </p>
      </div>

      {/* Specs - Stripe style cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="p-4 rounded-xl bg-secondary/50 border border-border"
          >
            <spec.icon className="h-5 w-5 text-violet-500 mb-2" />
            <p className="text-xs text-muted-foreground mb-0.5">{spec.label}</p>
            <p className="text-sm font-semibold text-foreground">{spec.value}</p>
          </div>
        ))}
      </div>

      {/* Carfax Link */}
      {carfaxUrl && (
        <a
          href={carfaxUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
        >
          View Carfax Report
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </section>
  )
}
