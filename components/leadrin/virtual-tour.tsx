"use client"

import { VirtualTour, tourThemes } from "@/components/shared/virtual-tour"

interface ClassicVirtualTourProps {
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

export function ClassicVirtualTour(props: ClassicVirtualTourProps) {
  return <VirtualTour {...props} theme={tourThemes.classic} />
}
