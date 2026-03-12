"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

interface DataPoint {
  datum: string
  kilaza: number
}

interface NapredakClientProps {
  exerciseData: Record<string, DataPoint[]>
}

export function NapredakClient({ exerciseData }: NapredakClientProps) {
  const exerciseNames = Object.keys(exerciseData)
  const [selected, setSelected] = useState(exerciseNames[0] || "")

  if (exerciseNames.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
        <p className="text-base font-medium">Nema podataka</p>
        <p className="text-sm mt-1">Nema podataka o kilazi za prikaz grafika</p>
      </div>
    )
  }

  const data = exerciseData[selected] || []

  const chartData = data.map((d) => ({
    datum: formatShortDate(d.datum),
    kg: d.kilaza,
  }))

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Izaberite vezbu
        </label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full rounded-xl border-transparent bg-muted/50 px-3 py-2.5 text-base focus:bg-background focus:border-ring focus:outline-none transition-colors"
        >
          {exerciseNames.map((name) => (
            <option key={name} value={name}>
              {name} ({exerciseData[name].length})
            </option>
          ))}
        </select>
      </div>

      {chartData.length < 2 ? (
        <div className="text-center py-16 text-muted-foreground">
          <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-base font-medium">Nedovoljno podataka</p>
          <p className="text-sm mt-1">Potrebne su bar 2 tacke za grafik</p>
        </div>
      ) : (
        <Card size="sm" className="overflow-visible">
          <CardContent className="p-3 min-w-0">
            <div className="w-full h-64 min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorKg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="datum"
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    unit=" kg"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--popover-foreground)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="kg"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorKg)"
                    dot={{ r: 4, fill: "#3b82f6" }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function formatShortDate(datum: string): string {
  const [, month, day] = datum.split("-")
  return `${parseInt(day)}.${parseInt(month)}.`
}
