import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { currentWeek, shiftWeek } from './week'

interface WeekApi {
  week: string
  next: () => void
  previous: () => void
  goToCurrent: () => void
}

const WeekContext = createContext<WeekApi | null>(null)

/** A semana escolhida é compartilhada pelas três telas. */
export function WeekProvider({ children }: { children: ReactNode }) {
  const [week, setWeek] = useState(currentWeek)

  const api = useMemo<WeekApi>(
    () => ({
      week,
      next: () => setWeek((current) => shiftWeek(current, 1)),
      previous: () => setWeek((current) => shiftWeek(current, -1)),
      goToCurrent: () => setWeek(currentWeek()),
    }),
    [week],
  )

  return <WeekContext.Provider value={api}>{children}</WeekContext.Provider>
}

export function useWeek(): WeekApi {
  const context = useContext(WeekContext)
  if (!context) {
    throw new Error('useWeek precisa estar dentro de <WeekProvider>')
  }
  return context
}
