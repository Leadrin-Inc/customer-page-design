"use client"

import { useState } from "react"
import { Play, Phone } from "lucide-react"
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

  return (
    <section className="bg-background px-6 py-16">
      <div className="text-center">
        {/* Thin rule accent */}
        <div className="w-10 h-px bg-border mx-auto mb-10" />

        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-8">
          Your Sales Consultant
        </p>

        {/* Intro Video */}
        {introVideo && (
          <div className="relative aspect-video overflow-hidden mb-10 bg-foreground">
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
                  className="object-cover opacity-50"
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-16 w-16 rounded-full bg-primary-foreground/10 border border-primary-foreground/30 flex items-center justify-center mb-3 transition-all group-hover:bg-primary-foreground/20 group-hover:scale-105">
                    <Play className="h-6 w-6 text-primary-foreground ml-0.5" fill="currentColor" />
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.15em] text-primary-foreground/50 font-medium">
                    Watch Introduction
                  </span>
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

        {/* Profile Photo */}
        <div className="relative h-24 w-24 mx-auto overflow-hidden rounded-full mb-6 ring-2 ring-border">
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        {/* Name and Title */}
        <h3 className="font-serif text-2xl mb-1.5 text-foreground">
          {name}
        </h3>
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-7">{title}</p>

        {/* Bio */}
        <p className="text-[15px] text-muted-foreground leading-loose max-w-[300px] mx-auto mb-9">
          {bio}
        </p>

        {/* Call Button */}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-foreground text-primary-foreground text-xs font-semibold uppercase tracking-[0.1em] hover:opacity-90 transition-opacity"
          >
            <Phone className="h-4 w-4" />
            Call {name.split(" ")[0]}
          </a>
        )}
      </div>
    </section>
  )
}
