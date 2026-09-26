/** A semana é sempre identificada pela sua segunda-feira, no formato aaaa-MM-dd. */

function toIso(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseIso(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function mondayOf(date: Date): string {
  const copy = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  // getDay(): 0 = domingo. A segunda anterior fica a (dia + 6) % 7 dias atrás.
  copy.setDate(copy.getDate() - ((copy.getDay() + 6) % 7))
  return toIso(copy)
}

export function currentWeek(): string {
  return mondayOf(new Date())
}

export function shiftWeek(week: string, weeks: number): string {
  const date = parseIso(week)
  date.setDate(date.getDate() + weeks * 7)
  return toIso(date)
}

/** "31/08 a 06/09" — o intervalo coberto pela semana, para exibir no cabeçalho. */
export function formatWeekRange(week: string): string {
  const start = parseIso(week)
  const end = parseIso(week)
  end.setDate(end.getDate() + 6)

  const short = (date: Date) =>
    `${`${date.getDate()}`.padStart(2, '0')}/${`${date.getMonth() + 1}`.padStart(2, '0')}`

  return `${short(start)} a ${short(end)}`
}

export function isCurrentWeek(week: string): boolean {
  return week === currentWeek()
}
