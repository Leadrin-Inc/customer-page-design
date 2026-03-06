"use client"

import { useState } from "react"
import { Play, X, Video, Sparkles } from "lucide-react"
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
  const [activeTab, setActiveTab] = useState<"features" | "video">(
    features.length > 0 ? "features" : "video"
  )
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const hasFeatures = features.length > 0 && vehicleImage
  const hasVideo = !!walkaroundVideo

  if (!hasFeatures && !hasVideo) return null

  const showTabs = hasFeatures && hasVideo

  return (
    <section className="bg-background border-b border-border">
      {/* Section Header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-[22px] font-semibold text-foreground">
          Explore this vehicle
        </h2>
      </div>

      {/* Airbnb-style pill buttons */}
      {showTabs && (
        <div className="flex gap-2 px-6 pb-4">
          <button
            onClick={() => {
              setActiveTab("features")
              setIsVideoPlaying(false)
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border",
              activeTab === "features"
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border hover:border-foreground"
            )}
          >
            <Sparkles className="h-4 w-4" />
            Features
          </button>
          <button
            onClick={() => {
              setActiveTab("video")
              setSelectedFeature(null)
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border",
              activeTab === "video"
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border hover:border-foreground"
            )}
          >
            <Video className="h-4 w-4" />
            Video
          </button>
        </div>
      )}

      {/* Features View */}
      {(activeTab === "features" || (!showTabs && hasFeatures)) && hasFeatures && (
        <div className="relative mx-6 mb-6 overflow-hidden rounded-xl">
          <div className="relative aspect-[4/3]">
            <Image
              src={vehicleImage}
              alt={vehicleTitle}
              fill
              className="object-cover"
            />

            {/* Hotspot Markers */}
            {features.map((feature) => (
              <div
                key={feature.id}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${feature.position.x}%`, top: `${feature.position.y}%` }}
              >
                <button
                  onClick={() => setSelectedFeature(selectedFeature?.id === feature.id ? null : feature)}
                  className={cn(
                    "h-7 w-7 rounded-full",
                    "bg-white text-foreground",
                    "flex items-center justify-center",
                    "shadow-lg border border-border",
                    "transition-transform hover:scale-110 active:scale-95",
                    selectedFeature?.id === feature.id && "ring-2 ring-primary"
                  )}
                  aria-label={`View ${feature.name} details`}
                >
                  <span className="text-xs font-bold">{selectedFeature?.id === feature.id ? "×" : "+"}</span>
                </button>

                {/* IKEA-style tooltip card */}
                {selectedFeature?.id === feature.id && (
                  <div 
                    className="absolute z-20 w-48 bg-white rounded-lg shadow-xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    style={{
                      left: feature.position.x > 50 ? "auto" : "100%",
                      right: feature.position.x > 50 ? "100%" : "auto",
                      top: "50%",
                      transform: "translateY(-50%)",
                      marginLeft: feature.position.x > 50 ? 0 : 8,
                      marginRight: feature.position.x > 50 ? 8 : 0,
                    }}
                  >
                    {feature.closeUpImage && (
                      <div className="relative h-24 w-full">
                        <Image
                          src={feature.closeUpImage}
                          alt={feature.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <p className="text-[10px] font-medium text-primary uppercase tracking-wide">
                        {feature.category}
                      </p>
                      <h4 className="text-sm font-semibold text-foreground mt-0.5">
                        {feature.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video View */}
      {(activeTab === "video" || (!showTabs && hasVideo)) && hasVideo && (
        <div className="relative aspect-video mx-6 mb-6 bg-secondary rounded-xl overflow-hidden">
          {!isVideoPlaying ? (
            <button
              onClick={() => setIsVideoPlaying(true)}
              className="absolute inset-0 flex flex-col items-center justify-center group"
              aria-label="Play vehicle walkthrough video"
            >
              <div className="h-16 w-16 rounded-full bg-foreground flex items-center justify-center mb-3 transition-transform group-hover:scale-105">
                <Play className="h-6 w-6 text-background ml-0.5" fill="currentColor" />
              </div>
              <span className="text-sm font-medium text-foreground">
                Play video
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
