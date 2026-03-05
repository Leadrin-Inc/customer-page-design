"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import Image from "next/image"

interface SalespersonVideoProps {
  salespersonName: string
  salespersonPhoto: string
  videoUrl: string
}

export function SalespersonVideo({
  salespersonName,
  salespersonPhoto,
  videoUrl,
}: SalespersonVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const firstName = salespersonName.split(" ")[0]

  return (
    <section className="px-5 py-8 border-t border-slate-100">
      {/* Header */}
      <div className="mb-4">
        <p className="text-[10px] font-semibold tracking-widest text-blue-600 uppercase mb-1">Personal Message</p>
        <h2 className="text-xl font-bold text-slate-900">From {firstName}</h2>
      </div>

      {/* Video */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900">
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex flex-col items-center justify-center group"
          >
            <Image
              src={salespersonPhoto}
              alt={salespersonName}
              fill
              className="object-cover opacity-90"
            />
            <div className="relative z-10">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-2xl">
                <Play className="h-6 w-6 text-slate-900 ml-1" fill="currentColor" />
              </div>
            </div>
          </button>
        ) : (
          <video
            src={videoUrl}
            controls
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
    </section>
  )
}
