"use client"

import { useState } from "react"
import { Share2, Check, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generateShareToken, regenerateShareToken } from "@/app/vezbaci/[id]/share-actions"

interface ShareButtonProps {
  vezbacId: string
  existingToken: string | null
}

export function ShareButton({ vezbacId, existingToken }: ShareButtonProps) {
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [hasToken, setHasToken] = useState(!!existingToken)

  async function handleShare() {
    setLoading(true)
    try {
      const token = await generateShareToken(vezbacId)
      const url = `${window.location.origin}/plan/${token}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setHasToken(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert("Greska pri kreiranju linka.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegenerate() {
    setLoading(true)
    try {
      const token = await regenerateShareToken(vezbacId)
      const url = `${window.location.origin}/plan/${token}`
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert("Greska pri regenerisanju linka.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={handleShare}
        disabled={loading}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Kopirano!
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" />
            {loading ? "..." : hasToken ? "Kopiraj link" : "Podeli plan"}
          </>
        )}
      </Button>
      {hasToken && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleRegenerate}
          disabled={loading}
          title="Novi link (ponisti stari)"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  )
}
