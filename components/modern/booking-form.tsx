"use client"

import { useState } from "react"
import { Check, ArrowRight } from "lucide-react"

interface BookingFormProps {
  salespersonName: string
  buyerName: string
  buyerPhone?: string
  dealershipName: string
}

export function BookingForm({
  salespersonName,
  buyerName,
  dealershipName,
}: BookingFormProps) {
  const [step, setStep] = useState<"date" | "time" | "confirm" | "success">("date")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const firstName = salespersonName.split(" ")[0]

  const dates = [...Array(7)].map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      full: date.toISOString().split("T")[0],
    }
  })

  const times = ["9:00 AM", "10:30 AM", "12:00 PM", "2:00 PM", "3:30 PM", "5:00 PM"]

  return (
    <section id="booking" className="px-5 py-8 bg-slate-50">
      <p className="text-[10px] font-semibold tracking-widest text-blue-600 uppercase mb-1">Book a Visit</p>
      <h2 className="text-xl font-bold text-slate-900 mb-1">Meet at {dealershipName}</h2>
      <p className="text-sm text-slate-500 mb-6">{firstName} will confirm your appointment.</p>

      {/* Success */}
      {step === "success" && (
        <div className="bg-white rounded-2xl p-6 text-center">
          <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <Check className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">All set!</h3>
          <p className="text-sm text-slate-500">
            {firstName} will reach out to confirm your visit on {selectedDate} at {selectedTime}.
          </p>
        </div>
      )}

      {/* Date Selection */}
      {step === "date" && (
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-slate-900 mb-4">Pick a day</p>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {dates.slice(0, 4).map((date) => (
              <button
                key={date.full}
                onClick={() => setSelectedDate(date.full)}
                className={`p-3 rounded-xl text-center transition-all ${
                  selectedDate === date.full
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-slate-50 text-slate-900 hover:bg-slate-100"
                }`}
              >
                <p className={`text-[10px] font-medium ${selectedDate === date.full ? "text-blue-100" : "text-slate-400"}`}>
                  {date.dayName}
                </p>
                <p className="text-xl font-bold">{date.dayNum}</p>
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
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-slate-50 text-slate-900 hover:bg-slate-100"
                }`}
              >
                <p className={`text-[10px] font-medium ${selectedDate === date.full ? "text-blue-100" : "text-slate-400"}`}>
                  {date.dayName}
                </p>
                <p className="text-xl font-bold">{date.dayNum}</p>
              </button>
            ))}
          </div>
          {selectedDate && (
            <button
              onClick={() => setStep("time")}
              className="w-full h-12 mt-5 bg-slate-900 text-white font-semibold text-sm rounded-full flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Time Selection */}
      {step === "time" && (
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-slate-900 mb-4">Pick a time</p>
          <div className="grid grid-cols-2 gap-2 mb-5">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`h-12 rounded-xl text-sm font-medium transition-all ${
                  selectedTime === time
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "bg-slate-50 text-slate-900 hover:bg-slate-100"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          {selectedTime && (
            <button
              onClick={() => setStep("confirm")}
              className="w-full h-12 bg-slate-900 text-white font-semibold text-sm rounded-full flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Confirm */}
      {step === "confirm" && (
        <div className="bg-white rounded-2xl p-5">
          <p className="text-sm font-semibold text-slate-900 mb-4">Confirm your visit</p>
          <div className="space-y-3 mb-5 p-4 rounded-xl bg-slate-50">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Name</span>
              <span className="font-medium text-slate-900">{buyerName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Date</span>
              <span className="font-medium text-slate-900">{selectedDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Time</span>
              <span className="font-medium text-slate-900">{selectedTime}</span>
            </div>
          </div>
          <button
            onClick={() => setStep("success")}
            className="w-full h-12 bg-blue-600 text-white font-semibold text-sm rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
          >
            Confirm Appointment
          </button>
        </div>
      )}
    </section>
  )
}
