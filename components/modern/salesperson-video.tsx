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
    <section className="bg-white px-6 py-8 border-t border-neutral-100">
      <h2 className="text-lg font-semibold text-neutral-900 mb-1">A message from {firstName}</h2>
      <p className="text-sm text-neutral-500 mb-4">
        A personal video recorded just for you.
      </p>

      {/* Video Player */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-100">
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex flex-col items-center justify-center group"
            aria-label={`Play video from ${salespersonName}`}
          >
            <Image
              src={salespersonPhoto}
              alt={`${salespersonName} video`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-neutral-900/30" />
            <div className="relative z-10">
              <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-xl">
                <Play className="h-5 w-5 text-neutral-900 ml-0.5" fill="currentColor" />
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
