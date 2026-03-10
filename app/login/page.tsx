"use client"

import { useState, useRef, useEffect } from "react"
import { Lock } from "lucide-react"
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

    // Auto-submit when all 4 digits entered
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
        <div className="space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-semibold">Unesite PIN</h1>
        </div>

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
              className="w-14 h-16 text-center text-2xl font-bold rounded-lg border-2 border-input bg-background focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
            />
          ))}
        </div>

        {error && (
          <p className="text-destructive text-sm font-medium">{error}</p>
        )}

        {loading && (
          <p className="text-muted-foreground text-sm">Proveravam...</p>
        )}
      </div>
    </div>
  )
}
