export const DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'] as const
export const MEAL_TYPES = ['CAFE', 'ALMOCO', 'JANTAR'] as const

export type DayOfWeek = (typeof DAYS)[number]
export type MealType = (typeof MEAL_TYPES)[number]

export const DAY_LABELS: Record<DayOfWeek, string> = {
  SEG: 'Segunda',
  TER: 'Terça',
  QUA: 'Quarta',
  QUI: 'Quinta',
  SEX: 'Sexta',
  SAB: 'Sábado',
  DOM: 'Domingo',
}

export const MEAL_LABELS: Record<MealType, string> = {
  CAFE: 'Café da manhã',
  ALMOCO: 'Almoço',
  JANTAR: 'Jantar',
}

export interface MealSearchResult {
  mealId: string
  mealName: string
  thumbnailUrl: string | null
  category: string | null
  area: string | null
}

export interface MenuItem {
  id: number
  dayOfWeek: DayOfWeek
  mealType: MealType
  mealId: string
  mealName: string
  thumbnailUrl: string | null
  servings: number
  weekRef: string
}

export interface ShoppingListItem {
  ingredient: string
  quantity: string | null
  checked: boolean
  recipes: string[]
}

/** Corpo de erro padronizado devolvido pela API. */
export interface ApiErrorBody {
  timestamp: string
  status: number
  error: string
  message: string
  details?: string[]
}
