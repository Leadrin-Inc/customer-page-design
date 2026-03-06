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

// Sample tour data for 2024 Toyota RAV4 Limited AWD
// Each segment has a targetRotation to show the relevant angle
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
    targetRotation: 30, // front quarter angle
    accentColor: "#dc2626",
    durationMs: 7000,
  },
  {
    id: "interior",
    label: "Interior",
    icon: "armchair",
    narrationEN: "Step inside and experience true luxury. Premium materials, meticulous craftsmanship, and thoughtful design create an environment you'll love spending time in.",
    narrationES: "Entra y experimenta el verdadero lujo. Materiales premium, artesania meticulosa y diseno pensado crean un ambiente en el que te encantara pasar tiempo.",
    targetRotation: 90, // side view (door open angle)
    accentColor: "#7c3aed",
    durationMs: 7000,
  },
  {
    id: "technology",
    label: "Technology",
    icon: "cpu",
    narrationEN: "Advanced technology keeps you connected and in control. The intuitive interface and premium audio system make every journey more enjoyable.",
    narrationES: "La tecnologia avanzada te mantiene conectado y en control. La interfaz intuitiva y el sistema de audio premium hacen que cada viaje sea mas agradable.",
    targetRotation: 110, // slightly past side view
    accentColor: "#0ea5e9",
    durationMs: 7000,
  },
  {
    id: "safety",
    label: "Safety",
    icon: "shield",
    narrationEN: "Your safety is paramount. This vehicle comes equipped with a comprehensive suite of advanced safety features to protect you and your loved ones.",
    narrationES: "Tu seguridad es primordial. Este vehiculo viene equipado con un conjunto completo de funciones de seguridad avanzadas para protegerte a ti y a tus seres queridos.",
    targetRotation: 150, // rear quarter angle
    accentColor: "#22c55e",
    durationMs: 7000,
  },
  {
    id: "cargo",
    label: "Versatility",
    icon: "package",
    narrationEN: "Generous cargo space and flexible configurations adapt to your lifestyle. Whether it's a weekend getaway or daily errands, you'll have room for it all.",
    narrationES: "Amplio espacio de carga y configuraciones flexibles se adaptan a tu estilo de vida. Ya sea una escapada de fin de semana o recados diarios, tendras espacio para todo.",
    targetRotation: 180, // rear view
    accentColor: "#f59e0b",
    durationMs: 7000,
  },
  {
    id: "cta",
    label: "Next Steps",
    icon: "calendar",
    narrationEN: "I hope you've enjoyed this tour, Sarah. I'd love to show you this vehicle in person. Let's schedule a time that works for you.",
    narrationES: "Espero que hayas disfrutado este recorrido, Sarah. Me encantaria mostrarte este vehiculo en persona. Programemos un horario que te funcione.",
    targetRotation: 360, // full rotation back to front
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
  
  // Spin viewer state
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartRotation, setDragStartRotation] = useState(0)
  const [oscillationOffset, setOscillationOffset] = useState(0)
  const [velocity, setVelocity] = useState(0)
  const [lastDragX, setLastDragX] = useState(0)
  const [lastDragTime, setLastDragTime] = useState(0)
  const [captionExpanded, setCaptionExpanded] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; angle: number; opacity: number }>>([])
  
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

  // Auto-spin for pre-tour mode (8° per second)
  useEffect(() => {
    if (!isTourActive) {
      autoSpinRef.current = setInterval(() => {
        setRotation(prev => (prev + 0.4) % 360) // ~8° per second at 50ms interval
      }, 50)
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

  // Oscillation effect when paused (±3° subtle movement)
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

  // Drag to rotate handlers with velocity tracking
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
      setVelocity(moveDelta / Math.max(timeDelta, 16) * 16) // normalize to ~60fps
    }
    setLastDragX(clientX)
    setLastDragTime(now)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    // Velocity is already set from handleDragMove, momentum effect will take over
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

  // Handle language change - restart current segment
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
      // When resuming, smoothly go back to target rotation
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

  // Calculate the display rotation (target + oscillation when paused)
  const displayRotation = isTourActive && !isPlaying ? rotation + oscillationOffset : rotation

  // Spin Viewer Component
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
      {/* Light streak particles following rotation */}
      {!autoSpin && particles.map(particle => (
        <div
          key={particle.id}
          className="absolute left-1/2 top-1/2 w-16 h-1 rounded-full pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${currentSegment.accentColor})`,
            opacity: particle.opacity * 0.6,
            transform: `translate(-50%, -50%) rotate(${particle.angle}deg) translateX(120px)`,
            filter: "blur(2px)",
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

      {/* Ground reflection - blurred, flipped, low opacity */}
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

      {/* Ground shadow - elliptical gradient */}
      <div 
        className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[70%] h-8 rounded-[100%] bg-black/40 blur-xl"
        style={{
          transform: `translateX(-50%) scaleX(${1 + Math.abs(Math.sin(displayRotation * Math.PI / 180)) * 0.2})`,
        }}
      />
    </div>
  )

  // Pre-tour landing view
  if (!isTourActive) {
    return (
      <section className="relative mx-5 my-6 overflow-hidden bg-[#0d1117]">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-[#0d1117]/80 to-[#0d1117]" />
        
        <div className="relative aspect-[4/5] flex flex-col items-center justify-between py-6 px-5">
          {/* Top - Personalization */}
          <div className="text-center z-10">
            <p className="text-[10px] tracking-[0.2em] text-[#c9a227] uppercase">
              Personalized for {buyerName}
            </p>
          </div>

          {/* Center - Spin Viewer */}
          <div className="flex-1 w-full relative my-3">
            <SpinViewer autoSpin />
          </div>

          {/* Vehicle Info & CTA */}
          <div className="flex flex-col items-center text-center z-10">
            <h2 className="font-serif text-[22px] text-white mb-0.5 leading-tight">{vehicleTitle}</h2>
            <p className="text-white/50 text-xs mb-5">
              ${price.toLocaleString()}
            </p>

            {/* Start Button with glow */}
            <button
              onClick={handleStartTour}
              className="group relative flex items-center gap-2.5 px-6 py-3 bg-[#c9a227] text-[#0d1117] text-sm uppercase tracking-[0.1em] transition-all hover:bg-[#d4af37]"
            >
              <span className="absolute inset-0 bg-[#c9a227] blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
              <Play className="relative h-4 w-4" fill="currentColor" />
              <span className="relative">Start Virtual Tour</span>
            </button>

            {/* Tour metadata */}
            <p className="mt-3 text-[10px] text-white/30 uppercase tracking-[0.15em]">
              AI-narrated · 6 features · ~90 sec
            </p>
          </div>

          {/* Bottom - Salesperson card */}
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-3 py-2.5 mt-4 z-10">
            <div className="h-9 w-9 rounded-full bg-[#c9a227] flex items-center justify-center text-[#0d1117] text-sm font-medium">
              {salespersonInitial}
            </div>
            <div>
              <p className="text-white text-[13px]">{salespersonName}</p>
              <p className="text-white/40 text-[11px]">{dealershipName}</p>
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
        <div className="absolute inset-0 z-50 bg-[#0d1117]/95 backdrop-blur-sm flex flex-col items-center justify-center px-5 animate-in fade-in duration-500">
          <div className="text-center">
            <p className="text-[10px] tracking-[0.2em] text-[#c9a227] uppercase mb-1.5">
              Tour Complete
            </p>
            <h2 className="font-serif text-[26px] text-white mb-2 leading-tight">
              Ready to see it in person?
            </h2>
            <p className="text-white/50 text-[13px] mb-6 max-w-[260px]">
              {salespersonName} is ready to show you this {vehicleTitle}
            </p>

            <div className="space-y-2.5 w-full max-w-[260px]">
              <button
                onClick={onBook}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#c9a227] text-[#0d1117] text-sm uppercase tracking-[0.1em] transition-colors hover:bg-[#d4af37]"
              >
                <Calendar className="h-4 w-4" />
                Book Appointment
              </button>
              
              {onCall && (
                <button
                  onClick={onCall}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-white/20 text-white text-sm uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
                >
                  <Phone className="h-4 w-4" />
                  Call {salespersonName.split(" ")[0]}
                </button>
              )}

              <button
                onClick={handleReplay}
                className="w-full flex items-center justify-center gap-2 py-2 text-white/40 text-xs uppercase tracking-wider hover:text-white transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Replay Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between px-3 py-2">
        <button
          onClick={handleExitTour}
          className="p-1.5 text-white/60 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <p className="text-white/80 text-xs uppercase tracking-[0.15em]">{vehicleTitle}</p>
        
        {/* Language Toggle */}
        <div className="flex bg-white/10 overflow-hidden">
          <button
            onClick={() => setLanguage("en")}
            className={`px-2 py-1 text-[10px] uppercase tracking-wider transition-colors ${
              language === "en" ? "bg-[#c9a227] text-[#0d1117]" : "text-white/50 hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("es")}
            className={`px-2 py-1 text-[10px] uppercase tracking-wider transition-colors ${
              language === "es" ? "bg-[#c9a227] text-[#0d1117]" : "text-white/50 hover:text-white"
            }`}
          >
            ES
          </button>
        </div>
      </div>

      {/* Segment Navigation - Named Tabs */}
      <div className="flex items-center gap-0.5 px-2 py-1 overflow-x-auto scrollbar-hide border-b border-white/5">
        {tourSegments.map((segment, index) => (
          <button
            key={segment.id}
            onClick={() => handleSegmentClick(index)}
            className={`flex-shrink-0 px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] transition-all duration-300 ${
              index === currentSegmentIndex
                ? "text-[#0d1117]"
                : "text-white/30 hover:text-white/60 bg-transparent"
            }`}
            style={{
              backgroundColor: index === currentSegmentIndex ? segment.accentColor : undefined,
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
          background: `radial-gradient(ellipse at center, ${currentSegment.accentColor}15, #0d1117)`,
        }}
      >
        {/* Floating Segment Label */}
        <div 
          className="absolute top-2 left-3 z-10 flex items-center gap-2 px-2 py-1 bg-black/40 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-500"
          style={{ borderLeft: `2px solid ${currentSegment.accentColor}` }}
        >
          <span className="text-[10px] text-white uppercase tracking-[0.15em]">
            {currentSegment.label}
          </span>
        </div>

        {/* Drag hint when paused */}
        {!isPlaying && !showCTA && (
          <div className="absolute top-2 right-3 z-10 px-2 py-1 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">
              Drag to rotate
            </span>
          </div>
        )}

        {/* Spin Viewer */}
        <SpinViewer />

        {/* Pulsing indicator for feature segments */}
        {currentSegmentIndex !== 0 && currentSegmentIndex !== tourSegments.length - 1 && (
          <div
            className="absolute z-10 pointer-events-none animate-pulse"
            style={{
              left: "50%",
              top: "45%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{
                backgroundColor: currentSegment.accentColor,
                boxShadow: `0 0 15px ${currentSegment.accentColor}, 0 0 30px ${currentSegment.accentColor}50`,
              }}
            />
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none" />
      </div>

      {/* Caption Area - Collapsible on mobile */}
      <div className="px-4 py-2">
        <div className="relative">
          <p 
            className={`text-white/80 text-[13px] leading-relaxed font-serif transition-all duration-300 ${
              !captionExpanded ? "line-clamp-2" : ""
            }`}
          >
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
          className="p-2 text-white/50 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={handlePlayPause}
          className="h-11 w-11 rounded-full flex items-center justify-center transition-all hover:scale-105"
          style={{ backgroundColor: currentSegment.accentColor }}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-[#0d1117]" fill="currentColor" />
          ) : (
            <Play className="h-5 w-5 text-[#0d1117] ml-0.5" fill="currentColor" />
          )}
        </button>

        <button
          onClick={handleNext}
          className="p-2 text-white/50 hover:text-white transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-0.5 bg-white/10">
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
