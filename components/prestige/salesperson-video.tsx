"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import Image from "next/image"

interface PrestigeSalespersonVideoProps {
  salespersonName: string
  salespersonPhoto: string
  videoUrl: string
}

export function PrestigeSalespersonVideo({
  salespersonName,
  salespersonPhoto,
  videoUrl,
}: PrestigeSalespersonVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const firstName = salespersonName.split(" ")[0]

  return (
    <section className="bg-foreground text-background">
      <div className="px-5 pt-8 pb-4 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-background/50 mb-2">
          Personal Introduction
        </p>
        <h2 className="font-serif text-[26px] leading-tight mb-2">
          A Message from {firstName}
        </h2>
        <p className="text-xs text-background/60 max-w-xs mx-auto">
          A personal video prepared for you.
        </p>
      </div>

      <div className="px-5 pb-10">
        <div className="relative aspect-video">
          {!isPlaying ? (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex flex-col items-center justify-center group"
              aria-label={`Watch ${firstName}'s introduction`}
            >
              <Image
                src={salespersonPhoto}
                alt={`${salespersonName} video thumbnail`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-foreground/50" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-16 w-16 border-2 border-background flex items-center justify-center group-hover:bg-background group-hover:text-foreground transition-colors">
                  <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.2em]">
                  Play Video
                </p>
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
      </div>
    </section>
  )
}
