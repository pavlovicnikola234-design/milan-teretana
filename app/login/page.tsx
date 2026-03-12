"use client"

import { useState, useRef, useEffect } from "react"
import { Dumbbell } from "lucide-react"
import { verifyPin } from "./actions"

export default function LoginPage() {
  const [digits, setDigits] = useState(["", "", "", ""])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return

    const newDigits = [...digits]
    newDigits[index] = value.slice(-1)
    setDigits(newDigits)
    setError("")

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    if (value && index === 3) {
      const pin = newDigits.join("")
      if (pin.length === 4) {
        submitPin(pin)
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4)
    if (pasted.length === 4) {
      const newDigits = pasted.split("")
      setDigits(newDigits)
      submitPin(pasted)
    }
  }

  async function submitPin(pin: string) {
    setLoading(true)
    const result = await verifyPin(pin)
    if (result?.error) {
      setError(result.error)
      setDigits(["", "", "", ""])
      inputRefs.current[0]?.focus()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-xs text-center space-y-8">
        {/* App Branding */}
        <div className="space-y-3">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Dumbbell className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Plan Treninga</h1>
            <p className="text-sm text-muted-foreground mt-1">Dobrodosli</p>
          </div>
        </div>

        {/* PIN Card */}
        <div className="bg-card ring-1 ring-foreground/10 rounded-2xl p-6 space-y-5">
          <p className="text-sm font-medium text-muted-foreground">Unesite PIN</p>

          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={loading}
                className="w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 border-muted bg-muted/30 focus:border-primary focus:bg-background focus:outline-none transition-colors disabled:opacity-50"
              />
            ))}
          </div>

          {error && (
            <div className="inline-flex items-center rounded-lg bg-destructive/10 px-3 py-1.5 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          {loading && (
            <p className="text-muted-foreground text-sm">Proveravam...</p>
          )}
        </div>
      </div>
    </div>
  )
}
