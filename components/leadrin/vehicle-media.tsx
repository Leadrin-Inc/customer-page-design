"use client"

import { useState } from "react"
import { Play, X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Feature {
  id: string
  name: string
  description: string
  category: string
  position: { x: number; y: number }
  closeUpImage?: string
}

interface VehicleMediaProps {
  vehicleImage?: string
  features?: Feature[]
  walkaroundVideo?: string
  vehicleTitle: string
}

export function VehicleMedia({
  vehicleImage,
  features = [],
  walkaroundVideo,
  vehicleTitle,
}: VehicleMediaProps) {
  const [activeTab, setActiveTab] = useState<"features" | "walkthrough">(
    features.length > 0 ? "features" : "walkthrough"
  )
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const hasFeatures = features.length > 0 && vehicleImage
  const hasVideo = !!walkaroundVideo

  // If neither exists, don't render
  if (!hasFeatures && !hasVideo) return null

  const showTabs = hasFeatures && hasVideo

  return (
    <section className="bg-card">
      {/* Tabs (only if both exist) */}
      {showTabs && (
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("features")}
            className={cn(
              "flex-1 py-3 text-xs font-semibold uppercase tracking-wide transition-colors",
              activeTab === "features"
                ? "text-foreground border-b-2 border-foreground"
                : "text-muted-foreground"
            )}
          >
            Features
          </button>
          <button
            onClick={() => setActiveTab("walkthrough")}
            className={cn(
              "flex-1 py-3 text-xs font-semibold uppercase tracking-wide transition-colors",
              activeTab === "walkthrough"
                ? "text-foreground border-b-2 border-foreground"
                : "text-muted-foreground"
            )}
          >
            Walkthrough
          </button>
        </div>
      )}

      {/* Features View */}
      {(activeTab === "features" || (!showTabs && hasFeatures)) && hasFeatures && (
        <div className="relative">
          {/* Vehicle Image with Hotspots */}
          <div className="relative aspect-[4/3]">
            <Image
              src={vehicleImage}
              alt={vehicleTitle}
              fill
              className="object-cover"
            />
            
            {/* Hotspot Markers */}
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature)}
                className={cn(
                  "absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full",
                  "bg-primary text-primary-foreground",
                  "flex items-center justify-center",
                  "ring-2 ring-primary-foreground/50",
                  "transition-transform hover:scale-110 active:scale-95",
                  "shadow-lg"
                )}
                style={{ left: `${feature.position.x}%`, top: `${feature.position.y}%` }}
              >
                <span className="text-xs font-bold">+</span>
              </button>
            ))}
          </div>

          {/* Feature Detail Panel */}
          {selectedFeature && (
            <div className="absolute inset-0 bg-foreground/95 text-primary-foreground p-5 flex flex-col">
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-foreground/60 mb-2">
                {selectedFeature.category}
              </span>
              <h3 className="font-serif text-2xl font-medium mb-3">
                {selectedFeature.name}
              </h3>
              <p className="text-sm text-primary-foreground/80 leading-relaxed mb-4">
                {selectedFeature.description}
              </p>

              {selectedFeature.closeUpImage && (
                <div className="relative flex-1 min-h-[120px] rounded-lg overflow-hidden">
                  <Image
                    src={selectedFeature.closeUpImage}
                    alt={selectedFeature.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Video View */}
      {(activeTab === "walkthrough" || (!showTabs && hasVideo)) && hasVideo && (
        <div className="relative">
          {!showTabs && (
            <p className="px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Vehicle Walkthrough
            </p>
          )}
          <div className="relative aspect-video bg-muted">
            {!isVideoPlaying ? (
              <>
                {/* Video Thumbnail */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-foreground/20" />
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="h-16 w-16 rounded-full bg-primary-foreground flex items-center justify-center shadow-xl">
                    <Play className="h-7 w-7 text-foreground ml-1" fill="currentColor" />
                  </div>
                </button>
              </>
            ) : (
              <video
                src={walkaroundVideo}
                controls
                autoPlay
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      )}
    </section>
  )
}
