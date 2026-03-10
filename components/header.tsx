"use client"

import { ArrowLeft, Dumbbell } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  title: string
  backHref?: string
  showThemeToggle?: boolean
}

export function Header({ title, backHref, showThemeToggle }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-[env(safe-area-inset-top)]">
      <div className="flex h-14 items-center gap-3 px-4">
        {backHref ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => router.push(backHref)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <Dumbbell className="h-5 w-5 text-primary" />
        )}
        <h1 className="text-lg font-semibold truncate flex-1">{title}</h1>
        {showThemeToggle && <ThemeToggle />}
      </div>
    </header>
  )
}
