"use client"

import { useState } from "react"
import { Play, Phone } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface SalespersonProfileProps {
  name: string
  title: string
  bio: string
  photo: string
  introVideo?: string
  phone?: string
}

export function SalespersonProfile({
  name,
  title,
  bio,
  photo,
  introVideo,
  phone,
}: SalespersonProfileProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <section className="px-5 py-8 bg-secondary">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
        Your Sales Consultant
      </p>

      {/* Intro Video */}
      {introVideo && (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-foreground">
          {!isVideoPlaying ? (
            <>
              {/* Video Thumbnail with Salesperson Photo */}
              <Image
                src={photo}
                alt={`${name} introduction video`}
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="absolute inset-0 flex flex-col items-center justify-center"
              >
                <div className="h-16 w-16 rounded-full bg-card flex items-center justify-center shadow-xl mb-3">
                  <Play className="h-7 w-7 text-foreground ml-1" fill="currentColor" />
                </div>
                <span className="text-sm font-medium text-primary-foreground">
                  Watch personal introduction
                </span>
              </button>
            </>
          ) : (
            <video
              src={introVideo}
              controls
              autoPlay
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      )}

      {/* Profile Info */}
      <div className="flex items-start gap-4 mb-5">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-border">
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-serif text-xl font-medium text-foreground mb-0.5">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
        </div>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed mb-5">
        {bio}
      </p>

      {/* Call Button */}
      {phone && (
        <Button asChild className="w-full h-12">
          <a href={`tel:${phone}`}>
            <Phone className="h-4 w-4 mr-2" />
            Call {name.split(" ")[0]}
          </a>
        </Button>
      )}
    </section>
  )
}
