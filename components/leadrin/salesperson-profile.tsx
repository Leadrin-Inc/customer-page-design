"use client"

import { useState } from "react"
import { Play, Phone, Award, Clock, Shield } from "lucide-react"
import Image from "next/image"

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

  const firstName = name.split(" ")[0]

  return (
    <section className="bg-background px-6 py-8 border-b border-border">
      {/* Host Header - Airbnb style */}
      <div className="flex items-start gap-4 mb-6">
        <div className="relative h-14 w-14 overflow-hidden rounded-full flex-shrink-0">
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[22px] font-semibold text-foreground">
            Meet {firstName}, your specialist
          </h3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>

      {/* Host Highlights - Airbnb style icons */}
      <div className="space-y-4 mb-6">
        <div className="flex items-start gap-4">
          <Award className="h-6 w-6 text-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Experienced specialist</p>
            <p className="text-sm text-muted-foreground">10+ years helping customers find the right vehicle</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Clock className="h-6 w-6 text-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Fast response time</p>
            <p className="text-sm text-muted-foreground">Usually responds within an hour</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Verified professional</p>
            <p className="text-sm text-muted-foreground">Identity and credentials confirmed</p>
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-[15px] text-foreground leading-relaxed mb-6">
        {bio}
      </p>

      {/* Intro Video - if available */}
      {introVideo && (
        <div className="relative aspect-video overflow-hidden rounded-xl mb-6 bg-secondary">
          {!isVideoPlaying ? (
            <button
              onClick={() => setIsVideoPlaying(true)}
              className="absolute inset-0 flex flex-col items-center justify-center group"
              aria-label={`Watch ${name}'s introduction video`}
            >
              <Image
                src={photo}
                alt={`${name} introduction video`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-foreground/30" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center transition-transform group-hover:scale-105">
                  <Play className="h-5 w-5 text-foreground ml-0.5" fill="currentColor" />
                </div>
              </div>
            </button>
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

      {/* Contact Button - Airbnb style */}
      {phone && (
        <a
          href={`tel:${phone}`}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-lg border border-foreground text-foreground font-semibold text-sm transition-colors hover:bg-secondary"
        >
          <Phone className="h-4 w-4" />
          Contact {firstName}
        </a>
      )}
    </section>
  )
}
