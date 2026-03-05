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
    <section className="bg-background px-6 py-8 border-b border-border">
      <h2 className="text-lg font-semibold text-foreground mb-2">
        A message from {firstName}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {firstName} recorded a personal video just for you
      </p>

      <div className="relative aspect-video overflow-hidden rounded-xl bg-secondary">
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center group"
            aria-label={`Play video message from ${salespersonName}`}
          >
            <Image
              src={salespersonPhoto}
              alt={`${salespersonName} video thumbnail`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 h-16 w-16 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg">
              <Play className="h-6 w-6 text-foreground ml-1" fill="currentColor" />
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
