import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const AVATAR_COLORS = [
  { bg: "bg-blue-500/20", text: "text-blue-400" },
  { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  { bg: "bg-violet-500/20", text: "text-violet-400" },
  { bg: "bg-amber-500/20", text: "text-amber-400" },
  { bg: "bg-rose-500/20", text: "text-rose-400" },
  { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  { bg: "bg-orange-500/20", text: "text-orange-400" },
  { bg: "bg-pink-500/20", text: "text-pink-400" },
  { bg: "bg-teal-500/20", text: "text-teal-400" },
  { bg: "bg-indigo-500/20", text: "text-indigo-400" },
]

export function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function getInitials(ime: string, prezime: string): string {
  return `${(ime[0] || "").toUpperCase()}${(prezime[0] || "").toUpperCase()}`
}
