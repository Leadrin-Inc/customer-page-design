"use client"

import { useState, forwardRef } from "react"
import { Calendar, Clock, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface BookingFormProps {
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  dealershipName: string
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
]

// Generate next 7 available days
function getAvailableDates() {
  const dates = []
  const today = new Date()
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    // Skip Sundays
    if (date.getDay() !== 0) {
      dates.push(date)
    }
  }
  return dates.slice(0, 6)
}

export const BookingForm = forwardRef<HTMLElement, BookingFormProps>(function BookingForm(
  { buyerName, buyerEmail, buyerPhone, dealershipName },
  ref
) {
  const [step, setStep] = useState<"date" | "time" | "confirm" | "success">("date")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: buyerName,
    email: buyerEmail,
    phone: buyerPhone,
  })

  const availableDates = getAvailableDates()

  const handleSubmit = () => {
    // In production, this would submit to an API
    setStep("success")
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <section ref={ref} className="px-5 py-8 bg-muted">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        Schedule Your Visit
      </p>
      <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
        Book an Appointment
      </h2>

      {/* Success State */}
      {step === "success" && (
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-primary-foreground" />
          </div>
          <h3 className="font-serif text-xl font-medium text-foreground mb-2">
            You're All Set!
          </h3>
          <p className="text-sm text-muted-foreground mb-1">
            {selectedDate && formatDateFull(selectedDate)} at {selectedTime}
          </p>
          <p className="text-sm text-muted-foreground">
            We'll send a confirmation to {formData.email}
          </p>
        </div>
      )}

      {/* Date Selection */}
      {step === "date" && (
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>Select a date</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {availableDates.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => {
                  setSelectedDate(date)
                  setStep("time")
                }}
                className={cn(
                  "p-3 rounded-lg border text-center transition-colors",
                  "hover:border-foreground hover:bg-card",
                  "border-border bg-card"
                )}
              >
                <p className="text-xs text-muted-foreground">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className="text-lg font-semibold text-foreground">
                  {date.getDate()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Time Selection */}
      {step === "time" && selectedDate && (
        <div>
          <button
            onClick={() => setStep("date")}
            className="text-sm text-muted-foreground mb-4 hover:text-foreground"
          >
            ← {formatDate(selectedDate)}
          </button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4" />
            <span>Select a time</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => {
                  setSelectedTime(time)
                  setStep("confirm")
                }}
                className={cn(
                  "py-3 px-4 rounded-lg border text-sm font-medium transition-colors",
                  "hover:border-foreground hover:bg-card",
                  "border-border bg-card text-foreground"
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation */}
      {step === "confirm" && selectedDate && selectedTime && (
        <div>
          <button
            onClick={() => setStep("time")}
            className="text-sm text-muted-foreground mb-4 hover:text-foreground"
          >
            ← {formatDate(selectedDate)} at {selectedTime}
          </button>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 bg-card"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 bg-card"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Phone
              </label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-12 bg-card"
              />
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full h-14 text-base font-semibold">
            Book Visit at {dealershipName}
          </Button>
        </div>
      )}
    </section>
  )
})
