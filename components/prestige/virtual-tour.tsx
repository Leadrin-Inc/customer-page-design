"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Play, Pause, Phone, Calendar, RotateCcw } from "lucide-react"
import { gsap } from "gsap"

// Tour segment data model with visual_focus for Ken Burns effect
interface TourSegment {
  id: string
  label: string
  text: string
  photoUrl: string
  visualFocus: { x: number; y: number }
  zoomLevel: number
  accentColor: string
  durationMs: number
}

interface VirtualTourProps {
  buyerName: string
  vehicleTitle: string
  vehicleImage: string
  price: number
  salespersonName: string
  salespersonInitial: string
  dealershipName: string
  onBook: () => void
  onCall?: () => void
}

// Demo tour segments with Ken Burns parameters
const tourSegments: TourSegment[] = [
  {
    id: "intro",
    label: "Welcome",
    text: "Welcome to your personal showroom, Sarah. I'm excited to walk you through this exceptional vehicle — one that perfectly balances everyday practicality with premium comfort. Let's take a closer look.",
    photoUrl: "https://images.unsplash.com/photo-1568844293986-8c8a5a6f8d1f?w=1200&q=80",
    visualFocus: { x: 50, y: 50 },
    zoomLevel: 1.1,
    accentColor: "#c9a227",
    durationMs: 10000,
  },
  {
    id: "powertrain",
    label: "Powertrain",
    text: "Under the hood, a refined powertrain pairs efficiency with responsive performance. You're getting impressive horsepower with excellent fuel economy — and all-wheel drive comes standard on this trim.",
    photoUrl: "https://images.unsplash.com/photo-1568844293986-8c8a5a6f8d1f?w=1200&q=80",
    visualFocus: { x: 30, y: 40 },
    zoomLevel: 1.4,
    accentColor: "#f97316",
    durationMs: 10000,
  },
  {
    id: "interior",
    label: "Interior",
    text: "Step inside and you'll find leather-trimmed heated seats with power adjustment. The cabin is wrapped in premium soft-touch materials with contrast stitching throughout — it feels more like a luxury SUV than a compact crossover.",
    photoUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    visualFocus: { x: 45, y: 40 },
    zoomLevel: 1.25,
    accentColor: "#d4a574",
    durationMs: 11000,
  },
  {
    id: "technology",
    label: "Technology",
    text: "The large touchscreen is the command center. Wireless Apple CarPlay and Android Auto connect instantly — no cables. And the premium audio system turns every drive into a concert.",
    photoUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    visualFocus: { x: 55, y: 35 },
    zoomLevel: 1.35,
    accentColor: "#8b5cf6",
    durationMs: 9000,
  },
  {
    id: "safety",
    label: "Safety",
    text: "Advanced safety features come standard with pre-collision detection, adaptive cruise control, and lane departure alert. For weekend adventures with the family, this is peace of mind built in.",
    photoUrl: "https://images.unsplash.com/photo-1568844293986-8c8a5a6f8d1f?w=1200&q=80",
    visualFocus: { x: 70, y: 45 },
    zoomLevel: 1.3,
    accentColor: "#10b981",
    durationMs: 10000,
  },
  {
    id: "cargo",
    label: "Cargo",
    text: "Pop open the power liftgate and you've got generous cargo space behind the rear seats — or fold them down for even more room. That's camping gear, strollers, and weekend project supplies with room to spare.",
    photoUrl: "https://images.unsplash.com/photo-1568844293986-8c8a5a6f8d1f?w=1200&q=80",
    visualFocus: { x: 60, y: 55 },
    zoomLevel: 1.3,
    accentColor: "#06b6d4",
    durationMs: 10000,
  },
  {
    id: "cta",
    label: "See It",
    text: "Sarah, the best way to experience this vehicle is behind the wheel. I'd love to get you set up with a test drive — book a time that works for you, or give me a call directly. I'm here whenever you're ready.",
    photoUrl: "https://images.unsplash.com/photo-1568844293986-8c8a5a6f8d1f?w=1200&q=80",
    visualFocus: { x: 50, y: 50 },
    zoomLevel: 1.0,
    accentColor: "#c9a227",
    durationMs: 11000,
  },
]

export function PrestigeVirtualTour({
  buyerName,
  vehicleTitle,
  vehicleImage,
  price,
  salespersonName,
  salespersonInitial,
  dealershipName,
  onBook,
  onCall,
}: VirtualTourProps) {
  const [isTourActive, setIsTourActive] = useState(false)
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [progress, setProgress] = useState(0)
  const [showCTA, setShowCTA] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // Refs for GSAP animations
  const image1Ref = useRef<HTMLImageElement>(null)
  const image2Ref = useRef<HTMLImageElement>(null)
  const previewImageRef = useRef<HTMLImageElement>(null)
  const activeImageRef = useRef<1 | 2>(1)
  const gsapTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const breathingTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const previewTimelineRef = useRef<gsap.core.Timeline | null>(null)

  // Other refs
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  const currentSegment = tourSegments[currentSegmentIndex]

  // Preload images
  useEffect(() => {
    const uniqueUrls = [...new Set(tourSegments.map(s => s.photoUrl))]
    let loadedCount = 0

    uniqueUrls.forEach(url => {
      const img = new window.Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        loadedCount++
        if (loadedCount === uniqueUrls.length) {
          setImagesLoaded(true)
        }
      }
      img.onerror = () => {
        loadedCount++
        if (loadedCount === uniqueUrls.length) {
          setImagesLoaded(true)
        }
      }
      img.src = url
    })
  }, [])

  // Auto Ken Burns effect for preview
  useEffect(() => {
    if (!isTourActive && previewImageRef.current && imagesLoaded) {
      // Kill any existing preview animation
      if (previewTimelineRef.current) {
        previewTimelineRef.current.kill()
      }

      // Create slow zoom Ken Burns for preview
      previewTimelineRef.current = gsap.timeline({ repeat: -1, yoyo: true })
      previewTimelineRef.current.fromTo(
        previewImageRef.current,
        {
          scale: 1,
          x: "0%",
          y: "0%",
        },
        {
          scale: 1.15,
          x: "-5%",
          y: "-3%",
          duration: 20,
          ease: "sine.inOut",
        }
      )
    }

    return () => {
      if (previewTimelineRef.current) {
        previewTimelineRef.current.kill()
      }
    }
  }, [isTourActive, imagesLoaded])

  // Cleanup function
  const cleanup = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current)
      typewriterIntervalRef.current = null
    }
    if (gsapTimelineRef.current) {
      gsapTimelineRef.current.kill()
      gsapTimelineRef.current = null
    }
    if (breathingTimelineRef.current) {
      breathingTimelineRef.current.kill()
      breathingTimelineRef.current = null
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  // Speech synthesis
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.rate = 0.95
    utterance.pitch = 1.0

    // Try to find a female English voice
    const voices = window.speechSynthesis.getVoices()
    const femaleVoice = voices.find(
      v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female")
    )
    if (femaleVoice) {
      utterance.voice = femaleVoice
    }

    speechRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  // Pause speech
  const pauseSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.pause()
    }
  }, [])

  // Resume speech
  const resumeSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.resume()
    }
  }, [])

  // Typewriter effect
  const startTypewriter = useCallback((text: string, durationMs: number) => {
    setDisplayedText("")
    const charDelay = (durationMs * 0.85) / text.length
    let charIndex = 0

    typewriterIntervalRef.current = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1))
        charIndex++
      } else {
        if (typewriterIntervalRef.current) {
          clearInterval(typewriterIntervalRef.current)
        }
      }
    }, charDelay)
  }, [])

  // GSAP Ken Burns animation
  const animateKenBurns = useCallback((segment: TourSegment, isTransition: boolean = false) => {
    if (!image1Ref.current || !image2Ref.current) return

    const incomingImg = activeImageRef.current === 1 ? image1Ref.current : image2Ref.current
    const outgoingImg = activeImageRef.current === 1 ? image2Ref.current : image1Ref.current

    // Kill existing timelines
    if (gsapTimelineRef.current) gsapTimelineRef.current.kill()
    if (breathingTimelineRef.current) breathingTimelineRef.current.kill()

    // Calculate transform origin based on visual focus
    const focusX = segment.visualFocus.x
    const focusY = segment.visualFocus.y

    // Calculate translate to center the focus point
    const translateX = (50 - focusX) * 0.5
    const translateY = (50 - focusY) * 0.5

    // Set incoming image source
    incomingImg.src = segment.photoUrl

    // Create main timeline
    gsapTimelineRef.current = gsap.timeline()

    if (isTransition) {
      // Cross-fade transition
      gsapTimelineRef.current
        .set(incomingImg, { opacity: 0, scale: segment.zoomLevel * 0.95, x: `${translateX}%`, y: `${translateY}%` })
        .to(outgoingImg, { opacity: 0, duration: 0.6, ease: "power2.inOut" }, 0)
        .to(incomingImg, { opacity: 1, duration: 0.6, ease: "power2.inOut" }, 0)
    }

    // Ken Burns zoom during segment
    gsapTimelineRef.current.to(
      incomingImg,
      {
        scale: segment.zoomLevel,
        x: `${translateX}%`,
        y: `${translateY}%`,
        duration: segment.durationMs / 1000,
        ease: "sine.inOut",
      },
      isTransition ? 0.3 : 0
    )

    // Toggle active image
    activeImageRef.current = activeImageRef.current === 1 ? 2 : 1
  }, [])

  // Breathing drift animation when paused
  const startBreathingAnimation = useCallback(() => {
    if (!image1Ref.current || !image2Ref.current) return

    const currentImg = activeImageRef.current === 2 ? image1Ref.current : image2Ref.current

    breathingTimelineRef.current = gsap.timeline({ repeat: -1, yoyo: true })
    breathingTimelineRef.current.to(currentImg, {
      x: "+=0.5%",
      duration: 4,
      ease: "sine.inOut",
    })
  }, [])

  // Progress tracking
  const startProgress = useCallback((durationMs: number) => {
    setProgress(0)
    const intervalMs = 50
    const increment = (100 / durationMs) * intervalMs

    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
          }
          return 100
        }
        return prev + increment
      })
    }, intervalMs)
  }, [])

  // Start segment
  const startSegment = useCallback((isTransition: boolean = true) => {
    cleanup()
    setProgress(0)
    setDisplayedText("")

    if (isPlaying) {
      speak(currentSegment.text)
      startTypewriter(currentSegment.text, currentSegment.durationMs)
      startProgress(currentSegment.durationMs)
      animateKenBurns(currentSegment, isTransition)
    }
  }, [cleanup, isPlaying, currentSegment, speak, startTypewriter, startProgress, animateKenBurns])

  // Auto-advance when segment completes
  useEffect(() => {
    if (progress >= 100 && isPlaying) {
      if (currentSegmentIndex === tourSegments.length - 1) {
        setShowCTA(true)
        setIsPlaying(false)
      } else {
        setCurrentSegmentIndex(prev => prev + 1)
      }
    }
  }, [progress, isPlaying, currentSegmentIndex])

  // Start segment when index changes or playing state changes
  useEffect(() => {
    if (isTourActive) {
      startSegment(currentSegmentIndex > 0)
    }
    return cleanup
  }, [currentSegmentIndex, isPlaying, isTourActive])

  // Handle pause/resume
  useEffect(() => {
    if (isTourActive && !isPlaying && !showCTA) {
      pauseSpeech()
      if (gsapTimelineRef.current) gsapTimelineRef.current.pause()
      startBreathingAnimation()
    } else if (isTourActive && isPlaying) {
      resumeSpeech()
      if (gsapTimelineRef.current) gsapTimelineRef.current.resume()
      if (breathingTimelineRef.current) breathingTimelineRef.current.kill()
    }
  }, [isPlaying, isTourActive, showCTA, pauseSpeech, resumeSpeech, startBreathingAnimation])

  const handleStartTour = () => {
    setIsTourActive(true)
    setCurrentSegmentIndex(0)
    setIsPlaying(true)
    setShowCTA(false)
  }

  const handleExitTour = () => {
    cleanup()
    setIsTourActive(false)
    setIsPlaying(false)
    setCurrentSegmentIndex(0)
    setShowCTA(false)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      cleanup()
      pauseSpeech()
    }
    setIsPlaying(!isPlaying)
  }

  const handlePrevious = () => {
    if (currentSegmentIndex > 0) {
      cleanup()
      setCurrentSegmentIndex(prev => prev - 1)
      setShowCTA(false)
    }
  }

  const handleNext = () => {
    if (currentSegmentIndex < tourSegments.length - 1) {
      cleanup()
      setCurrentSegmentIndex(prev => prev + 1)
      setShowCTA(false)
    } else {
      setShowCTA(true)
      setIsPlaying(false)
    }
  }

  const handleReplay = () => {
    setShowCTA(false)
    setCurrentSegmentIndex(0)
    setIsPlaying(true)
  }

  const handleSegmentClick = (index: number) => {
    cleanup()
    setCurrentSegmentIndex(index)
    setShowCTA(false)
    setIsPlaying(true)
  }

  // Pre-tour landing view - full width immersive
  if (!isTourActive) {
    return (
      <section className="relative w-full overflow-hidden bg-[#0a0a0f]">
        {/* Background image with Ken Burns */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            ref={previewImageRef}
            src={vehicleImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-transparent to-[#0a0a0f]" />
        </div>

        <div className="relative min-h-[90vh] flex flex-col items-center justify-between py-10 px-6">
          {/* Top - Personalization */}
          <div className="text-center z-10">
            <p className="text-xs tracking-[0.25em] text-[#c9a227] uppercase">
              {buyerName}, your personal showroom is ready
            </p>
          </div>

          {/* Center spacer */}
          <div className="flex-1" />

          {/* Vehicle Info & CTA */}
          <div className="flex flex-col items-center text-center z-10">
            <h2 className="font-bold text-3xl text-white mb-1 tracking-tight">{vehicleTitle}</h2>
            <p className="text-white/60 text-lg mb-8">
              ${price.toLocaleString()}
            </p>

            {/* Start Button with pulse */}
            <button
              onClick={handleStartTour}
              className="group relative flex items-center gap-3 px-8 py-4 bg-[#c9a227] text-[#0a0a0f] font-semibold transition-all hover:bg-[#d4af37] animate-pulse-subtle"
            >
              <span className="absolute inset-0 bg-[#c9a227] blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
              <Play className="relative h-5 w-5" fill="currentColor" />
              <span className="relative">Start Virtual Tour</span>
            </button>

            {/* Tour metadata */}
            <p className="mt-4 text-xs text-white/40">
              AI-narrated · 7 features · ~90 seconds
            </p>
          </div>

          {/* Bottom - Salesperson card */}
          <div className="flex items-center gap-3 bg-[#141420] px-4 py-3 mt-8 z-10">
            <div className="h-10 w-10 rounded-full bg-[#c9a227] flex items-center justify-center text-[#0a0a0f] font-semibold text-sm">
              {salespersonInitial}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{salespersonName}</p>
              <p className="text-white/50 text-xs">{dealershipName}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Active tour view
  return (
    <section className="fixed inset-0 z-50 bg-[#0a0a0f] flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 z-20">
        <button
          onClick={handleExitTour}
          className="p-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <p className="text-white text-sm font-medium tracking-tight">{vehicleTitle}</p>

        {/* Segment label badge */}
        <div
          className="px-3 py-1 text-xs uppercase tracking-widest rounded-full animate-in slide-in-from-right-2 duration-300"
          style={{
            backgroundColor: `${currentSegment.accentColor}20`,
            color: currentSegment.accentColor,
          }}
          key={currentSegment.id}
        >
          {currentSegment.label}
        </div>
      </div>

      {/* Segment Navigation Dots */}
      <div className="flex items-center justify-center gap-2 py-2 z-20">
        {tourSegments.map((segment, index) => (
          <button
            key={segment.id}
            onClick={() => handleSegmentClick(index)}
            className="transition-all duration-300"
            style={{
              width: index === currentSegmentIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor:
                index === currentSegmentIndex
                  ? segment.accentColor
                  : "rgba(255,255,255,0.2)",
            }}
          />
        ))}
      </div>

      {/* Main Visual Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Two overlapping images for cross-fade */}
        <img
          ref={image1Ref}
          src={tourSegments[0].photoUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transformOrigin: "center center" }}
        />
        <img
          ref={image2Ref}
          src={tourSegments[0].photoUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          style={{ transformOrigin: "center center" }}
        />

        {/* Pulsing accent dot at visual focus */}
        {isPlaying && (
          <div
            className="absolute w-3 h-3 rounded-full animate-pulse-dot z-10"
            style={{
              left: `${currentSegment.visualFocus.x}%`,
              top: `${currentSegment.visualFocus.y}%`,
              backgroundColor: currentSegment.accentColor,
              boxShadow: `0 0 20px ${currentSegment.accentColor}`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {/* Gradient overlay for caption readability */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent pointer-events-none" />
      </div>

      {/* CTA Overlay */}
      {showCTA && (
        <div className="absolute inset-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-sm flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
          <div className="text-center">
            <p className="text-xs tracking-[0.25em] text-[#c9a227] uppercase mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
              Tour Complete
            </p>
            <h2 className="font-bold text-3xl text-white mb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
              Ready to see it in person?
            </h2>
            <p className="text-white/60 text-sm mb-8 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
              {salespersonName} is ready to show you this {vehicleTitle}
            </p>

            <div className="space-y-3 w-full max-w-xs">
              <button
                onClick={onBook}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#c9a227] text-[#0a0a0f] font-semibold transition-colors hover:bg-[#d4af37] animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200"
              >
                <Calendar className="h-4 w-4" />
                Book Appointment
              </button>

              {onCall && (
                <button
                  onClick={onCall}
                  className="w-full flex items-center justify-center gap-2 py-4 border border-white/20 text-white transition-colors hover:bg-white/5 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300"
                >
                  <Phone className="h-4 w-4" />
                  Call {salespersonName.split(" ")[0]}
                </button>
              )}

              <button
                onClick={handleReplay}
                className="w-full flex items-center justify-center gap-2 py-3 text-white/50 text-sm hover:text-white transition-colors animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400"
              >
                <RotateCcw className="h-4 w-4" />
                Replay Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-6 py-3 z-20">
        <button
          onClick={handlePrevious}
          disabled={currentSegmentIndex === 0}
          className="p-3 text-white/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-w-[48px] min-h-[48px] flex items-center justify-center"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={handlePlayPause}
          className="h-14 w-14 rounded-full flex items-center justify-center transition-all hover:scale-105 min-w-[56px] min-h-[56px]"
          style={{ backgroundColor: currentSegment.accentColor }}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-[#0a0a0f]" fill="currentColor" />
          ) : (
            <Play className="h-6 w-6 text-[#0a0a0f] ml-1" fill="currentColor" />
          )}
        </button>

        <button
          onClick={handleNext}
          className="p-3 text-white/60 hover:text-white transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Caption Area */}
      <div className="px-6 py-4 bg-[#0a0a0f]/80 backdrop-blur-sm z-20 min-h-[100px]">
        <p className="text-white/90 text-base leading-relaxed md:text-lg">
          {displayedText}
          {displayedText.length < currentSegment.text.length && isPlaying && (
            <span className="inline-block w-0.5 h-4 bg-white/80 ml-0.5 animate-blink" />
          )}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/10 z-20">
        <div
          className="h-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            backgroundColor: currentSegment.accentColor,
          }}
        />
      </div>
    </section>
  )
}
