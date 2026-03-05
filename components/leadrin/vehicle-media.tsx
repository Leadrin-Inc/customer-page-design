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

  if (!hasFeatures && !hasVideo) return null

  const showTabs = hasFeatures && hasVideo

  return (
    <section className="bg-background">
      {/* Section Header */}
      <div className="px-6 pt-12 pb-6 text-center">
        <h2 className="font-serif text-3xl text-balance">
          Explore Your Vehicle
        </h2>
        <p className="text-sm text-muted-foreground mt-3 max-w-[280px] mx-auto leading-relaxed">
          Tap the hotspots to discover key features, or watch a full walkthrough.
        </p>
      </div>

      {/* Tab Switcher */}
      {showTabs && (
        <div className="flex items-center justify-center gap-3 px-6 pb-6">
          <button
            onClick={() => {
              setActiveTab("features")
              setIsVideoPlaying(false)
            }}
            className={cn(
              "px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.1em] transition-all",
              activeTab === "features"
                ? "bg-foreground text-primary-foreground"
                : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
          >
            Features
          </button>
          <button
            onClick={() => {
              setActiveTab("walkthrough")
              setSelectedFeature(null)
            }}
            className={cn(
              "px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.1em] transition-all",
              activeTab === "walkthrough"
                ? "bg-foreground text-primary-foreground"
                : "border border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
          >
            Walkthrough
          </button>
        </div>
      )}

      {/* Features View */}
      {(activeTab === "features" || (!showTabs && hasFeatures)) && hasFeatures && (
        <div className="relative">
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
                  "absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full",
                  "bg-foreground text-primary-foreground",
                  "flex items-center justify-center",
                  "ring-2 ring-background/60",
                  "transition-transform hover:scale-110 active:scale-95",
                  "shadow-lg"
                )}
                style={{ left: `${feature.position.x}%`, top: `${feature.position.y}%` }}
                aria-label={`View ${feature.name} details`}
              >
                <span className="text-xs font-bold">+</span>
              </button>
            ))}
          </div>

          {/* Feature Detail Overlay */}
          {selectedFeature && (
            <div className="absolute inset-0 bg-foreground text-primary-foreground p-6 flex flex-col animate-in fade-in duration-200">
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
                aria-label="Close feature details"
              >
                <X className="h-5 w-5" />
              </button>

              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/40 mb-3">
                {selectedFeature.category}
              </span>
              <h3 className="font-serif text-2xl mb-4">
                {selectedFeature.name}
              </h3>
              <p className="text-sm text-primary-foreground/70 leading-relaxed mb-6">
                {selectedFeature.description}
              </p>

              {selectedFeature.closeUpImage && (
                <div className="relative flex-1 min-h-[120px] overflow-hidden">
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
        <div className="relative aspect-video bg-foreground">
          {!isVideoPlaying ? (
            <button
              onClick={() => setIsVideoPlaying(true)}
              className="absolute inset-0 flex flex-col items-center justify-center"
              aria-label="Play vehicle walkthrough video"
            >
              <div className="h-16 w-16 rounded-full border-2 border-primary-foreground/40 flex items-center justify-center mb-4 transition-colors hover:border-primary-foreground/70">
                <Play className="h-6 w-6 text-primary-foreground ml-0.5" fill="currentColor" />
              </div>
              <span className="text-xs uppercase tracking-[0.15em] text-primary-foreground/50">
                Play Walkthrough
              </span>
            </button>
          ) : (
            <video
              src={walkaroundVideo}
              controls
              autoPlay
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      )}
    </section>
  )
}
