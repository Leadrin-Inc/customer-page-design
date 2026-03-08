"use client"

import { VirtualTour, tourThemes } from "@/components/shared/virtual-tour"

interface PrestigeVirtualTourProps {
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

export function PrestigeVirtualTour(props: PrestigeVirtualTourProps) {
  return <VirtualTour {...props} theme={tourThemes.prestige} />
}
