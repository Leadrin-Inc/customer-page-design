"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Play, Pause, Phone, Calendar, RotateCcw } from "lucide-react"
import Image from "next/image"

// Tour segment data model
interface TourSegment {
  id: string
  label: string
  icon: string
  narrationEN: string
  narrationES: string
  focusZone: { x: number; y: number; scale: number }
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

// Sample tour data for 2024 Toyota RAV4 Limited AWD
const tourSegments: TourSegment[] = [
  {
    id: "welcome",
    label: "Welcome",
    icon: "hand-wave",
    narrationEN: "Welcome, Sarah. I'm excited to personally guide you through this exceptional vehicle. Let me show you why this could be the perfect match for you.",
    narrationES: "Bienvenida, Sarah. Estoy emocionado de guiarte personalmente a traves de este excepcional vehiculo. Dejame mostrarte por que este podria ser el auto perfecto para ti.",
    focusZone: { x: 50, y: 50, scale: 1 },
    accentColor: "#c9a227",
    durationMs: 8000,
  },
  {
    id: "powertrain",
    label: "Powertrain",
    icon: "engine",
    narrationEN: "Under the hood, you'll find a refined powertrain that delivers both performance and efficiency. The smooth power delivery makes every drive a pleasure.",
    narrationES: "Bajo el capo, encontraras un tren motriz refinado que ofrece rendimiento y eficiencia. La entrega de potencia suave hace que cada viaje sea un placer.",
    focusZone: { x: 30, y: 40, scale: 1.4 },
    accentColor: "#dc2626",
    durationMs: 7000,
  },
  {
    id: "interior",
    label: "Interior",
    icon: "armchair",
    narrationEN: "Step inside and experience true luxury. Premium materials, meticulous craftsmanship, and thoughtful design create an environment you'll love spending time in.",
    narrationES: "Entra y experimenta el verdadero lujo. Materiales premium, artesania meticulosa y diseno pensado crean un ambiente en el que te encantara pasar tiempo.",
    focusZone: { x: 45, y: 55, scale: 1.5 },
    accentColor: "#7c3aed",
    durationMs: 7000,
  },
  {
    id: "technology",
    label: "Technology",
    icon: "cpu",
    narrationEN: "Advanced technology keeps you connected and in control. The intuitive interface and premium audio system make every journey more enjoyable.",
    narrationES: "La tecnologia avanzada te mantiene conectado y en control. La interfaz intuitiva y el sistema de audio premium hacen que cada viaje sea mas agradable.",
    focusZone: { x: 55, y: 45, scale: 1.6 },
    accentColor: "#0ea5e9",
    durationMs: 7000,
  },
  {
    id: "safety",
    label: "Safety",
    icon: "shield",
    narrationEN: "Your safety is paramount. This vehicle comes equipped with a comprehensive suite of advanced safety features to protect you and your loved ones.",
    narrationES: "Tu seguridad es primordial. Este vehiculo viene equipado con un conjunto completo de funciones de seguridad avanzadas para protegerte a ti y a tus seres queridos.",
    focusZone: { x: 25, y: 60, scale: 1.3 },
    accentColor: "#22c55e",
    durationMs: 7000,
  },
  {
    id: "cargo",
    label: "Versatility",
    icon: "package",
    narrationEN: "Generous cargo space and flexible configurations adapt to your lifestyle. Whether it's a weekend getaway or daily errands, you'll have room for it all.",
    narrationES: "Amplio espacio de carga y configuraciones flexibles se adaptan a tu estilo de vida. Ya sea una escapada de fin de semana o recados diarios, tendras espacio para todo.",
    focusZone: { x: 70, y: 50, scale: 1.4 },
    accentColor: "#f59e0b",
    durationMs: 7000,
  },
  {
    id: "cta",
    label: "Next Steps",
    icon: "calendar",
    narrationEN: "I hope you've enjoyed this tour, Sarah. I'd love to show you this vehicle in person. Let's schedule a time that works for you.",
    narrationES: "Espero que hayas disfrutado este recorrido, Sarah. Me encantaria mostrarte este vehiculo en persona. Programemos un horario que te funcione.",
    focusZone: { x: 50, y: 50, scale: 1 },
    accentColor: "#c9a227",
    durationMs: 6000,
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
  const [language, setLanguage] = useState<"en" | "es">("en")
  const [displayedText, setDisplayedText] = useState("")
  const [progress, setProgress] = useState(0)
  const [showCTA, setShowCTA] = useState(false)
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  const currentSegment = tourSegments[currentSegmentIndex]
  const narrationText = language === "en" ? currentSegment.narrationEN : currentSegment.narrationES

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
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  }, [])

  // Speech synthesis
  const speak = useCallback((text: string, lang: "en" | "es") => {
    if (typeof window === "undefined" || !window.speechSynthesis) return

    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang === "en" ? "en-US" : "es-ES"
    utterance.rate = 0.9
    utterance.pitch = 1
    speechRef.current = utterance
    
    window.speechSynthesis.speak(utterance)
  }, [])

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
    cleanup()
    setProgress(0)
    setDisplayedText("")
    
    if (isPlaying) {
      const text = language === "en" ? currentSegment.narrationEN : currentSegment.narrationES
      speak(text, language)
      startTypewriter(text, currentSegment.durationMs)
      startProgress(currentSegment.durationMs)
    }
  }, [cleanup, isPlaying, language, currentSegment, speak, startTypewriter, startProgress])

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
      startSegment()
    }
    return cleanup
  }, [currentSegmentIndex, isPlaying, isTourActive, startSegment, cleanup])

  // Handle language change - restart current segment
  useEffect(() => {
    if (isTourActive && isPlaying) {
      startSegment()
    }
  }, [language])

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
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
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

  // Pre-tour landing view
  if (!isTourActive) {
    return (
      <section className="relative mx-5 my-8 overflow-hidden rounded-sm bg-[#0d1117]">
        {/* Background with vehicle silhouette */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={vehicleImage}
            alt={vehicleTitle}
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/60 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-between py-8 px-6">
            {/* Top - Personalization */}
            <div className="text-center">
              <p className="text-xs tracking-[0.25em] text-[#c9a227] uppercase font-mono">
                Personalized for {buyerName}
              </p>
            </div>

            {/* Center - Vehicle Info & CTA */}
            <div className="flex flex-col items-center text-center">
              <h2 className="font-serif text-2xl text-white mb-1">{vehicleTitle}</h2>
              <p className="text-white/60 text-sm mb-8">
                ${price.toLocaleString()}
              </p>

              {/* Start Button with glow */}
              <button
                onClick={handleStartTour}
                className="group relative flex items-center gap-3 px-8 py-4 bg-[#c9a227] text-[#0d1117] font-semibold transition-all hover:bg-[#d4af37]"
              >
                <span className="absolute inset-0 bg-[#c9a227] blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                <Play className="relative h-5 w-5" fill="currentColor" />
                <span className="relative">Start Virtual Tour</span>
              </button>

              {/* Tour metadata */}
              <p className="mt-4 text-xs text-white/40 font-mono">
                AI-narrated · 6 features · ~90 seconds
              </p>
            </div>

            {/* Bottom - Salesperson card */}
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-sm">
              <div className="h-10 w-10 rounded-full bg-[#c9a227] flex items-center justify-center text-[#0d1117] font-semibold">
                {salespersonInitial}
              </div>
              <div>
                <p className="text-white text-sm font-medium">{salespersonName}</p>
                <p className="text-white/50 text-xs">{dealershipName}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Active tour view
  return (
    <div className="fixed inset-0 z-50 bg-[#0d1117] flex flex-col">
      {/* CTA Overlay */}
      {showCTA && (
        <div className="absolute inset-0 z-50 bg-[#0d1117]/95 backdrop-blur-sm flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
          <div className="text-center">
            <p className="text-xs tracking-[0.25em] text-[#c9a227] uppercase font-mono mb-2">
              Tour Complete
            </p>
            <h2 className="font-serif text-3xl text-white mb-3">
              Ready to see it in person?
            </h2>
            <p className="text-white/60 text-sm mb-8 max-w-xs">
              {salespersonName} is ready to show you this {vehicleTitle}
            </p>

            <div className="space-y-3 w-full max-w-xs">
              <button
                onClick={onBook}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#c9a227] text-[#0d1117] font-semibold transition-colors hover:bg-[#d4af37]"
              >
                <Calendar className="h-4 w-4" />
                Book Appointment
              </button>
              
              {onCall && (
                <button
                  onClick={onCall}
                  className="w-full flex items-center justify-center gap-2 py-4 border border-white/20 text-white transition-colors hover:bg-white/5"
                >
                  <Phone className="h-4 w-4" />
                  Call {salespersonName.split(" ")[0]}
                </button>
              )}

              <button
                onClick={handleReplay}
                className="w-full flex items-center justify-center gap-2 py-3 text-white/50 text-sm hover:text-white transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Replay Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button
          onClick={handleExitTour}
          className="p-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <p className="text-white text-sm font-medium">{vehicleTitle}</p>
        
        {/* Language Toggle */}
        <div className="flex bg-white/10 rounded-sm overflow-hidden">
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1.5 text-xs font-mono transition-colors ${
              language === "en" ? "bg-[#c9a227] text-[#0d1117]" : "text-white/60 hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("es")}
            className={`px-3 py-1.5 text-xs font-mono transition-colors ${
              language === "es" ? "bg-[#c9a227] text-[#0d1117]" : "text-white/60 hover:text-white"
            }`}
          >
            ES
          </button>
        </div>
      </div>

      {/* Segment Navigation Dots */}
      <div className="flex items-center justify-center gap-2 py-3">
        {tourSegments.map((segment, index) => (
          <button
            key={segment.id}
            onClick={() => handleSegmentClick(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSegmentIndex
                ? "w-6"
                : "w-2 bg-white/20 hover:bg-white/40"
            }`}
            style={{
              backgroundColor: index === currentSegmentIndex ? currentSegment.accentColor : undefined,
            }}
          />
        ))}
      </div>

      {/* Main Visual Area */}
      <div 
        className="flex-1 relative overflow-hidden transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, ${currentSegment.accentColor}15, #0d1117)`,
        }}
      >
        {/* Floating Segment Label */}
        <div 
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-sm animate-in fade-in slide-in-from-top-2 duration-500"
          style={{ borderLeft: `2px solid ${currentSegment.accentColor}` }}
        >
          <span className="text-xs text-white font-mono uppercase tracking-wider">
            {currentSegment.label}
          </span>
        </div>

        {/* Vehicle Image with zoom/pan */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-full h-full transition-transform duration-[1500ms] ease-out"
            style={{
              transform: `scale(${currentSegment.focusZone.scale}) translate(${(50 - currentSegment.focusZone.x) * 0.5}%, ${(50 - currentSegment.focusZone.y) * 0.5}%)`,
            }}
          >
            <Image
              src={vehicleImage}
              alt={vehicleTitle}
              fill
              className="object-cover"
            />
          </div>

          {/* Pulsing Focus Dot - not shown on welcome/cta */}
          {currentSegmentIndex !== 0 && currentSegmentIndex !== tourSegments.length - 1 && (
            <div
              className="absolute z-10 animate-pulse"
              style={{
                left: `${currentSegment.focusZone.x}%`,
                top: `${currentSegment.focusZone.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className="h-4 w-4 rounded-full"
                style={{
                  backgroundColor: currentSegment.accentColor,
                  boxShadow: `0 0 20px ${currentSegment.accentColor}, 0 0 40px ${currentSegment.accentColor}50`,
                }}
              />
              <div
                className="absolute inset-0 h-4 w-4 rounded-full animate-ping"
                style={{ backgroundColor: currentSegment.accentColor, opacity: 0.5 }}
              />
            </div>
          )}
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none" />
      </div>

      {/* Caption Area */}
      <div className="px-6 py-4 min-h-[120px]">
        <p className="text-white/90 text-[15px] leading-relaxed font-serif">
          {displayedText}
          {displayedText.length < narrationText.length && isPlaying && (
            <span className="animate-pulse">|</span>
          )}
        </p>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-8 pb-4">
        <button
          onClick={handlePrevious}
          disabled={currentSegmentIndex === 0}
          className="p-3 text-white/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={handlePlayPause}
          className="h-14 w-14 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{ backgroundColor: currentSegment.accentColor }}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 text-[#0d1117]" fill="currentColor" />
          ) : (
            <Play className="h-6 w-6 text-[#0d1117] ml-1" fill="currentColor" />
          )}
        </button>

        <button
          onClick={handleNext}
          className="p-3 text-white/60 hover:text-white transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/10">
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
