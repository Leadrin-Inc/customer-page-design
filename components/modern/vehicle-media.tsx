"use client"

import { useState } from "react"
import { Play, X, ChevronRight, Sparkles, Video } from "lucide-react"
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
    <section className="bg-white relative">
      {/* Full-page Feature Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 bg-white animate-in fade-in duration-200">
          <div className="h-full flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                {selectedFeature.category}
              </span>
              <button
                onClick={() => setSelectedFeature(null)}
                className="p-2 -mr-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Feature Image */}
            <div className="relative aspect-[4/3] bg-neutral-100">
              <Image
                src={selectedFeature.closeUpImage || heroImage}
                alt={selectedFeature.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Feature Content */}
            <div className="flex-1 px-6 py-6">
              <h3 className="text-2xl font-semibold text-neutral-900 mb-3">
                {selectedFeature.name}
              </h3>
              <p className="text-base text-neutral-600 leading-relaxed">
                {selectedFeature.description}
              </p>
            </div>

            {/* Close Button */}
            <div className="px-6 pb-8">
              <button
                onClick={() => setSelectedFeature(null)}
                className="w-full py-3.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Buttons - Clean, minimal */}
      {showTabs && (
        <div className="px-6 py-3 flex gap-6 border-b border-neutral-100">
          <button
            onClick={() => { setActiveTab("features"); setIsVideoPlaying(false); }}
            className={`flex items-center gap-2 text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors ${
              activeTab === "features"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Features
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-2 text-sm font-medium pb-3 -mb-3 border-b-2 transition-colors ${
              activeTab === "video"
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            <Video className="h-4 w-4" />
            Video
          </button>
        </div>
      )}

      {/* Features View */}
      {activeTab === "features" && (
        <div className="px-6 py-6">
          {/* Hero Image with hotspots only */}
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100">
            <Image
              src={heroImage}
              alt={vehicleTitle}
              fill
              className="object-cover"
              priority
            />
            
            {/* Hotspots on image - tap to open modal */}
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group"
                style={{ left: `${feature.position.x}%`, top: `${feature.position.y}%` }}
                aria-label={`View ${feature.name} details`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold shadow-lg group-hover:scale-110 transition-transform ring-2 ring-white">
                  {feature.id}
                </span>
              </button>
            ))}

            {/* Hint text */}
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-xs text-white/90 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full inline-block">
                Tap hotspots to explore features
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Video View */}
      {activeTab === "video" && walkaroundVideo && (
        <div className="px-6 py-6">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100">
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
                <div className="absolute inset-0 bg-neutral-900/30" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-xl">
                    <Play className="h-5 w-5 text-neutral-900 ml-0.5" fill="currentColor" />
                  </div>
                  <p className="mt-3 text-white text-sm font-medium">Watch walkthrough</p>
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
