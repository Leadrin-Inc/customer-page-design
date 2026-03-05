"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
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

  return (
    <section className="bg-white px-6 py-8">
      {/* Section Header */}
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Photos</h2>

      {/* Photo Gallery */}
      <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-neutral-100 mb-6">
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
              className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-4 w-4 text-neutral-700" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-sm"
              aria-label="Next photo"
            >
              <ChevronRight className="h-4 w-4 text-neutral-700" />
            </button>
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-neutral-900/70 text-xs font-medium text-white">
              {currentPhotoIndex + 1}/{photos.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-6 px-6 scrollbar-hide">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setCurrentPhotoIndex(index)}
              className={`relative flex-shrink-0 w-16 h-12 rounded overflow-hidden ${
                index === currentPhotoIndex ? "ring-2 ring-neutral-900" : "opacity-60 hover:opacity-100"
              } transition-all`}
            >
              <Image src={photo} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Price */}
      <div className="mb-6">
        <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Price</p>
        <p className="text-2xl font-semibold text-neutral-900">
          ${price.toLocaleString()}
        </p>
      </div>

      {/* Specs - Simple list */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between py-2 border-b border-neutral-100">
          <span className="text-sm text-neutral-500">Mileage</span>
          <span className="text-sm font-medium text-neutral-900">{mileage.toLocaleString()} mi</span>
        </div>
        <div className="flex justify-between py-2 border-b border-neutral-100">
          <span className="text-sm text-neutral-500">Fuel Type</span>
          <span className="text-sm font-medium text-neutral-900">{fuelType}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-neutral-100">
          <span className="text-sm text-neutral-500">Transmission</span>
          <span className="text-sm font-medium text-neutral-900">{transmission}</span>
        </div>
      </div>

      {/* Carfax Link */}
      {carfaxUrl && (
        <a
          href={carfaxUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          View Carfax Report
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </section>
  )
}
