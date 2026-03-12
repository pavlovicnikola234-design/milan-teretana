"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, Pause, RotateCcw, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RestTimerProps {
  seconds: number
}

function playBeep() {
  try {
    const ctx = new AudioContext()
    const playTone = (delay: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 800
      gain.gain.value = 0.3
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + 0.15)
    }
    playTone(0)
    playTone(0.25)
    playTone(0.5)
    setTimeout(() => ctx.close(), 1000)
  } catch {
    // Audio not supported
  }
}

export function RestTimer({ seconds }: RestTimerProps) {
  const [state, setState] = useState<"idle" | "running" | "paused" | "finished">("idle")
  const [remaining, setRemaining] = useState(seconds)
  const startTimeRef = useRef<number>(0)
  const remainingAtPauseRef = useRef<number>(seconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  function startTimer(fromSeconds: number) {
    clearTimer()
    startTimeRef.current = Date.now()
    remainingAtPauseRef.current = fromSeconds
    setState("running")

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const left = Math.max(0, remainingAtPauseRef.current - elapsed)
      setRemaining(Math.ceil(left))

      if (left <= 0) {
        clearTimer()
        setState("finished")
        setRemaining(0)
        playBeep()
      }
    }, 100)
  }

  function handlePlay() {
    if (state === "idle") {
      startTimer(seconds)
    } else if (state === "paused") {
      startTimer(remaining)
    }
  }

  function handlePause() {
    clearTimer()
    setState("paused")
  }

  function handleReset() {
    clearTimer()
    setRemaining(seconds)
    setState("idle")
  }

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const timeStr = mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")}` : `${secs}s`
  const progress = state === "idle" ? 100 : (remaining / seconds) * 100

  if (state === "idle") {
    return (
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-sm text-muted-foreground px-3"
          onClick={handlePlay}
        >
          <Timer className="h-3.5 w-3.5" />
          Pauza
          <Play className="h-3.5 w-3.5" />
          {timeStr}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <Timer className="h-3.5 w-3.5" />
          Pauza
        </span>
        <div className="flex items-center gap-1.5 bg-muted/50 rounded-md px-2.5 py-1.5">
          <div className="relative w-20 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-200 ${
                state === "finished" ? "bg-green-500 animate-pulse" : "bg-primary"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={`text-sm font-mono min-w-[2.5rem] text-center ${
            state === "finished" ? "text-green-500 font-bold" : "text-muted-foreground"
          }`}>
            {state === "finished" ? "Done!" : timeStr}
          </span>
        </div>
        {state === "running" && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePause}>
            <Pause className="h-3.5 w-3.5" />
          </Button>
        )}
        {state === "paused" && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePlay}>
            <Play className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleReset}>
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
