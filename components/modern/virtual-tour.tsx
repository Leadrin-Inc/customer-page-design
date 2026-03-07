"use client"

import { VirtualTour, tourThemes } from "@/components/shared/virtual-tour"

interface ModernVirtualTourProps {
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

export function ModernVirtualTour(props: ModernVirtualTourProps) {
  return <VirtualTour {...props} theme={tourThemes.modern} />
}
