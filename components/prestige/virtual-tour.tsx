"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Play, Pause, Phone, Calendar, RotateCcw } from "lucide-react"
import Image from "next/image"

// 360 spin frames from Scaleflex CDN
const spinFrames = Array.from({ length: 36 }, (_, i) => 
  `https://scaleflex.cloudimg.io/v7/demo/360-car/car-${i + 1}.jpg`
)

// Tour segment data model with targetFrame for spin viewer (1-36)
// Frame mapping: 1 = front, 10 = right side, 19 = rear, 28 = left side
interface TourSegment {
  id: string
  label: string
  icon: string
  narrationEN: string
  narrationES: string
  targetFrame: number // frame 1-36 for vehicle spin
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
// Each segment has a targetFrame (1-36) to show the relevant angle
// Frame mapping: 1 = front, 10 = right side, 19 = rear, 28 = left side
const tourSegments: TourSegment[] = [
  {
    id: "welcome",
    label: "Welcome",
    icon: "hand-wave",
    narrationEN: "Welcome, Sarah. I'm excited to personally guide you through this exceptional vehicle. Let me show you why this could be the perfect match for you.",
    narrationES: "Bienvenida, Sarah. Estoy emocionado de guiarte personalmente a traves de este excepcional vehiculo. Dejame mostrarte por que este podria ser el auto perfecto para ti.",
    targetFrame: 1, // front view
    accentColor: "#c9a227",
    durationMs: 8000,
  },
  {
    id: "powertrain",
    label: "Powertrain",
    icon: "engine",
    narrationEN: "Under the hood, you'll find a refined powertrain that delivers both performance and efficiency. The smooth power delivery makes every drive a pleasure.",
    narrationES: "Bajo el capo, encontraras un tren motriz refinado que ofrece rendimiento y eficiencia. La entrega de potencia suave hace que cada viaje sea un placer.",
    targetFrame: 4, // front quarter angle
    accentColor: "#dc2626",
    durationMs: 7000,
  },
  {
    id: "interior",
    label: "Interior",
    icon: "armchair",
    narrationEN: "Step inside and experience true luxury. Premium materials, meticulous craftsmanship, and thoughtful design create an environment you'll love spending time in.",
    narrationES: "Entra y experimenta el verdadero lujo. Materiales premium, artesania meticulosa y diseno pensado crean un ambiente en el que te encantara pasar tiempo.",
    targetFrame: 10, // side view
    accentColor: "#7c3aed",
    durationMs: 7000,
  },
  {
    id: "technology",
    label: "Technology",
    icon: "cpu",
    narrationEN: "Advanced technology keeps you connected and in control. The intuitive interface and premium audio system make every journey more enjoyable.",
    narrationES: "La tecnologia avanzada te mantiene conectado y en control. La interfaz intuitiva y el sistema de audio premium hacen que cada viaje sea mas agradable.",
    targetFrame: 13, // slightly past side view
    accentColor: "#0ea5e9",
    durationMs: 7000,
  },
  {
    id: "safety",
    label: "Safety",
    icon: "shield",
    narrationEN: "Your safety is paramount. This vehicle comes equipped with a comprehensive suite of advanced safety features to protect you and your loved ones.",
    narrationES: "Tu seguridad es primordial. Este vehiculo viene equipado con un conjunto completo de funciones de seguridad avanzadas para protegerte a ti y a tus seres queridos.",
    targetFrame: 16, // rear quarter angle
    accentColor: "#22c55e",
    durationMs: 7000,
  },
  {
    id: "cargo",
    label: "Versatility",
    icon: "package",
    narrationEN: "Generous cargo space and flexible configurations adapt to your lifestyle. Whether it's a weekend getaway or daily errands, you'll have room for it all.",
    narrationES: "Amplio espacio de carga y configuraciones flexibles se adaptan a tu estilo de vida. Ya sea una escapada de fin de semana o recados diarios, tendras espacio para todo.",
    targetFrame: 19, // rear view
    accentColor: "#f59e0b",
    durationMs: 7000,
  },
  {
    id: "cta",
    label: "Next Steps",
    icon: "calendar",
    narrationEN: "I hope you've enjoyed this tour, Sarah. I'd love to show you this vehicle in person. Let's schedule a time that works for you.",
    narrationES: "Espero que hayas disfrutado este recorrido, Sarah. Me encantaria mostrarte este vehiculo en persona. Programemos un horario que te funcione.",
    targetFrame: 1, // back to front
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
  
  // Spin viewer state - frame-based (1-36)
  const [currentFrame, setCurrentFrame] = useState(1)
  const [prevFrame, setPrevFrame] = useState(1)
  const [crossfadeOpacity, setCrossfadeOpacity] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartFrame, setDragStartFrame] = useState(1)
  const [velocity, setVelocity] = useState(0)
  const [lastDragX, setLastDragX] = useState(0)
  const [lastDragTime, setLastDragTime] = useState(0)
  const [captionExpanded, setCaptionExpanded] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; frame: number; opacity: number }>>([])
  const [framesLoaded, setFramesLoaded] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const autoSpinRef = useRef<NodeJS.Timeout | null>(null)
  const oscillationRef = useRef<NodeJS.Timeout | null>(null)
  const spinContainerRef = useRef<HTMLDivElement>(null)
  const preloadedImages = useRef<HTMLImageElement[]>([])
  
  // Helper: wrap frame index 1-36
  const wrapFrame = (frame: number): number => {
    const wrapped = ((frame - 1) % 36 + 36) % 36 + 1
    return wrapped
  }
  
  // Crossfade between frames
  const transitionToFrame = useCallback((newFrame: number) => {
    const wrappedFrame = wrapFrame(newFrame)
    if (wrappedFrame !== currentFrame) {
      setPrevFrame(currentFrame)
      setCrossfadeOpacity(0)
      setCurrentFrame(wrappedFrame)
      // Fade in new frame
      setTimeout(() => setCrossfadeOpacity(1), 10)
    }
  }, [currentFrame])

  const currentSegment = tourSegments[currentSegmentIndex]
  const narrationText = language === "en" ? currentSegment.narrationEN : currentSegment.narrationES

  // Preload all 36 frames on mount
  useEffect(() => {
    let loadedCount = 0
    const images: HTMLImageElement[] = []
    
    spinFrames.forEach((src, index) => {
      const img = new window.Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        loadedCount++
        setLoadingProgress(Math.round((loadedCount / 36) * 100))
        if (loadedCount === 36) {
          setFramesLoaded(true)
        }
      }
      img.onerror = () => {
        loadedCount++
        setLoadingProgress(Math.round((loadedCount / 36) * 100))
        if (loadedCount === 36) {
          setFramesLoaded(true)
        }
      }
      img.src = src
      images[index] = img
    })
    
    preloadedImages.current = images
  }, [])

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

  // Auto-spin for pre-tour mode - cycle through frames at ~100ms intervals
  useEffect(() => {
    if (!isTourActive && framesLoaded) {
      autoSpinRef.current = setInterval(() => {
        setCurrentFrame(prev => wrapFrame(prev + 1))
      }, 100)
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
  }, [isTourActive, framesLoaded])

  // Oscillation effect when paused - alternate ±1 frame every 2 seconds
  const baseFrameRef = useRef(currentFrame)
  useEffect(() => {
    if (isTourActive && !isPlaying && !isDragging && framesLoaded) {
      baseFrameRef.current = currentFrame
      let direction = 1
      oscillationRef.current = setInterval(() => {
        const newFrame = wrapFrame(baseFrameRef.current + direction)
        setCurrentFrame(newFrame)
        direction *= -1
      }, 2000)
    } else {
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
  }, [isTourActive, isPlaying, isDragging, framesLoaded])

  // Smoothly advance to target frame when segment changes
  useEffect(() => {
    if (isTourActive && isPlaying && !isDragging && framesLoaded) {
      const target = currentSegment.targetFrame
      let current = currentFrame
      
      // If already at target, skip
      if (current === target) return
      
      const advanceInterval = setInterval(() => {
        if (current === target) {
          clearInterval(advanceInterval)
          return
        }
        // Determine direction for shortest path
        let diff = target - current
        if (Math.abs(diff) > 18) {
          // Wrap around is shorter
          diff = diff > 0 ? diff - 36 : diff + 36
        }
        const step = diff > 0 ? 1 : -1
        current = wrapFrame(current + step)
        setCurrentFrame(current)
      }, 80) // ~12.5 fps for smooth advance
      
      return () => clearInterval(advanceInterval)
    }
  }, [currentSegmentIndex, isTourActive, isPlaying, isDragging, framesLoaded, currentSegment.targetFrame])

  // Momentum/inertia effect - decelerate after flick (frame-based)
  useEffect(() => {
    if (!isDragging && Math.abs(velocity) > 0.3) {
      let vel = velocity
      let accumulatedDelta = 0
      
      const momentumInterval = setInterval(() => {
        vel *= 0.92 // friction
        accumulatedDelta += vel
        
        // Every 15px of accumulated movement = 1 frame change
        if (Math.abs(accumulatedDelta) >= 15) {
          const frameChange = Math.sign(accumulatedDelta)
          accumulatedDelta = 0
          transitionToFrame(currentFrame + frameChange)
          
          // Add particle trail during momentum
          if (Math.abs(vel) > 1) {
            setParticles(prev => [
              ...prev.slice(-8),
              { id: Date.now(), frame: currentFrame, opacity: Math.min(Math.abs(vel) / 5, 1) }
            ])
          }
        }
        
        if (Math.abs(vel) < 0.3) {
          clearInterval(momentumInterval)
          setVelocity(0)
        } else {
          setVelocity(vel)
        }
      }, 16)
      return () => clearInterval(momentumInterval)
    }
  }, [isDragging, velocity, currentFrame, transitionToFrame])

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

  // Drag to rotate handlers - map ~15px drag to ±1 frame change
  const handleDragStart = (clientX: number) => {
    if (!isTourActive || isPlaying || !framesLoaded) return
    setIsDragging(true)
    setVelocity(0)
    setDragStartX(clientX)
    setDragStartFrame(currentFrame)
    setLastDragX(clientX)
    setLastDragTime(Date.now())
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    const totalDelta = clientX - dragStartX
    // Every 15px = 1 frame change
    const frameChange = Math.round(totalDelta / 15)
    const newFrame = wrapFrame(dragStartFrame + frameChange)
    if (newFrame !== currentFrame) {
      transitionToFrame(newFrame)
    }
    
    // Track velocity for momentum
    const now = Date.now()
    const timeDelta = now - lastDragTime
    if (timeDelta > 0) {
      const moveDelta = clientX - lastDragX
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
    transitionToFrame(1)
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
      // When resuming, smoothly go back to target frame
      transitionToFrame(currentSegment.targetFrame)
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
    transitionToFrame(1)
    setIsPlaying(true)
  }

  const handleSegmentClick = (index: number) => {
    cleanup()
    setCurrentSegmentIndex(index)
    setShowCTA(false)
    setIsPlaying(true)
  }

  // Spin Viewer Component - Frame-based 360 viewer
  const SpinViewer = ({ autoSpin = false }: { autoSpin?: boolean }) => {
    // Calculate frame angle for particle positioning
    const frameAngle = (currentFrame - 1) * 10 // 36 frames = 360 degrees
    
    return (
      <div 
        ref={spinContainerRef}
        className={`relative w-full h-full flex items-center justify-center ${!autoSpin && !isPlaying ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onMouseDown={!autoSpin ? onMouseDown : undefined}
        onMouseMove={!autoSpin ? onMouseMove : undefined}
        onMouseUp={!autoSpin ? onMouseUp : undefined}
        onMouseLeave={!autoSpin ? onMouseLeave : undefined}
        onTouchStart={!autoSpin ? onTouchStart : undefined}
        onTouchMove={!autoSpin ? onTouchMove : undefined}
        onTouchEnd={!autoSpin ? onTouchEnd : undefined}
      >
        {/* Loading indicator */}
        {!framesLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1117] z-20">
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#c9a227] transition-all duration-200"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-white/40 font-mono">Loading 360° view... {loadingProgress}%</p>
          </div>
        )}

        {/* Light streak particles following rotation */}
        {!autoSpin && particles.map(particle => (
          <div
            key={particle.id}
            className="absolute left-1/2 top-1/2 w-20 h-0.5 rounded-full pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, ${currentSegment.accentColor})`,
              opacity: particle.opacity * 0.5,
              transform: `translate(-50%, -50%) rotate(${particle.frame * 10}deg) translateX(100px)`,
              filter: "blur(1px)",
            }}
          />
        ))}

        {/* Vehicle frames with crossfade */}
        <div className="relative w-[90%] aspect-[16/10]">
          {/* Previous frame (for crossfade) */}
          {prevFrame !== currentFrame && framesLoaded && (
            <img
              src={spinFrames[prevFrame - 1]}
              alt=""
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{ opacity: 1 - crossfadeOpacity }}
            />
          )}
          {/* Current frame */}
          {framesLoaded && (
            <img
              src={spinFrames[currentFrame - 1]}
              alt={vehicleTitle}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-150"
              style={{ opacity: crossfadeOpacity }}
            />
          )}
        </div>

        {/* Ground reflection */}
        {framesLoaded && (
          <div 
            className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[85%] h-[25%] overflow-hidden opacity-15 blur-[2px] pointer-events-none"
            style={{ 
              transform: "translateX(-50%) scaleY(-1)",
              maskImage: "linear-gradient(to top, black 0%, transparent 70%)",
              WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 70%)",
            }}
          >
            <img
              src={spinFrames[currentFrame - 1]}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Ground shadow */}
        <div 
          className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[65%] h-6 rounded-[100%] bg-black/30 blur-xl pointer-events-none"
        />

        {/* Drag hint when paused */}
        {!autoSpin && !isPlaying && framesLoaded && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/30 text-xs font-mono">
            <span>← Drag to rotate →</span>
          </div>
        )}
      </div>
    )
  }

  // Pre-tour landing view
  if (!isTourActive) {
    return (
      <section className="relative mx-5 my-8 overflow-hidden rounded-sm bg-[#0d1117]">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-[#0d1117]/80 to-[#0d1117]" />
        
        <div className="relative aspect-[4/5] flex flex-col items-center justify-between py-8 px-6">
          {/* Top - Personalization */}
          <div className="text-center z-10">
            <p className="text-xs tracking-[0.25em] text-[#c9a227] uppercase font-mono">
              Personalized for {buyerName}
            </p>
          </div>

          {/* Center - Spin Viewer */}
          <div className="flex-1 w-full relative my-4">
            <SpinViewer autoSpin />
          </div>

          {/* Vehicle Info & CTA */}
          <div className="flex flex-col items-center text-center z-10">
            <h2 className="font-serif text-2xl text-white mb-1">{vehicleTitle}</h2>
            <p className="text-white/60 text-sm mb-6">
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
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-sm mt-6 z-10">
            <div className="h-10 w-10 rounded-full bg-[#c9a227] flex items-center justify-center text-[#0d1117] font-semibold">
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

      {/* Segment Navigation - Named Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-hide">
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

        {/* Drag hint when paused */}
        {!isPlaying && !showCTA && (
          <div className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-sm animate-in fade-in duration-500">
            <span className="text-xs text-white/50 font-mono">
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
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none" />
      </div>

      {/* Caption Area - Collapsible on mobile */}
      <div className="px-6 py-3">
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
