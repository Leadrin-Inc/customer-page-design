"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Play, Pause, Phone, Calendar, RotateCcw, Volume2, VolumeX } from "lucide-react"
import gsap from "gsap"
import { cn } from "@/lib/utils"

// Tour segment data model with photo_url and Ken Burns parameters
export interface TourSegment {
  id: string
  label: string
  icon: string
  narrationEN: string
  narrationES: string
  photo_url: string
  zoom_level: number
  visual_focus: { x: number; y: number }
  accentColor: string
  durationMs: number
}

// Theme configuration for different page styles
export interface TourTheme {
  id: "classic" | "modern" | "prestige"
  // Colors
  bgPrimary: string
  bgSecondary: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  accentColor: string
  accentForeground: string
  // Borders & effects
  borderColor: string
  borderRadius: string
  buttonRadius: string
  // Typography
  fontHeading: string
  fontBody: string
  // UI style flags
  useDarkOverlay: boolean
  useGlowEffects: boolean
  useGradients: boolean
}

// Pre-defined themes
export const tourThemes: Record<string, TourTheme> = {
  classic: {
    id: "classic",
    bgPrimary: "bg-white",
    bgSecondary: "bg-slate-50",
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-700",
    textMuted: "text-slate-400",
    accentColor: "#dc2626", // Toyota red
    accentForeground: "text-white",
    borderColor: "border-slate-200",
    borderRadius: "rounded-xl",
    buttonRadius: "rounded-full",
    fontHeading: "font-sans",
    fontBody: "font-sans",
    useDarkOverlay: false,
    useGlowEffects: false,
    useGradients: false,
  },
  modern: {
    id: "modern",
    bgPrimary: "bg-slate-900",
    bgSecondary: "bg-slate-800",
    textPrimary: "text-white",
    textSecondary: "text-slate-200",
    textMuted: "text-slate-400",
    accentColor: "#3b82f6", // Blue
    accentForeground: "text-white",
    borderColor: "border-slate-700",
    borderRadius: "rounded-2xl",
    buttonRadius: "rounded-full",
    fontHeading: "font-sans",
    fontBody: "font-sans",
    useDarkOverlay: true,
    useGlowEffects: true,
    useGradients: true,
  },
  prestige: {
    id: "prestige",
    bgPrimary: "bg-[#0d1117]",
    bgSecondary: "bg-[#161b22]",
    textPrimary: "text-white",
    textSecondary: "text-white/80",
    textMuted: "text-white/40",
    accentColor: "#c9a227", // Gold
    accentForeground: "text-[#0d1117]",
    borderColor: "border-white/10",
    borderRadius: "rounded-none",
    buttonRadius: "rounded-none",
    fontHeading: "font-serif",
    fontBody: "font-serif",
    useDarkOverlay: true,
    useGlowEffects: true,
    useGradients: true,
  },
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
  theme?: TourTheme
  segments?: TourSegment[]
}

// Demo photos
const DEMO_PHOTOS = {
  exterior_hero: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
  engine: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&q=80",
  dashboard: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
  front_seats: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200&q=80",
  cargo: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&q=80",
  side_profile: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
}

// Default tour segments
const createDefaultSegments = (accentColor: string): TourSegment[] => [
  {
    id: "welcome",
    label: "Welcome",
    icon: "hand-wave",
    narrationEN: "Welcome! I'm excited to personally guide you through this exceptional vehicle. Let me show you why this could be the perfect match for you.",
    narrationES: "¡Bienvenido! Estoy emocionado de guiarte personalmente a través de este excepcional vehículo. Déjame mostrarte por qué este podría ser el auto perfecto para ti.",
    photo_url: DEMO_PHOTOS.exterior_hero,
    zoom_level: 1.15,
    visual_focus: { x: 50, y: 50 },
    accentColor,
    durationMs: 8000,
  },
  {
    id: "powertrain",
    label: "Powertrain",
    icon: "engine",
    narrationEN: "Under the hood, you'll find a refined powertrain that delivers both performance and efficiency. The smooth power delivery makes every drive a pleasure.",
    narrationES: "Bajo el capó, encontrarás un tren motriz refinado que ofrece rendimiento y eficiencia. La entrega de potencia suave hace que cada viaje sea un placer.",
    photo_url: DEMO_PHOTOS.engine,
    zoom_level: 1.25,
    visual_focus: { x: 50, y: 40 },
    accentColor: "#dc2626",
    durationMs: 7000,
  },
  {
    id: "technology",
    label: "Technology",
    icon: "cpu",
    narrationEN: "Advanced technology keeps you connected and in control. The intuitive interface and premium audio system make every journey more enjoyable.",
    narrationES: "La tecnología avanzada te mantiene conectado y en control. La interfaz intuitiva y el sistema de audio premium hacen que cada viaje sea más agradable.",
    photo_url: DEMO_PHOTOS.dashboard,
    zoom_level: 1.2,
    visual_focus: { x: 55, y: 45 },
    accentColor: "#0ea5e9",
    durationMs: 7000,
  },
  {
    id: "interior",
    label: "Interior",
    icon: "armchair",
    narrationEN: "Step inside and experience true comfort. Premium materials and thoughtful design create an environment you'll love spending time in.",
    narrationES: "Entra y experimenta el verdadero confort. Materiales premium y diseño pensado crean un ambiente en el que te encantará pasar tiempo.",
    photo_url: DEMO_PHOTOS.front_seats,
    zoom_level: 1.18,
    visual_focus: { x: 50, y: 55 },
    accentColor: "#7c3aed",
    durationMs: 7000,
  },
  {
    id: "cargo",
    label: "Versatility",
    icon: "package",
    narrationEN: "Generous cargo space and flexible configurations adapt to your lifestyle. Whether it's a weekend getaway or daily errands, you'll have room for it all.",
    narrationES: "Amplio espacio de carga y configuraciones flexibles se adaptan a tu estilo de vida. Ya sea una escapada de fin de semana o recados diarios, tendrás espacio para todo.",
    photo_url: DEMO_PHOTOS.cargo,
    zoom_level: 1.22,
    visual_focus: { x: 50, y: 50 },
    accentColor: "#f59e0b",
    durationMs: 7000,
  },
  {
    id: "safety",
    label: "Safety",
    icon: "shield",
    narrationEN: "Your safety is paramount. This vehicle comes equipped with a comprehensive suite of advanced safety features to protect you and your loved ones.",
    narrationES: "Tu seguridad es primordial. Este vehículo viene equipado con un conjunto completo de funciones de seguridad avanzadas para protegerte a ti y a tus seres queridos.",
    photo_url: DEMO_PHOTOS.side_profile,
    zoom_level: 1.15,
    visual_focus: { x: 45, y: 50 },
    accentColor: "#22c55e",
    durationMs: 7000,
  },
  {
    id: "cta",
    label: "Next Steps",
    icon: "calendar",
    narrationEN: "I hope you've enjoyed this tour. I'd love to show you this vehicle in person. Let's schedule a time that works for you.",
    narrationES: "Espero que hayas disfrutado este recorrido. Me encantaría mostrarte este vehículo en persona. Programemos un horario que te funcione.",
    photo_url: DEMO_PHOTOS.exterior_hero,
    zoom_level: 1.1,
    visual_focus: { x: 50, y: 50 },
    accentColor,
    durationMs: 6000,
  },
]

export function VirtualTour({
  buyerName,
  vehicleTitle,
  vehicleImage,
  price,
  salespersonName,
  salespersonInitial,
  dealershipName,
  onBook,
  onCall,
  theme = tourThemes.classic,
  segments,
}: VirtualTourProps) {
  const tourSegments = segments || createDefaultSegments(theme.accentColor)
  
  const [isTourActive, setIsTourActive] = useState(false)
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [language, setLanguage] = useState<"en" | "es">("en")
  const [displayedText, setDisplayedText] = useState("")
  const [progress, setProgress] = useState(0)
  const [showCTA, setShowCTA] = useState(false)
  const [captionExpanded, setCaptionExpanded] = useState(false)
  const [heroKenBurnsActive, setHeroKenBurnsActive] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  
  const photoContainerRef = useRef<HTMLDivElement>(null)
  const currentPhotoRef = useRef<HTMLImageElement>(null)
  const previousPhotoRef = useRef<HTMLImageElement>(null)
  const focusDotRef = useRef<HTMLDivElement>(null)
  const heroPhotoRef = useRef<HTMLImageElement>(null)
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const kenBurnsTimelineRef = useRef<gsap.core.Timeline | null>(null)
  const heroKenBurnsRef = useRef<gsap.core.Timeline | null>(null)

  const currentSegment = tourSegments[currentSegmentIndex]
  const narrationText = language === "en" ? currentSegment.narrationEN : currentSegment.narrationES

  const cleanup = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    if (typewriterIntervalRef.current) {
      clearInterval(typewriterIntervalRef.current)
      typewriterIntervalRef.current = null
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    if (kenBurnsTimelineRef.current) {
      kenBurnsTimelineRef.current.kill()
      kenBurnsTimelineRef.current = null
    }
  }, [])

  // Hero Ken Burns effect
  useEffect(() => {
    if (!isTourActive && heroPhotoRef.current && heroKenBurnsActive) {
      if (heroKenBurnsRef.current) {
        heroKenBurnsRef.current.kill()
      }

      heroKenBurnsRef.current = gsap.timeline({ repeat: -1, yoyo: true })
      heroKenBurnsRef.current.fromTo(
        heroPhotoRef.current,
        { scale: 1, x: "0%", y: "0%" },
        { scale: 1.08, x: "-2%", y: "-1%", duration: 12, ease: "sine.inOut" }
      )
    }

    return () => {
      if (heroKenBurnsRef.current) {
        heroKenBurnsRef.current.kill()
        heroKenBurnsRef.current = null
      }
    }
  }, [isTourActive, heroKenBurnsActive])

  // Ken Burns animation for active tour
  const startKenBurnsAnimation = useCallback((segment: TourSegment, duration: number, isFirstSegment: boolean = false) => {
    console.log("[v0] startKenBurnsAnimation called", { segment: segment.id, duration, isFirstSegment })
    console.log("[v0] currentPhotoRef:", currentPhotoRef.current)
    console.log("[v0] previousPhotoRef:", previousPhotoRef.current)
    
    if (!currentPhotoRef.current) {
      console.log("[v0] No currentPhotoRef, skipping animation")
      return
    }

    if (kenBurnsTimelineRef.current) {
      kenBurnsTimelineRef.current.kill()
    }

    const current = currentPhotoRef.current
    const previous = previousPhotoRef.current
    const translateX = (50 - segment.visual_focus.x) * 0.5
    const translateY = (50 - segment.visual_focus.y) * 0.5

    console.log("[v0] Creating GSAP timeline for Ken Burns", { translateX, translateY, zoom: segment.zoom_level })

    kenBurnsTimelineRef.current = gsap.timeline()

    // Only do crossfade if we have a previous photo and it's not the first segment
    if (previous && !isFirstSegment) {
      kenBurnsTimelineRef.current.fromTo(
        previous,
        { opacity: 1 },
        { opacity: 0, duration: 0.6, ease: "power2.inOut" },
        0
      )
      kenBurnsTimelineRef.current.fromTo(
        current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.inOut" },
        0
      )
    } else {
      // First segment - just ensure it's visible
      gsap.set(current, { opacity: 1 })
    }

    kenBurnsTimelineRef.current.fromTo(
      current,
      { scale: 1, x: "0%", y: "0%" },
      {
        scale: segment.zoom_level,
        x: `${translateX}%`,
        y: `${translateY}%`,
        duration: duration / 1000,
        ease: "power1.inOut",
      },
      0
    )

    if (focusDotRef.current && segment.id !== "welcome" && segment.id !== "cta") {
      kenBurnsTimelineRef.current.fromTo(
        focusDotRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
        0.4
      )
    }
    
    console.log("[v0] GSAP timeline created and started")
  }, [])

  // Speech synthesis
  const speak = useCallback((text: string, lang: "en" | "es") => {
    console.log("[v0] speak called", { text: text.substring(0, 50), lang, isMuted })
    
    if (typeof window === "undefined") {
      console.log("[v0] No window object")
      return
    }
    
    if (!window.speechSynthesis) {
      console.log("[v0] No speechSynthesis API")
      return
    }
    
    if (isMuted) {
      console.log("[v0] Speech is muted")
      return
    }

    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === "en" ? "en-US" : "es-ES"
    utterance.rate = 0.9
    utterance.pitch = 1
    
    utterance.onstart = () => console.log("[v0] Speech started")
    utterance.onend = () => console.log("[v0] Speech ended")
    utterance.onerror = (e) => console.log("[v0] Speech error:", e.error)
    
    speechRef.current = utterance
    
    // Ensure voices are loaded before speaking
    const voices = window.speechSynthesis.getVoices()
    console.log("[v0] Available voices:", voices.length)
    
    if (voices.length === 0) {
      // Voices not loaded yet, wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        console.log("[v0] Voices loaded, now speaking")
        window.speechSynthesis.speak(utterance)
      }
    } else {
      console.log("[v0] Speaking immediately")
      window.speechSynthesis.speak(utterance)
    }
  }, [isMuted])

  // Typewriter effect
  const startTypewriter = useCallback((text: string, durationMs: number) => {
    setDisplayedText("")
    const charDelay = durationMs / text.length
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
  const startSegment = useCallback(() => {
    console.log("[v0] startSegment called", { segmentId: currentSegment.id, isPlaying, currentSegmentIndex })
    cleanup()
    setProgress(0)
    setDisplayedText("")
    setCaptionExpanded(false)
    
    if (isPlaying) {
      const text = language === "en" ? currentSegment.narrationEN : currentSegment.narrationES
      console.log("[v0] Starting segment playback", { text: text.substring(0, 50) })
      speak(text, language)
      startTypewriter(text, currentSegment.durationMs)
      startProgress(currentSegment.durationMs)
      
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        startKenBurnsAnimation(currentSegment, currentSegment.durationMs, currentSegmentIndex === 0)
      })
    }
  }, [cleanup, isPlaying, language, currentSegment, currentSegmentIndex, speak, startTypewriter, startProgress, startKenBurnsAnimation])

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
  }, [progress, isPlaying, currentSegmentIndex, tourSegments.length])

  useEffect(() => {
    if (isTourActive) {
      startSegment()
    }
    return cleanup
  }, [currentSegmentIndex, isPlaying, isTourActive, startSegment, cleanup])

  useEffect(() => {
    if (isTourActive && isPlaying) {
      startSegment()
    }
  }, [language])

  useEffect(() => {
    if (previousPhotoRef.current && currentSegmentIndex > 0) {
      const prevSegment = tourSegments[currentSegmentIndex - 1]
      previousPhotoRef.current.src = prevSegment.photo_url
    }
  }, [currentSegmentIndex, tourSegments])

  const handleStartTour = () => {
    console.log("[v0] handleStartTour called")
    setIsTourActive(true)
    setCurrentSegmentIndex(0)
    setIsPlaying(true)
    setShowCTA(false)
    setHeroKenBurnsActive(false)
  }

  const handleExitTour = () => {
    cleanup()
    setIsTourActive(false)
    setIsPlaying(false)
    setCurrentSegmentIndex(0)
    setShowCTA(false)
    setHeroKenBurnsActive(true)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      cleanup()
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      if (kenBurnsTimelineRef.current) {
        kenBurnsTimelineRef.current.pause()
      }
    } else {
      if (kenBurnsTimelineRef.current) {
        kenBurnsTimelineRef.current.play()
      }
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

  const toggleMute = () => {
    if (!isMuted && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setIsMuted(!isMuted)
  }

  // Photo Viewer Component
  const PhotoViewer = () => (
    <div ref={photoContainerRef} className="relative w-full h-full overflow-hidden">
      <img
        ref={previousPhotoRef}
        src={currentSegmentIndex > 0 ? tourSegments[currentSegmentIndex - 1].photo_url : currentSegment.photo_url}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: currentSegmentIndex > 0 ? 1 : 0 }}
      />
      
      <img
        ref={currentPhotoRef}
        src={currentSegment.photo_url}
        alt={currentSegment.label}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transformOrigin: "center center", opacity: 1 }}
      />

      {currentSegment.id !== "welcome" && currentSegment.id !== "cta" && (
        <div
          ref={focusDotRef}
          className="absolute pointer-events-none"
          style={{
            left: `${currentSegment.visual_focus.x}%`,
            top: `${currentSegment.visual_focus.y}%`,
            transform: "translate(-50%, -50%)",
            opacity: 0,
          }}
        >
          <div
            className="h-4 w-4 rounded-full animate-pulse"
            style={{
              backgroundColor: currentSegment.accentColor,
              boxShadow: theme.useGlowEffects 
                ? `0 0 20px ${currentSegment.accentColor}, 0 0 40px ${currentSegment.accentColor}50`
                : `0 0 8px ${currentSegment.accentColor}`,
            }}
          />
          <div
            className="absolute inset-0 h-4 w-4 rounded-full animate-ping"
            style={{ backgroundColor: currentSegment.accentColor, opacity: 0.4 }}
          />
        </div>
      )}
    </div>
  )

  // Determine background colors based on theme
  const bgOverlay = theme.useDarkOverlay ? "bg-black/90" : "bg-white/95"
  const bgMain = theme.useDarkOverlay ? "bg-[#0d1117]" : "bg-white"
  
  // Pre-tour landing view
  if (!isTourActive) {
    return (
      <section className={cn("relative w-full overflow-hidden", theme.useDarkOverlay ? "bg-[#0d1117]" : "bg-slate-50")}>
        {theme.useGradients && theme.useDarkOverlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-[#0d1117]/80 to-[#0d1117]" />
        )}
        
        <div className="relative min-h-[85vh] flex flex-col items-center justify-between py-8 px-6">
          {/* Top - Personalization */}
          <div className="text-center z-10">
            <p 
              className={cn("text-[10px] tracking-[0.2em] uppercase", theme.textMuted)}
              style={{ color: theme.accentColor }}
            >
              Personalized for {buyerName}
            </p>
          </div>

          {/* Center - Hero Photo with Ken Burns */}
          <div className={cn("flex-1 w-full relative my-3 overflow-hidden", theme.borderRadius)}>
            <div className="relative w-full h-full min-h-[300px] overflow-hidden">
              <img
                ref={heroPhotoRef}
                src={vehicleImage || DEMO_PHOTOS.exterior_hero}
                alt={vehicleTitle}
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transformOrigin: "center center" }}
              />
              {theme.useDarkOverlay && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-[#0d1117]/30 pointer-events-none" />
              )}
              {!theme.useDarkOverlay && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-slate-50/30 pointer-events-none" />
              )}
            </div>
          </div>

          {/* Vehicle Info & CTA */}
          <div className="flex flex-col items-center text-center z-10">
            <h2 className={cn("text-[22px] mb-0.5 leading-tight", theme.fontHeading, theme.textPrimary)}>
              {vehicleTitle}
            </h2>
            <p className={cn("text-xs mb-5", theme.textMuted)}>
              ${price.toLocaleString()}
            </p>

            {/* Start Button */}
            <button
              onClick={handleStartTour}
              className={cn(
                "group relative flex items-center gap-2.5 px-6 py-3 text-sm uppercase tracking-[0.1em] transition-all",
                theme.buttonRadius
              )}
              style={{ 
                backgroundColor: theme.accentColor,
                color: theme.useDarkOverlay ? "#0d1117" : "#fff"
              }}
            >
              {theme.useGlowEffects && (
                <span 
                  className="absolute inset-0 blur-xl opacity-40 group-hover:opacity-60 transition-opacity"
                  style={{ backgroundColor: theme.accentColor }}
                />
              )}
              <Play className="relative h-4 w-4" fill="currentColor" />
              <span className="relative font-medium">Start Virtual Tour</span>
            </button>

            {/* Tour metadata */}
            <p className={cn("mt-3 text-[10px] uppercase tracking-[0.15em]", theme.textMuted)}>
              AI-narrated · {tourSegments.length} segments · ~90 sec
            </p>
          </div>

          {/* Bottom - Salesperson card */}
          <div 
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 mt-4 z-10",
              theme.useDarkOverlay ? "bg-white/5 backdrop-blur-sm" : "bg-white shadow-sm border border-slate-200",
              theme.borderRadius
            )}
          >
            <div 
              className={cn("h-9 w-9 flex items-center justify-center text-sm font-medium", theme.buttonRadius)}
              style={{ 
                backgroundColor: theme.accentColor,
                color: theme.useDarkOverlay ? "#0d1117" : "#fff"
              }}
            >
              {salespersonInitial}
            </div>
            <div>
              <p className={cn("text-[13px]", theme.textPrimary)}>{salespersonName}</p>
              <p className={cn("text-[11px]", theme.textMuted)}>{dealershipName}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Active tour view
  return (
    <div className={cn("fixed inset-0 z-50 flex flex-col", bgMain)}>
      {/* CTA Overlay */}
      {showCTA && (
        <div className={cn(
          "absolute inset-0 z-50 backdrop-blur-sm flex flex-col items-center justify-center px-5 animate-in fade-in duration-500",
          theme.useDarkOverlay ? "bg-[#0d1117]/95" : "bg-white/95"
        )}>
          <div className="text-center">
            <p 
              className="text-[10px] tracking-[0.2em] uppercase mb-1.5"
              style={{ color: theme.accentColor }}
            >
              Tour Complete
            </p>
            <h2 className={cn("text-[26px] mb-2 leading-tight", theme.fontHeading, theme.textPrimary)}>
              Ready to see it in person?
            </h2>
            <p className={cn("text-[13px] mb-6 max-w-[260px]", theme.textMuted)}>
              {salespersonName} is ready to schedule your test drive
            </p>

            <div className="space-y-2.5 w-full max-w-[260px]">
              <button
                onClick={onBook}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 text-sm uppercase tracking-[0.1em] transition-colors",
                  theme.buttonRadius
                )}
                style={{ 
                  backgroundColor: theme.accentColor,
                  color: theme.useDarkOverlay ? "#0d1117" : "#fff"
                }}
              >
                <Calendar className="h-4 w-4" />
                Book Appointment
              </button>
              
              {onCall && (
                <button
                  onClick={onCall}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 border text-sm uppercase tracking-[0.1em] transition-colors",
                    theme.useDarkOverlay ? "border-white/20 text-white hover:bg-white/5" : "border-slate-200 text-slate-700 hover:bg-slate-50",
                    theme.buttonRadius
                  )}
                >
                  <Phone className="h-4 w-4" />
                  Call {salespersonName.split(" ")[0]}
                </button>
              )}

              <button
                onClick={handleReplay}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2 text-xs uppercase tracking-wider transition-colors",
                  theme.useDarkOverlay ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-slate-700"
                )}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Replay Tour
              </button>

              <button
                onClick={handleExitTour}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-2 text-xs uppercase tracking-wider transition-colors mt-2",
                  theme.useDarkOverlay ? "text-white/30 hover:text-white/60" : "text-slate-300 hover:text-slate-500"
                )}
              >
                <X className="h-3.5 w-3.5" />
                Exit Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className={cn("flex items-center justify-between px-3 py-2", theme.borderColor, "border-b")}>
        <button
          onClick={handleExitTour}
          className={cn(
            "p-1.5 transition-colors",
            theme.useDarkOverlay ? "text-white/60 hover:text-white" : "text-slate-400 hover:text-slate-700"
          )}
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-center gap-2">
          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className={cn(
              "p-1.5 transition-colors",
              theme.useDarkOverlay ? "text-white/60 hover:text-white" : "text-slate-400 hover:text-slate-700"
            )}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          
          {/* Language Toggle */}
          <div className={cn(
            "flex overflow-hidden",
            theme.useDarkOverlay ? "bg-white/10" : "bg-slate-100",
            theme.buttonRadius
          )}>
            <button
              onClick={() => setLanguage("en")}
              className={cn(
                "px-2 py-1 text-[10px] uppercase tracking-wider transition-colors",
                language === "en" 
                  ? theme.useDarkOverlay ? "bg-white text-slate-900" : "bg-slate-900 text-white"
                  : theme.useDarkOverlay ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-slate-700"
              )}
              style={language === "en" ? { backgroundColor: theme.accentColor, color: theme.useDarkOverlay ? "#0d1117" : "#fff" } : {}}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={cn(
                "px-2 py-1 text-[10px] uppercase tracking-wider transition-colors",
                language === "es" 
                  ? theme.useDarkOverlay ? "bg-white text-slate-900" : "bg-slate-900 text-white"
                  : theme.useDarkOverlay ? "text-white/50 hover:text-white" : "text-slate-500 hover:text-slate-700"
              )}
              style={language === "es" ? { backgroundColor: theme.accentColor, color: theme.useDarkOverlay ? "#0d1117" : "#fff" } : {}}
            >
              ES
            </button>
          </div>
        </div>
      </div>

      {/* Segment Navigation */}
      <div className={cn(
        "flex items-center gap-0.5 px-2 py-1 overflow-x-auto scrollbar-hide border-b",
        theme.borderColor
      )}>
        {tourSegments.map((segment, index) => (
          <button
            key={segment.id}
            onClick={() => handleSegmentClick(index)}
            className={cn(
              "flex-shrink-0 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] transition-all duration-300",
              theme.buttonRadius,
              index === currentSegmentIndex
                ? ""
                : theme.useDarkOverlay ? "text-white/30 hover:text-white/60" : "text-slate-400 hover:text-slate-600"
            )}
            style={{
              backgroundColor: index === currentSegmentIndex ? segment.accentColor : undefined,
              color: index === currentSegmentIndex ? (theme.useDarkOverlay ? "#0d1117" : "#fff") : undefined,
            }}
          >
            {segment.label}
          </button>
        ))}
      </div>

      {/* Main Visual Area */}
      <div 
        className="flex-1 relative overflow-hidden transition-all duration-1000"
        style={{
          background: theme.useGradients 
            ? `radial-gradient(ellipse at center, ${currentSegment.accentColor}15, ${theme.useDarkOverlay ? "#0d1117" : "#f8fafc"})`
            : undefined,
        }}
      >
        {/* Floating Segment Label */}
        <div 
          className={cn(
            "absolute top-2 left-3 z-10 flex items-center gap-2 px-2 py-1 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-500",
            theme.useDarkOverlay ? "bg-black/40" : "bg-white/80"
          )}
          style={{ borderLeft: `2px solid ${currentSegment.accentColor}` }}
        >
          <span className={cn("text-[10px] uppercase tracking-[0.15em]", theme.textPrimary)}>
            {currentSegment.label}
          </span>
        </div>

        <PhotoViewer />

        {/* Gradient overlays */}
        <div 
          className={cn(
            "absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t pointer-events-none",
            theme.useDarkOverlay ? "from-[#0d1117]" : "from-white"
          )} 
        />
        <div 
          className={cn(
            "absolute inset-x-0 top-0 h-12 bg-gradient-to-b pointer-events-none",
            theme.useDarkOverlay ? "from-[#0d1117]/60" : "from-white/60"
          )}
        />
      </div>

      {/* Caption Area */}
      <div className="px-4 py-2">
        <div className="relative">
          <p className={cn(
            "text-[13px] leading-relaxed transition-all duration-300",
            theme.fontBody,
            theme.textSecondary,
            !captionExpanded && "line-clamp-2"
          )}>
            {displayedText}
            {displayedText.length < narrationText.length && isPlaying && (
              <span className="animate-pulse">|</span>
            )}
          </p>
          {displayedText.length > 80 && (
            <button
              onClick={() => setCaptionExpanded(!captionExpanded)}
              className="text-[10px] uppercase tracking-[0.15em] transition-colors"
              style={{ color: currentSegment.accentColor }}
            >
              {captionExpanded ? "Less" : "More"}
            </button>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-6 py-2">
        <button
          onClick={handlePrevious}
          disabled={currentSegmentIndex === 0}
          className={cn(
            "p-2 transition-colors disabled:opacity-20 disabled:cursor-not-allowed",
            theme.useDarkOverlay ? "text-white/50 hover:text-white" : "text-slate-400 hover:text-slate-700"
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={handlePlayPause}
          className={cn("h-11 w-11 flex items-center justify-center transition-all hover:scale-105", theme.buttonRadius)}
          style={{ backgroundColor: currentSegment.accentColor }}
        >
          {isPlaying ? (
            <Pause 
              className="h-5 w-5" 
              fill="currentColor"
              style={{ color: theme.useDarkOverlay ? "#0d1117" : "#fff" }}
            />
          ) : (
            <Play 
              className="h-5 w-5 ml-0.5" 
              fill="currentColor"
              style={{ color: theme.useDarkOverlay ? "#0d1117" : "#fff" }}
            />
          )}
        </button>

        <button
          onClick={handleNext}
          className={cn(
            "p-2 transition-colors",
            theme.useDarkOverlay ? "text-white/50 hover:text-white" : "text-slate-400 hover:text-slate-700"
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className={cn("h-0.5", theme.useDarkOverlay ? "bg-white/10" : "bg-slate-200")}>
        <div
          className="h-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            backgroundColor: currentSegment.accentColor,
          }}
        />
      </div>
    </div>
  )
}
