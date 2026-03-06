"use client"

import { useState } from "react"
import { Play, X, ChevronRight } from "lucide-react"
import Image from "next/image"

interface Feature {
  id: string
  name: string
  description: string
  category: string
  position: { x: number; y: number }
  closeUpImage?: string
}

interface PrestigeVehicleMediaProps {
  vehicleImage: string
  features: Feature[]
  walkaroundVideo?: string
  vehicleTitle: string
}

export function PrestigeVehicleMedia({
  vehicleImage,
  features,
  walkaroundVideo,
  vehicleTitle,
}: PrestigeVehicleMediaProps) {
  const [activeTab, setActiveTab] = useState<"features" | "video">("features")
  const [activeFeature, setActiveFeature] = useState<Feature | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const hasVideo = !!walkaroundVideo
  const hasFeatures = features.length > 0

  return (
    <section className="bg-foreground text-background">
      {/* Section Header */}
      <div className="px-5 pt-8 pb-4 text-center">
        <h2 className="font-serif text-[26px] leading-tight mb-2">
          Explore Every Detail
        </h2>
        <p className="text-xs text-background/60 max-w-xs mx-auto">
          Discover the craftsmanship that defines this vehicle.
        </p>
      </div>

      {/* Tab Switcher */}
      {hasFeatures && hasVideo && (
        <div className="flex justify-center gap-3 pb-5">
          <button
            onClick={() => setActiveTab("features")}
            className={`px-6 py-2 text-xs uppercase tracking-[0.15em] border transition-colors ${
              activeTab === "features"
                ? "bg-background text-foreground border-background"
                : "border-background/40 text-background/70 hover:border-background hover:text-background"
            }`}
          >
            Features
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`px-6 py-2 text-xs uppercase tracking-[0.15em] border transition-colors ${
              activeTab === "video"
                ? "bg-background text-foreground border-background"
                : "border-background/40 text-background/70 hover:border-background hover:text-background"
            }`}
          >
            Walkthrough
          </button>
        </div>
      )}

      {/* Features View */}
      {activeTab === "features" && (
        <div className="px-5 pb-10">
          {/* Vehicle Image with Hotspots */}
          <div className="relative aspect-[4/3] mb-5 overflow-visible">
            <Image
              src={vehicleImage}
              alt={vehicleTitle}
              fill
              className="object-cover"
            />
            {/* Hotspots with IKEA-style tooltips */}
            {features.map((feature) => {
              // Determine tooltip position based on hotspot location
              const showAbove = feature.position.y > 60
              
              // Calculate horizontal position to prevent overflow
              const getHorizontalPosition = () => {
                if (feature.position.x < 25) {
                  return { left: "0", transform: "none" }
                } else if (feature.position.x > 75) {
                  return { left: "auto", right: "0", transform: "none" }
                }
                return { left: "50%", transform: "translateX(-50%)" }
              }
              const horizPos = getHorizontalPosition()
              
              return (
                <div
                  key={feature.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${feature.position.x}%`,
                    top: `${feature.position.y}%`,
                  }}
                >
                  <button
                    onClick={() => setActiveFeature(activeFeature?.id === feature.id ? null : feature)}
                    className={`flex h-6 w-6 items-center justify-center bg-background text-foreground text-xs font-semibold shadow-lg hover:scale-110 transition-transform ${
                      activeFeature?.id === feature.id ? "ring-1 ring-background/50" : ""
                    }`}
                    aria-label={`View ${feature.name}`}
                  >
                    {activeFeature?.id === feature.id ? "×" : "+"}
                  </button>

                  {/* Tooltip card */}
                  {activeFeature?.id === feature.id && (
                    <div 
                      className="absolute z-20 w-40 bg-background text-foreground shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                      style={{
                        ...horizPos,
                        top: showAbove ? "auto" : "100%",
                        bottom: showAbove ? "100%" : "auto",
                        marginTop: showAbove ? 0 : 8,
                        marginBottom: showAbove ? 8 : 0,
                      }}
                    >
                      {feature.closeUpImage && (
                        <div className="relative h-20 w-full">
                          <Image
                            src={feature.closeUpImage}
                            alt={feature.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-2.5">
                        <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                          {feature.category}
                        </p>
                        <h4 className="text-xs font-medium mt-0.5">
                          {feature.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Caption */}
          <p className="text-[10px] text-background/50 text-center mt-3">
            Tap hotspots to explore features
          </p>
        </div>
      )}

      {/* Video View */}
      {activeTab === "video" && walkaroundVideo && (
        <div className="px-5 pb-10">
          <div className="relative aspect-video">
            {!isVideoPlaying ? (
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="absolute inset-0 flex flex-col items-center justify-center group"
              >
                <Image
                  src={vehicleImage}
                  alt={`${vehicleTitle} walkthrough`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-foreground/40" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-16 w-16 border-2 border-background flex items-center justify-center group-hover:bg-background group-hover:text-foreground transition-colors">
                    <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.2em]">
                    Watch Walkthrough
                  </p>
                </div>
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
        </div>
      )}
    </section>
  )
}
