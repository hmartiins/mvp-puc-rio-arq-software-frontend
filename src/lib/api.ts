import type {
  DayOfWeek,
  ApiErrorBody,
  MealSearchResult,
  MealType,
  MenuItem,
  ShoppingListItem,
} from '../types'

const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080').replace(/\/$/, '')

/** Erro de API já com a mensagem que a própria API mandou, pronta para virar toast. */
export class ApiError extends Error {
  readonly status: number
  readonly details: string[]

  constructor(status: number, message: string, details: string[] = []) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: init?.body ? { 'Content-Type': 'application/json', ...init?.headers } : init?.headers,
    })
  } catch {
    throw new ApiError(0, 'Não foi possível falar com a API. Ela está no ar?')
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null
    throw new ApiError(
      response.status,
      body?.message ?? `Erro ${response.status} ao chamar a API`,
      body?.details ?? [],
    )
  }

  return response.status === 204 ? (undefined as T) : ((await response.json()) as T)
}

export const api = {
  searchMeals: (query: string) =>
    request<MealSearchResult[]>(`/meals/search?q=${encodeURIComponent(query)}`),

  listMenuItems: (week: string) => request<MenuItem[]>(`/menu-items?week=${week}`),

  createMenuItem: (payload: {
    mealId: string
    dayOfWeek: DayOfWeek
    mealType: MealType
    servings: number
    weekRef: string
  }) => request<MenuItem>('/menu-items', { method: 'POST', body: JSON.stringify(payload) }),

  updateMenuItem: (
    id: number,
    payload: { dayOfWeek: DayOfWeek; mealType: MealType; servings: number },
  ) => request<MenuItem>(`/menu-items/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  deleteMenuItem: (id: number) => request<void>(`/menu-items/${id}`, { method: 'DELETE' }),

  getShoppingList: (week: string) => request<ShoppingListItem[]>(`/shopping-list?week=${week}`),

  checkIngredient: (week: string, ingredient: string, checked: boolean) =>
    request<ShoppingListItem>(
      `/shopping-list/${encodeURIComponent(ingredient)}/check?week=${week}`,
      { method: 'PATCH', body: JSON.stringify({ checked }) },
    ),
}
