export function parsePauza(pauza: string): number | null {
  if (!pauza) return null
  const trimmed = pauza.trim().toLowerCase()

  // "1:30" format
  const colonMatch = trimmed.match(/^(\d+):(\d{2})$/)
  if (colonMatch) return parseInt(colonMatch[1]) * 60 + parseInt(colonMatch[2])

  // "2min", "2 min"
  const minMatch = trimmed.match(/^(\d+)\s*min/)
  if (minMatch) return parseInt(minMatch[1]) * 60

  // "90s", "90 s", "90sec", "90 sec", or just "90"
  const secMatch = trimmed.match(/^(\d+)\s*(s|sec)?$/)
  if (secMatch) return parseInt(secMatch[1])

  return null
}
