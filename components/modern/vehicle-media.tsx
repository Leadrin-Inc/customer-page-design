"use client"

import { useState } from "react"
import { Play, Sparkles, Video } from "lucide-react"
import Image from "next/image"

interface Feature {
  id: string
  name: string
  description: string
  category: string
  position: { x: number; y: number }
  closeUpImage?: string
}

interface VehicleMediaProps {
  vehicleTitle: string
  heroImage: string
  features: Feature[]
  walkaroundVideo?: string
}

export function VehicleMedia({
  vehicleTitle,
  heroImage,
  features,
  walkaroundVideo,
}: VehicleMediaProps) {
  const [activeTab, setActiveTab] = useState<"features" | "video">("features")
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const hasFeatures = features.length > 0
  const hasVideo = !!walkaroundVideo
  const showTabs = hasFeatures && hasVideo

  return (
    <section className="bg-white">
      {/* Tab Buttons - Stripe style pill buttons */}
      {showTabs && (
        <div className="px-6 py-4 flex gap-2">
          <button
            onClick={() => { setActiveTab("features"); setIsVideoPlaying(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "features"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                : "bg-secondary text-foreground hover:bg-violet-50"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Features
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "video"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                : "bg-secondary text-foreground hover:bg-violet-50"
            }`}
          >
            <Video className="h-4 w-4" />
            Video Tour
          </button>
        </div>
      )}

      {/* Features View */}
      {activeTab === "features" && (
        <div className="px-6 pb-6">
          {/* Hero Image with Hotspots */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary mb-6">
            <Image
              src={heroImage}
              alt={vehicleTitle}
              fill
              className="object-cover"
              priority
            />
            
            {/* Feature Hotspots */}
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(selectedFeature?.id === feature.id ? null : feature)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                  selectedFeature?.id === feature.id ? "scale-125 z-20" : "z-10"
                }`}
                style={{ left: `${feature.position.x}%`, top: `${feature.position.y}%` }}
                aria-label={`View ${feature.name} details`}
              >
                <span className="relative flex h-6 w-6">
                  <span className={`absolute inset-0 rounded-full ${
                    selectedFeature?.id === feature.id 
                      ? "bg-violet-500" 
                      : "bg-white animate-ping opacity-75"
                  }`} />
                  <span className={`relative flex h-6 w-6 rounded-full items-center justify-center text-[10px] font-bold ${
                    selectedFeature?.id === feature.id
                      ? "bg-violet-500 text-white"
                      : "bg-white text-violet-600 border-2 border-violet-500"
                  }`}>
                    {feature.id}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Selected Feature Detail - Stripe style card */}
          {selectedFeature && (
            <div className="rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start gap-4">
                <div className="w-1 h-12 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500 flex-shrink-0" />
                <div className="flex-1">
                  <span className="text-xs font-medium text-violet-600 uppercase tracking-wide">
                    {selectedFeature.category}
                  </span>
                  <h4 className="text-lg font-semibold text-foreground mt-1 mb-2">
                    {selectedFeature.name}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedFeature.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Feature Chips - Compact horizontal scroll */}
          {!selectedFeature && (
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setSelectedFeature(feature)}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full border border-border hover:border-violet-300 hover:bg-violet-50 transition-all text-left"
                >
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {feature.id}
                  </span>
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">{feature.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Video View */}
      {activeTab === "video" && walkaroundVideo && (
        <div className="px-6 pb-6">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-secondary">
            {!isVideoPlaying ? (
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="absolute inset-0 flex flex-col items-center justify-center group"
              >
                <Image
                  src={heroImage}
                  alt={`${vehicleTitle} video`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-foreground/20" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg">
                    <Play className="h-6 w-6 text-white ml-1" fill="white" />
                  </div>
                  <p className="mt-3 text-white text-sm font-medium">Watch Video Tour</p>
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
