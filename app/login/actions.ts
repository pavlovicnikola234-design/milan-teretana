"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function verifyPin(pin: string): Promise<{ error?: string }> {
  const correctPin = process.env.APP_PIN

  if (!correctPin) {
    return { error: "PIN nije konfigurisan" }
  }

  if (pin !== correctPin) {
    return { error: "Pogresan PIN" }
  }

  const cookieStore = await cookies()
  cookieStore.set("auth-pin", "verified", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  })

  redirect("/vezbaci")
}
