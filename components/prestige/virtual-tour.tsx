"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Play, Pause, Phone, Calendar, RotateCcw } from "lucide-react"
import Image from "next/image"

// Tour segment data model with targetRotation for spin viewer
interface TourSegment {
  id: string
  label: string
  icon: string
  narrationEN: string
  narrationES: string
  targetRotation: number // degrees 0-360 for vehicle spin
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

// Sample tour data - each segment has a targetRotation (0-360)
const tourSegments: TourSegment[] = [
  {
    id: "welcome",
    label: "Welcome",
    icon: "hand-wave",
    narrationEN: "Welcome, Sarah. I'm excited to personally guide you through this exceptional vehicle. Let me show you why this could be the perfect match for you.",
    narrationES: "Bienvenida, Sarah. Estoy emocionado de guiarte personalmente a traves de este excepcional vehiculo. Dejame mostrarte por que este podria ser el auto perfecto para ti.",
    targetRotation: 0,
    accentColor: "#c9a227",
    durationMs: 8000,
  },
  {
    id: "powertrain",
    label: "Powertrain",
    icon: "engine",
    narrationEN: "Under the hood, you'll find a refined powertrain that delivers both performance and efficiency. The smooth power delivery makes every drive a pleasure.",
    narrationES: "Bajo el capo, encontraras un tren motriz refinado que ofrece rendimiento y eficiencia. La entrega de potencia suave hace que cada viaje sea un placer.",
    targetRotation: 30,
    accentColor: "#dc2626",
    durationMs: 7000,
  },
  {
    id: "interior",
    label: "Interior",
    icon: "armchair",
    narrationEN: "Step inside and experience true luxury. Premium materials, meticulous craftsmanship, and thoughtful design create an environment you'll love spending time in.",
    narrationES: "Entra y experimenta el verdadero lujo. Materiales premium, artesania meticulosa y diseno pensado crean un ambiente en el que te encantara pasar tiempo.",
    targetRotation: 90,
    accentColor: "#7c3aed",
    durationMs: 7000,
  },
  {
    id: "technology",
    label: "Technology",
    icon: "cpu",
    narrationEN: "Advanced technology keeps you connected and in control. The intuitive interface and premium audio system make every journey more enjoyable.",
    narrationES: "La tecnologia avanzada te mantiene conectado y en control. La interfaz intuitiva y el sistema de audio premium hacen que cada viaje sea mas agradable.",
    targetRotation: 120,
    accentColor: "#0ea5e9",
    durationMs: 7000,
  },
  {
    id: "safety",
    label: "Safety",
    icon: "shield",
    narrationEN: "Your safety is paramount. This vehicle comes equipped with a comprehensive suite of advanced safety features to protect you and your loved ones.",
    narrationES: "Tu seguridad es primordial. Este vehiculo viene equipado con un conjunto completo de funciones de seguridad avanzadas para protegerte a ti y a tus seres queridos.",
    targetRotation: 150,
    accentColor: "#22c55e",
    durationMs: 7000,
  },
  {
    id: "cargo",
    label: "Versatility",
    icon: "package",
    narrationEN: "Generous cargo space and flexible configurations adapt to your lifestyle. Whether it's a weekend getaway or daily errands, you'll have room for it all.",
    narrationES: "Amplio espacio de carga y configuraciones flexibles se adaptan a tu estilo de vida. Ya sea una escapada de fin de semana o recados diarios, tendras espacio para todo.",
    targetRotation: 180,
    accentColor: "#f59e0b",
    durationMs: 7000,
  },
  {
    id: "cta",
    label: "Next Steps",
    icon: "calendar",
    narrationEN: "I hope you've enjoyed this tour, Sarah. I'd love to show you this vehicle in person. Let's schedule a time that works for you.",
    narrationES: "Espero que hayas disfrutado este recorrido, Sarah. Me encantaria mostrarte este vehiculo en persona. Programemos un horario que te funcione.",
    targetRotation: 360,
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
  
  // Spin viewer state - CSS 3D rotation based
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartRotation, setDragStartRotation] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [lastDragX, setLastDragX] = useState(0)
  const [lastDragTime, setLastDragTime] = useState(0)
  const [captionExpanded, setCaptionExpanded] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; opacity: number }>>([])
  const [oscillationOffset, setOscillationOffset] = useState(0)
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const autoSpinRef = useRef<NodeJS.Timeout | null>(null)
  const oscillationRef = useRef<NodeJS.Timeout | null>(null)
  const spinContainerRef = useRef<HTMLDivElement>(null)

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

  // Auto-spin for pre-tour mode (continuous rotation)
  useEffect(() => {
    if (!isTourActive) {
      autoSpinRef.current = setInterval(() => {
        setRotation(prev => (prev + 0.5) % 360)
      }, 16)
    } else {
      if (autoSpinRef.current) {
        clearInterval(autoSpinRef.current)
        autoSpinRef.current = null
      }
    }
    return () => {
      if (autoSpinRef.current) {
        clearInterval(autoSpinRef.current)
      }
    }
  }, [isTourActive])

  // Oscillation effect when paused (subtle ±3° movement)
  useEffect(() => {
    if (isTourActive && !isPlaying && !isDragging) {
      let direction = 1
      let offset = 0
      oscillationRef.current = setInterval(() => {
        offset += direction * 0.15
        if (offset >= 3) direction = -1
        if (offset <= -3) direction = 1
        setOscillationOffset(offset)
      }, 50)
    } else {
      setOscillationOffset(0)
      if (oscillationRef.current) {
        clearInterval(oscillationRef.current)
        oscillationRef.current = null
      }
    }
    return () => {
      if (oscillationRef.current) {
        clearInterval(oscillationRef.current)
      }
    }
  }, [isTourActive, isPlaying, isDragging])

  // Smoothly interpolate to target rotation when segment changes
  useEffect(() => {
    if (isTourActive && isPlaying && !isDragging) {
      setRotation(currentSegment.targetRotation)
    }
  }, [currentSegmentIndex, isTourActive, isPlaying, isDragging, currentSegment.targetRotation])

  // Momentum/inertia effect - decelerate after flick
  useEffect(() => {
    if (!isDragging && Math.abs(velocity) > 0.5) {
      const momentumInterval = setInterval(() => {
        setVelocity(prev => {
          const newVelocity = prev * 0.95 // friction
          if (Math.abs(newVelocity) < 0.5) {
            clearInterval(momentumInterval)
            return 0
          }
          setRotation(r => (r + newVelocity) % 360)
          
          // Add particle trail during momentum
          if (Math.abs(newVelocity) > 2) {
            setParticles(prev => [
              ...prev.slice(-8),
              { id: Date.now(), angle: rotation, opacity: Math.min(Math.abs(newVelocity) / 10, 1) }
            ])
          }
          
          return newVelocity
        })
      }, 16)
      return () => clearInterval(momentumInterval)
    }
  }, [isDragging, velocity, rotation])

  // Fade out particles
  useEffect(() => {
    if (particles.length > 0) {
      const fadeInterval = setInterval(() => {
        setParticles(prev => 
          prev.map(p => ({ ...p, opacity: p.opacity * 0.9 })).filter(p => p.opacity > 0.05)
        )
      }, 50)
      return () => clearInterval(fadeInterval)
    }
  }, [particles.length])

  // Drag to rotate handlers
  const handleDragStart = (clientX: number) => {
    if (!isTourActive || isPlaying) return
    setIsDragging(true)
    setVelocity(0)
    setDragStartX(clientX)
    setDragStartRotation(rotation)
    setLastDragX(clientX)
    setLastDragTime(Date.now())
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    const delta = (clientX - dragStartX) * 0.5 // sensitivity
    setRotation((dragStartRotation + delta) % 360)
    
    // Track velocity for momentum
    const now = Date.now()
    const timeDelta = now - lastDragTime
    if (timeDelta > 0) {
      const moveDelta = (clientX - lastDragX) * 0.5
      setVelocity(moveDelta / Math.max(timeDelta, 16) * 16)
    }
    setLastDragX(clientX)
    setLastDragTime(now)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX)
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX)
  const onMouseUp = () => handleDragEnd()
  const onMouseLeave = () => handleDragEnd()

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX)
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX)
  const onTouchEnd = () => handleDragEnd()

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
    setCaptionExpanded(false)
    
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

  // Handle language change
  useEffect(() => {
    if (isTourActive && isPlaying) {
      startSegment()
    }
  }, [language])

  const handleStartTour = () => {
    setIsTourActive(true)
    setCurrentSegmentIndex(0)
    setRotation(0)
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
    } else {
      setRotation(currentSegment.targetRotation)
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
    setRotation(0)
    setIsPlaying(true)
  }

  const handleSegmentClick = (index: number) => {
    cleanup()
    setCurrentSegmentIndex(index)
    setShowCTA(false)
    setIsPlaying(true)
  }

  // Calculate display rotation (target + oscillation when paused)
  const displayRotation = isTourActive && !isPlaying ? rotation + oscillationOffset : rotation

  // Spin Viewer Component with CSS 3D rotation
  const SpinViewer = ({ autoSpin = false }: { autoSpin?: boolean }) => (
    <div 
      ref={spinContainerRef}
      className={`relative w-full h-full flex items-center justify-center ${!autoSpin && !isPlaying ? 'cursor-grab active:cursor-grabbing' : ''}`}
      style={{ perspective: "1000px" }}
      onMouseDown={!autoSpin ? onMouseDown : undefined}
      onMouseMove={!autoSpin ? onMouseMove : undefined}
      onMouseUp={!autoSpin ? onMouseUp : undefined}
      onMouseLeave={!autoSpin ? onMouseLeave : undefined}
      onTouchStart={!autoSpin ? onTouchStart : undefined}
      onTouchMove={!autoSpin ? onTouchMove : undefined}
      onTouchEnd={!autoSpin ? onTouchEnd : undefined}
    >
      {/* Light streak particles */}
      {!autoSpin && particles.map(particle => (
        <div
          key={particle.id}
          className="absolute left-1/2 top-1/2 w-20 h-0.5 rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${currentSegment.accentColor})`,
            opacity: particle.opacity * 0.5,
            transform: `translate(-50%, -50%) rotate(${particle.angle}deg) translateX(100px)`,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Vehicle with 3D rotation */}
      <div
        className={`relative w-[85%] aspect-[16/10] ${isDragging || Math.abs(velocity) > 0.5 ? '' : 'transition-transform duration-[1500ms] ease-[cubic-bezier(0.4,0,0.2,1)]'}`}
        style={{
          transform: `rotateY(${displayRotation}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <Image
          src={vehicleImage}
          alt={vehicleTitle}
          fill
          className="object-contain pointer-events-none"
          priority
        />
      </div>

      {/* Ground reflection */}
      <div 
        className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[80%] h-[30%] overflow-hidden opacity-20 blur-[2px]"
        style={{ 
          transform: `translateX(-50%) rotateX(180deg) rotateY(${displayRotation}deg)`,
          maskImage: "linear-gradient(to top, black 0%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 80%)",
        }}
      >
        <div className="relative w-full h-full">
          <Image
            src={vehicleImage}
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Ground shadow */}
      <div 
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[70%] h-8 rounded-[100%] bg-black/40 blur-xl"
        style={{
          transform: `translateX(-50%) scaleX(${1 + Math.abs(Math.sin(displayRotation * Math.PI / 180)) * 0.2})`,
        }}
      />

      {/* Drag hint when paused */}
      {!autoSpin && !isPlaying && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/30 text-xs font-mono">
          <span>{"<-"} Drag to rotate {"->"}</span>
        </div>
      )}
    </div>
  )

  // Pre-tour landing view
  if (!isTourActive) {
    return (
      <section className="relative bg-[#0d1117] overflow-hidden">
        {/* Spin Viewer Background */}
        <div className="absolute inset-0 opacity-30">
          <SpinViewer autoSpin />
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-transparent to-[#0d1117]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1117]/80 via-transparent to-[#0d1117]/80" />

        {/* Content */}
        <div className="relative z-10 px-6 py-12 flex flex-col items-center">
          {/* Personalized greeting */}
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#c9a227] mb-2">
            Exclusive Preview for
          </p>
          <h2 className="text-2xl font-serif text-white mb-6">
            {buyerName}
          </h2>

          {/* Vehicle info */}
          <h3 className="text-lg font-light text-white/80 text-center mb-2">
            {vehicleTitle}
          </h3>
          <p className="text-2xl font-serif text-white mb-8">
            ${price.toLocaleString()}
          </p>

          {/* Start Tour CTA */}
          <button
            onClick={handleStartTour}
            className="group relative px-8 py-4 bg-[#c9a227] text-[#0d1117] font-semibold tracking-wide overflow-hidden transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Play className="h-4 w-4" />
              Start Virtual Tour
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-[#c9a227]/30 blur-lg animate-pulse" />
          </button>

          {/* Tour metadata */}
          <div className="flex items-center gap-4 mt-6 text-xs text-white/40 font-mono">
            <span>{tourSegments.length} segments</span>
            <span>•</span>
            <span>~3 min</span>
            <span>•</span>
            <span>EN/ES</span>
          </div>

          {/* Salesperson card */}
          <div className="mt-8 flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-[#c9a227]/20 border border-[#c9a227]/30 flex items-center justify-center text-[#c9a227] font-serif">
              {salespersonInitial}
            </div>
            <div>
              <p className="text-sm text-white">{salespersonName}</p>
              <p className="text-xs text-white/50">{dealershipName}</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Active tour view
  return (
    <section className="relative bg-[#0d1117] min-h-[600px] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button
          onClick={handleExitTour}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <X className="h-4 w-4" />
          Exit
        </button>

        {/* Language toggle */}
        <div className="flex items-center gap-1 bg-white/5 p-0.5">
          <button
            onClick={() => setLanguage("en")}
            className={`px-3 py-1 text-xs font-mono transition-colors ${
              language === "en" ? "bg-white/10 text-white" : "text-white/40"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("es")}
            className={`px-3 py-1 text-xs font-mono transition-colors ${
              language === "es" ? "bg-white/10 text-white" : "text-white/40"
            }`}
          >
            ES
          </button>
        </div>
      </div>

      {/* Spin Viewer Area */}
      <div className="flex-1 relative min-h-[300px]">
        <SpinViewer />

        {/* CTA Overlay */}
        {showCTA && (
          <div className="absolute inset-0 bg-[#0d1117]/90 flex flex-col items-center justify-center z-20 animate-in fade-in duration-500">
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#c9a227] mb-2">
              Tour Complete
            </p>
            <h3 className="text-xl font-serif text-white mb-6">
              Ready for the next step?
            </h3>
            
            <div className="flex flex-col gap-3 w-full max-w-xs px-6">
              <button
                onClick={onBook}
                className="flex items-center justify-center gap-2 py-3 bg-[#c9a227] text-[#0d1117] font-semibold"
              >
                <Calendar className="h-4 w-4" />
                Schedule Appointment
              </button>
              
              {onCall && (
                <button
                  onClick={onCall}
                  className="flex items-center justify-center gap-2 py-3 border border-white/20 text-white hover:bg-white/5"
                >
                  <Phone className="h-4 w-4" />
                  Call {salespersonName.split(" ")[0]}
                </button>
              )}
              
              <button
                onClick={handleReplay}
                className="flex items-center justify-center gap-2 py-2 text-white/50 hover:text-white text-sm"
              >
                <RotateCcw className="h-3 w-3" />
                Replay Tour
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Segment Navigation - Named Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-hide border-t border-white/10">
        {tourSegments.map((segment, index) => (
          <button
            key={segment.id}
            onClick={() => handleSegmentClick(index)}
            className={`flex-shrink-0 px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-sm transition-all duration-300 ${
              index === currentSegmentIndex
                ? "text-[#0d1117]"
                : "text-white/40 hover:text-white/70 bg-transparent"
            }`}
            style={{
              backgroundColor: index === currentSegmentIndex ? segment.accentColor : undefined,
            }}
          >
            {segment.label}
          </button>
        ))}
      </div>

      {/* Caption Area - Collapsible */}
      <div className="px-6 py-3 border-t border-white/10">
        <div className="relative">
          <p 
            className={`text-white/90 text-[15px] leading-relaxed font-serif transition-all duration-300 ${
              !captionExpanded ? "line-clamp-3" : ""
            }`}
          >
            {displayedText}
            {displayedText.length < narrationText.length && isPlaying && (
              <span className="animate-pulse">|</span>
            )}
          </p>
          {displayedText.length > 100 && (
            <button
              onClick={() => setCaptionExpanded(!captionExpanded)}
              className="mt-1 text-xs font-mono uppercase tracking-wider transition-colors"
              style={{ color: currentSegment.accentColor }}
            >
              {captionExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="px-6 py-4 border-t border-white/10">
        {/* Progress bar */}
        <div className="h-1 bg-white/10 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full transition-all duration-100"
            style={{ 
              width: `${progress}%`,
              backgroundColor: currentSegment.accentColor,
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentSegmentIndex === 0}
            className="p-2 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={handlePlayPause}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: currentSegment.accentColor }}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-[#0d1117]" />
            ) : (
              <Play className="h-5 w-5 text-[#0d1117] ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 text-white/60 hover:text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
