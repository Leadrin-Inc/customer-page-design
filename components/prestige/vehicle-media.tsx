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
      <div className="px-6 pt-16 pb-8 text-center">
        <h2 className="font-serif text-[32px] leading-tight mb-3">
          Explore Every Detail
        </h2>
        <p className="text-sm text-background/60 max-w-xs mx-auto">
          Discover the craftsmanship and innovation that define this vehicle.
        </p>
      </div>

      {/* Tab Switcher */}
      {hasFeatures && hasVideo && (
        <div className="flex justify-center gap-4 pb-8">
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
        <div className="px-6 pb-16">
          {/* Vehicle Image with Hotspots */}
          <div className="relative aspect-[4/3] mb-8">
            <Image
              src={vehicleImage}
              alt={vehicleTitle}
              fill
              className="object-cover"
            />
            {/* Hotspots */}
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature)}
                style={{
                  left: `${feature.position.x}%`,
                  top: `${feature.position.y}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                aria-label={`View ${feature.name}`}
              >
                <span className="flex h-6 w-6 items-center justify-center bg-background text-foreground text-xs font-semibold shadow-lg group-hover:scale-110 transition-transform">
                  +
                </span>
              </button>
            ))}
          </div>

          {/* Feature List */}
          <div className="space-y-0">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature)}
                className="w-full flex items-center justify-between py-4 border-b border-background/20 text-left group"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-background/50 mb-1">
                    {feature.category}
                  </p>
                  <p className="text-base font-medium">{feature.name}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-background/40 group-hover:text-background transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Video View */}
      {activeTab === "video" && walkaroundVideo && (
        <div className="px-6 pb-16">
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

      {/* Feature Detail Modal */}
      {activeFeature && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-background text-foreground animate-in slide-in-from-bottom-4">
            {activeFeature.closeUpImage && (
              <div className="relative aspect-video">
                <Image
                  src={activeFeature.closeUpImage}
                  alt={activeFeature.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                {activeFeature.category}
              </p>
              <h3 className="font-serif text-2xl mb-3">{activeFeature.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {activeFeature.description}
              </p>
              <button
                onClick={() => setActiveFeature(null)}
                className="w-full py-3 border border-foreground text-foreground text-xs uppercase tracking-[0.15em] hover:bg-foreground hover:text-background transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
