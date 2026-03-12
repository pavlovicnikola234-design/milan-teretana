"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { searchLibrary } from "@/app/vezbaci/[id]/trening/[datum]/library-actions"
import type { BibliotekaVezba } from "@/lib/types"

interface ExerciseSearchProps {
  defaultValue?: string
  onSelect: (exercise: BibliotekaVezba) => void
  name: string
  id: string
  required?: boolean
  placeholder?: string
}

export function ExerciseSearch({
  defaultValue = "",
  onSelect,
  name,
  id,
  required,
  placeholder,
}: ExerciseSearchProps) {
  const [query, setQuery] = useState(defaultValue)
  const [results, setResults] = useState<BibliotekaVezba[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleChange(value: string) {
    setQuery(value)
    if (timerRef.current) clearTimeout(timerRef.current)

    if (value.length < 2) {
      setResults([])
      setShowDropdown(false)
      return
    }

    timerRef.current = setTimeout(async () => {
      const data = await searchLibrary(value)
      setResults(data)
      setShowDropdown(data.length > 0)
    }, 300)
  }

  function handleSelect(exercise: BibliotekaVezba) {
    setQuery(exercise.naziv)
    setShowDropdown(false)
    onSelect(exercise)
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        name={name}
        required={required}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        placeholder={placeholder}
        className="text-base"
        autoComplete="off"
      />
      {showDropdown && (
        <div className="absolute z-50 top-full mt-1 w-full rounded-md border bg-popover shadow-md max-h-48 overflow-y-auto">
          {results.map((exercise) => (
            <button
              key={exercise.id}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
              onClick={() => handleSelect(exercise)}
            >
              <span className="font-medium">{exercise.naziv}</span>
              {exercise.default_serije && exercise.default_ponavljanja && (
                <span className="text-muted-foreground ml-2">
                  {exercise.default_serije}x{exercise.default_ponavljanja}
                  {exercise.default_kilaza ? ` ${exercise.default_kilaza}kg` : ""}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
