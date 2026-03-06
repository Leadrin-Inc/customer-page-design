"use client"

import { useState } from "react"
import { Play, Video, ChevronRight } from "lucide-react"
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
              onClick={() => { setActiveTab("video"); setSelectedFeature(null); }}
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
          <div className="relative aspect-[4/3]">
            {/* Image container with overflow hidden for rounded corners */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-100">
              <Image
                src={heroImage}
                alt={vehicleTitle}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Hotspots - can overflow outside image bounds */}
            {features.map((feature) => {
              const getHorizontalPosition = () => {
                if (feature.position.x < 25) {
                  return { left: "0", transform: "none" }
                } else if (feature.position.x > 75) {
                  return { left: "auto", right: "0", transform: "none" }
                }
                return { left: "50%", transform: "translateX(-50%)" }
              }
              const horizPos = getHorizontalPosition()
              const showAbove = feature.position.y > 50
              
              return (
                <div
                  key={feature.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                  style={{ left: `${feature.position.x}%`, top: `${feature.position.y}%` }}
                >
                  <button
                    onClick={() => setSelectedFeature(selectedFeature?.id === feature.id ? null : feature)}
                    className={`flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-[11px] font-bold shadow-lg ring-[3px] ring-white/80 hover:scale-110 transition-transform ${
                      selectedFeature?.id === feature.id ? "bg-blue-700" : ""
                    }`}
                  >
                    {selectedFeature?.id === feature.id ? "×" : feature.id}
                  </button>

                  {/* IKEA-style tooltip */}
                  {selectedFeature?.id === feature.id && (
                    <div 
                      className="absolute z-50 w-40 bg-white rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
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
                        <p className="text-[9px] font-semibold text-blue-600 uppercase tracking-wide">
                          {feature.category}
                        </p>
                        <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                          {feature.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
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
