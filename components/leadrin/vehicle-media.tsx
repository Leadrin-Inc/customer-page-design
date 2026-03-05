"use client"

import { useState } from "react"
import { Play, X, Video, Crosshair } from "lucide-react"
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
      <div className="px-6 pt-14 pb-4 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-4">
          Explore Your Vehicle
        </p>
        <h2 className="font-serif text-[1.75rem] leading-tight text-balance text-foreground">
          Discover What Makes
          <br />
          This One Special
        </h2>
      </div>

      {/* Sotheby's-style Media Action Buttons */}
      {showTabs && (
        <div className="flex flex-wrap justify-center gap-2.5 px-6 py-6">
          <button
            onClick={() => {
              setActiveTab("features")
              setIsVideoPlaying(false)
            }}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.08em] transition-all border",
              activeTab === "features"
                ? "bg-foreground text-primary-foreground border-foreground"
                : "bg-transparent text-foreground border-border hover:border-foreground"
            )}
          >
            <Crosshair className="h-3.5 w-3.5" />
            Features
          </button>
          <button
            onClick={() => {
              setActiveTab("walkthrough")
              setSelectedFeature(null)
            }}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-[0.08em] transition-all border",
              activeTab === "walkthrough"
                ? "bg-foreground text-primary-foreground border-foreground"
                : "bg-transparent text-foreground border-border hover:border-foreground"
            )}
          >
            <Video className="h-3.5 w-3.5" />
            Video Walkthrough
          </button>
        </div>
      )}

      {/* Features View */}
      {(activeTab === "features" || (!showTabs && hasFeatures)) && hasFeatures && (
        <div className="relative mx-6 mb-8 overflow-hidden">
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
                  "absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full",
                  "bg-foreground/90 text-primary-foreground",
                  "flex items-center justify-center",
                  "ring-[3px] ring-background/50",
                  "transition-transform hover:scale-110 active:scale-95",
                  "shadow-lg backdrop-blur-sm"
                )}
                style={{ left: `${feature.position.x}%`, top: `${feature.position.y}%` }}
                aria-label={`View ${feature.name} details`}
              >
                <span className="text-xs font-bold">+</span>
              </button>
            ))}
          </div>

          {/* Feature Detail Panel */}
          {selectedFeature && (
            <div className="absolute inset-0 bg-foreground text-primary-foreground flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-primary-foreground/10 transition-colors z-10"
                aria-label="Close feature details"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-6 flex-1 flex flex-col justify-center">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent mb-3">
                  {selectedFeature.category}
                </span>
                <h3 className="font-serif text-2xl mb-4 leading-tight">
                  {selectedFeature.name}
                </h3>
                <p className="text-sm text-primary-foreground/65 leading-relaxed mb-6">
                  {selectedFeature.description}
                </p>
              </div>

              {selectedFeature.closeUpImage && (
                <div className="relative h-40 w-full overflow-hidden">
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
        <div className="relative aspect-video mx-6 mb-8 bg-foreground overflow-hidden">
          {!isVideoPlaying ? (
            <button
              onClick={() => setIsVideoPlaying(true)}
              className="absolute inset-0 flex flex-col items-center justify-center group"
              aria-label="Play vehicle walkthrough video"
            >
              <div className="h-16 w-16 rounded-full bg-primary-foreground/10 border border-primary-foreground/30 flex items-center justify-center mb-4 transition-all group-hover:bg-primary-foreground/20 group-hover:scale-105">
                <Play className="h-6 w-6 text-primary-foreground ml-0.5" fill="currentColor" />
              </div>
              <span className="text-[11px] uppercase tracking-[0.15em] text-primary-foreground/50 font-medium">
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
