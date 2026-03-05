"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import Image from "next/image"

interface PrestigeVehicleDetailsProps {
  photos: string[]
  year: number
  make: string
  model: string
  trim: string
  price: number
  mileage: number
  fuelType: string
  transmission: string
  carfaxUrl?: string
}

export function PrestigeVehicleDetails({
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
}: PrestigeVehicleDetailsProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  return (
    <section className="bg-background text-foreground">
      {/* Section Header */}
      <div className="px-6 pt-16 pb-10 text-center">
        <h2 className="font-serif text-[32px] leading-tight mb-3">
          {year} {make} {model}
        </h2>
        <p className="text-sm text-muted-foreground">{trim}</p>
      </div>

      {/* Photo Gallery */}
      <div className="relative aspect-[4/3] mx-6 mb-10">
        <Image
          src={photos[currentPhotoIndex]}
          alt={`${year} ${make} ${model} - Photo ${currentPhotoIndex + 1}`}
          fill
          className="object-cover"
        />
        
        {/* Navigation */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/90 flex items-center justify-center hover:bg-background transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-background/90 flex items-center justify-center hover:bg-background transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            {/* Counter */}
            <div className="absolute bottom-3 right-3 px-3 py-1 bg-background/90 text-xs uppercase tracking-wider">
              {currentPhotoIndex + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Price */}
      <div className="px-6 pb-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
          Price
        </p>
        <p className="font-serif text-[40px]">
          ${price.toLocaleString()}
        </p>
      </div>

      {/* Specs Grid */}
      <div className="px-6 pb-12">
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center py-6 border-t border-border">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Mileage
            </p>
            <p className="text-xl font-light">{mileage.toLocaleString()} mi</p>
          </div>
          <div className="text-center py-6 border-t border-border">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Fuel Type
            </p>
            <p className="text-xl font-light">{fuelType}</p>
          </div>
          <div className="text-center py-6 border-t border-border">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Transmission
            </p>
            <p className="text-xl font-light">{transmission}</p>
          </div>
          <div className="text-center py-6 border-t border-border">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Year
            </p>
            <p className="text-xl font-light">{year}</p>
          </div>
        </div>
      </div>

      {/* Carfax Link */}
      {carfaxUrl && (
        <div className="px-6 pb-16">
          <a
            href={carfaxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-4 border border-foreground text-foreground text-xs uppercase tracking-[0.15em] hover:bg-foreground hover:text-background transition-colors"
          >
            View Carfax Report
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </section>
  )
}
