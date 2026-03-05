"use client"

import { useState, forwardRef } from "react"
import { Calendar, Clock, Check, ArrowLeft } from "lucide-react"
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

function getAvailableDates() {
  const dates = []
  const today = new Date()
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
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
    <section ref={ref} className="bg-secondary px-6 py-16">
      <div className="text-center mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-4">
          Schedule Your Visit
        </p>
        <h2 className="font-serif text-[1.75rem] leading-tight text-foreground text-balance">
          Book an Appointment
        </h2>
      </div>

      {/* Success State */}
      {step === "success" && (
        <div className="text-center py-8">
          <div className="h-14 w-14 rounded-full bg-foreground flex items-center justify-center mx-auto mb-6">
            <Check className="h-6 w-6 text-primary-foreground" />
          </div>
          <h3 className="font-serif text-2xl mb-3 text-foreground">
            {"You're All Set"}
          </h3>
          <p className="text-sm text-muted-foreground mb-1">
            {selectedDate && formatDateFull(selectedDate)} at {selectedTime}
          </p>
          <p className="text-sm text-muted-foreground">
            {"We'll send a confirmation to"} {formData.email}
          </p>
        </div>
      )}

      {/* Date Selection */}
      {step === "date" && (
        <div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6">
            <Calendar className="h-3.5 w-3.5" />
            <span className="uppercase tracking-[0.1em] font-medium">Select a date</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {availableDates.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => {
                  setSelectedDate(date)
                  setStep("time")
                }}
                className="p-4 bg-card border border-border text-center transition-all hover:border-foreground group rounded-sm"
              >
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground group-hover:text-foreground">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className="text-xl font-serif text-foreground mt-1">
                  {date.getDate()}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
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
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 hover:text-foreground transition-colors mx-auto font-medium"
          >
            <ArrowLeft className="h-3 w-3" />
            {formatDate(selectedDate)}
          </button>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-6">
            <Clock className="h-3.5 w-3.5" />
            <span className="uppercase tracking-[0.1em] font-medium">Select a time</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => {
                  setSelectedTime(time)
                  setStep("confirm")
                }}
                className="py-3 px-4 bg-card border border-border text-sm font-medium transition-all hover:border-foreground text-foreground rounded-sm"
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
            className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8 hover:text-foreground transition-colors mx-auto font-medium"
          >
            <ArrowLeft className="h-3 w-3" />
            {formatDate(selectedDate)} at {selectedTime}
          </button>

          <div className="space-y-6 mb-10">
            <div>
              <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-2.5 block text-center">
                Name
              </label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-12 px-4 bg-card border-b border-border text-center text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-2.5 block text-center">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-12 px-4 bg-card border-b border-border text-center text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground mb-2.5 block text-center">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-12 px-4 bg-card border-b border-border text-center text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="inline-flex items-center justify-center px-10 py-3.5 rounded-full bg-foreground text-primary-foreground text-xs font-semibold uppercase tracking-[0.1em] hover:opacity-90 transition-opacity"
            >
              Book Visit at {dealershipName}
            </button>
          </div>
        </div>
      )}
    </section>
  )
})
