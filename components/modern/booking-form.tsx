"use client"

import { useState } from "react"
import { Calendar, Clock, Check, ArrowRight } from "lucide-react"

interface BookingFormProps {
  salespersonName: string
  buyerName: string
  buyerPhone?: string
  dealershipName: string
}

export function BookingForm({
  salespersonName,
  buyerName,
  buyerPhone,
  dealershipName,
}: BookingFormProps) {
  const [step, setStep] = useState<"date" | "time" | "confirm" | "success">("date")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const firstName = salespersonName.split(" ")[0]

  // Generate next 7 days
  const dates = [...Array(7)].map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: date.getDate(),
      full: date.toISOString().split("T")[0],
    }
  })

  const times = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]

  const handleConfirm = () => {
    setStep("success")
  }

  return (
    <section id="booking" className="bg-gradient-to-br from-violet-50 via-indigo-50 to-white px-6 py-8">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
        <h2 className="text-xl font-semibold text-foreground">Schedule a visit</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Book a time to meet with {firstName} at {dealershipName}.
      </p>

      {/* Success State */}
      {step === "success" && (
        <div className="bg-white rounded-xl p-6 text-center border border-violet-100">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Check className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            {"You're all set!"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {firstName} will confirm your appointment for {selectedDate} at {selectedTime}.
          </p>
        </div>
      )}

      {/* Date Selection */}
      {step === "date" && (
        <div className="bg-white rounded-xl p-5 border border-violet-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-violet-600" />
            <span className="text-sm font-medium text-foreground">Select a date</span>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {dates.slice(0, 4).map((date) => (
              <button
                key={date.full}
                onClick={() => setSelectedDate(date.full)}
                className={`p-3 rounded-xl text-center transition-all ${
                  selectedDate === date.full
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    : "bg-secondary hover:bg-violet-50 text-foreground"
                }`}
              >
                <p className="text-xs opacity-70">{date.dayName}</p>
                <p className="text-lg font-semibold">{date.dayNum}</p>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {dates.slice(4).map((date) => (
              <button
                key={date.full}
                onClick={() => setSelectedDate(date.full)}
                className={`p-3 rounded-xl text-center transition-all ${
                  selectedDate === date.full
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    : "bg-secondary hover:bg-violet-50 text-foreground"
                }`}
              >
                <p className="text-xs opacity-70">{date.dayName}</p>
                <p className="text-lg font-semibold">{date.dayNum}</p>
              </button>
            ))}
          </div>
          {selectedDate && (
            <button
              onClick={() => setStep("time")}
              className="w-full mt-4 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Time Selection */}
      {step === "time" && (
        <div className="bg-white rounded-xl p-5 border border-violet-100">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-violet-600" />
            <span className="text-sm font-medium text-foreground">Select a time</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  selectedTime === time
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    : "bg-secondary hover:bg-violet-50 text-foreground"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          {selectedTime && (
            <button
              onClick={() => setStep("confirm")}
              className="w-full py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Confirmation */}
      {step === "confirm" && (
        <div className="bg-white rounded-xl p-5 border border-violet-100">
          <h3 className="text-sm font-medium text-foreground mb-4">Confirm your details</h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium text-foreground">{buyerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium text-foreground">{selectedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time</span>
              <span className="font-medium text-foreground">{selectedTime}</span>
            </div>
            {buyerPhone && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium text-foreground">{buyerPhone}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleConfirm}
            className="w-full py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium text-sm"
          >
            Confirm Appointment
          </button>
        </div>
      )}
    </section>
  )
}
