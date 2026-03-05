"use client"

import { useState } from "react"
import { Play, X, Video } from "lucide-react"
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

  const hasVideo = !!walkaroundVideo

  return (
    <section className="relative">
      {/* Feature Modal - Full page takeover */}
      {selectedFeature && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-full flex flex-col">
            {/* Close */}
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-[10px] font-semibold tracking-widest text-blue-600 uppercase">
                {selectedFeature.category}
              </span>
              <button
                onClick={() => setSelectedFeature(null)}
                className="p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {/* Image */}
            <div className="relative aspect-square bg-slate-100">
              <Image
                src={selectedFeature.closeUpImage || heroImage}
                alt={selectedFeature.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 px-5 py-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {selectedFeature.name}
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                {selectedFeature.description}
              </p>
            </div>

            {/* Back */}
            <div className="px-5 pb-8">
              <button
                onClick={() => setSelectedFeature(null)}
                className="w-full h-12 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors"
              >
                Back to Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Toggle */}
      {hasVideo && (
        <div className="px-5 mb-4">
          <div className="inline-flex p-1 bg-slate-100 rounded-full">
            <button
              onClick={() => { setActiveTab("features"); setIsVideoPlaying(false); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                activeTab === "features"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5 ${
                activeTab === "video"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              Video
            </button>
          </div>
        </div>
      )}

      {/* Features View */}
      {activeTab === "features" && (
        <div className="px-5">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
            <Image
              src={heroImage}
              alt={vehicleTitle}
              fill
              className="object-cover"
              priority
            />
            
            {/* Hotspots */}
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group"
                style={{ left: `${feature.position.x}%`, top: `${feature.position.y}%` }}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-lg ring-[3px] ring-white/80 group-hover:scale-110 transition-transform">
                  {feature.id}
                </span>
              </button>
            ))}
          </div>
          
          {/* Caption */}
          <p className="mt-3 text-xs text-slate-400 text-center">
            Tap the numbered points to explore key features
          </p>
        </div>
      )}

      {/* Video View */}
      {activeTab === "video" && walkaroundVideo && (
        <div className="px-5">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900">
            {!isVideoPlaying ? (
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="absolute inset-0 flex flex-col items-center justify-center group"
              >
                <Image
                  src={heroImage}
                  alt={`${vehicleTitle} video`}
                  fill
                  className="object-cover opacity-80"
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xl">
                    <Play className="h-6 w-6 text-slate-900 ml-1" fill="currentColor" />
                  </div>
                  <p className="mt-4 text-white text-sm font-medium">Watch the walkthrough</p>
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
