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
    <section className="px-5 py-8 border-t border-slate-100">
      {/* Price - Hero treatment */}
      <div className="mb-6">
        <p className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase mb-1">Price</p>
        <p className="text-4xl font-bold text-slate-900 tracking-tight">
          ${price.toLocaleString()}
        </p>
      </div>

      {/* Photo Gallery */}
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 mb-4">
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
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <ChevronLeft className="h-5 w-5 text-slate-700" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <ChevronRight className="h-5 w-5 text-slate-700" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail dots */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-1.5 mb-8">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPhotoIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === currentPhotoIndex ? "w-6 bg-slate-900" : "w-1.5 bg-slate-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* Specs - Compact inline */}
      <div className="flex items-center justify-between gap-3 py-3 px-1 mb-4 border-t border-slate-100">
        <div className="text-center flex-1">
          <p className="text-[9px] font-medium text-slate-400 uppercase">Miles</p>
          <p className="text-xs font-semibold text-slate-900">{mileage.toLocaleString()}</p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="text-center flex-1">
          <p className="text-[9px] font-medium text-slate-400 uppercase">Fuel</p>
          <p className="text-xs font-semibold text-slate-900">{fuelType}</p>
        </div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="text-center flex-1">
          <p className="text-[9px] font-medium text-slate-400 uppercase">Trans</p>
          <p className="text-xs font-semibold text-slate-900 truncate">{transmission}</p>
        </div>
      </div>

      {/* Carfax */}
      {carfaxUrl && (
        <a
          href={carfaxUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          View Carfax Report
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </section>
  )
}
