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
    <section className="bg-white px-6 py-8 border-t border-border">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
        <h2 className="text-xl font-semibold text-foreground">A message from {firstName}</h2>
      </div>
      
      <p className="text-sm text-muted-foreground mb-5">
        {firstName} recorded this video introduction just for you.
      </p>

      {/* Video Player */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary">
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
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg">
                <Play className="h-6 w-6 text-white ml-1" fill="white" />
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
