export function parseKilaza(kilaza: string): number | null {
  if (!kilaza) return null
  const trimmed = kilaza.trim()

  // Handle range like "60-70" → take max
  const rangeMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/)
  if (rangeMatch) return parseFloat(rangeMatch[2])

  // Handle simple number
  const numMatch = trimmed.match(/^(\d+(?:\.\d+)?)/)
  if (numMatch) return parseFloat(numMatch[1])

  return null
}
