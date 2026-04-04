'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface WeekData {
  week: string
  published: number
  target: number
}

interface ConsistencyChartProps {
  data: WeekData[]
}

export function ConsistencyChart({ data }: ConsistencyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
            fontSize: '12px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          formatter={(value: number, name: string) => [
            value,
            name === 'published' ? 'Publiés' : 'Objectif',
          ]}
        />
        {/* Barre objectif (fond) */}
        <Bar dataKey="target" fill="hsl(var(--border))" radius={[4, 4, 0, 0]} />
        {/* Barre publications */}
        <Bar dataKey="published" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.published >= entry.target
                  ? '#22c55e'
                  : entry.published > 0
                  ? 'hsl(var(--primary))'
                  : 'hsl(var(--muted))'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
