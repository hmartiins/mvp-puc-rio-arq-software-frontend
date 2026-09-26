import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AddToMenuModal, type MenuSlot } from '../components/AddToMenuModal'
import { RecipeResultCard } from '../components/RecipeResultCard'
import { SearchBar } from '../components/SearchBar'
import { GridSkeleton } from '../components/Skeleton'
import { api, ApiError } from '../lib/api'
import { useToast } from '../lib/toast'
import { useWeek } from '../lib/weekContext'
import type { DayOfWeek, MealSearchResult, MealType } from '../types'
import { DAY_LABELS, MEAL_LABELS } from '../types'

/** Contexto opcional vindo do grid: o usuário clicou em "+ adicionar" numa célula. */
interface SearchContext {
  dayOfWeek?: DayOfWeek
  mealType?: MealType
}

export function Buscar() {
  const { week } = useWeek()
  const toast = useToast()
  const navigate = useNavigate()
  const context = (useLocation().state ?? {}) as SearchContext

  const [results, setResults] = useState<MealSearchResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<MealSearchResult | null>(null)
  const [saving, setSaving] = useState(false)

  const search = async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      setResults(await api.searchMeals(query))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Falha ao buscar receitas')
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const add = async (slot: MenuSlot) => {
    if (!selected) return
    setSaving(true)
    try {
      await api.createMenuItem({ mealId: selected.mealId, weekRef: week, ...slot })
      toast.success(`${selected.mealName} adicionado ao cardápio`)
      setSelected(null)
      navigate('/')
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Falha ao adicionar ao cardápio')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Buscar receitas</h2>
        <p className="text-sm text-slate-500">
          {context.dayOfWeek && context.mealType
            ? `Escolhendo uma receita para ${MEAL_LABELS[context.mealType].toLowerCase()} de ${DAY_LABELS[context.dayOfWeek].toLowerCase()}.`
            : 'As receitas vêm da TheMealDB, através da nossa API.'}
        </p>
      </div>

      <SearchBar loading={loading} onSearch={(query) => void search(query)} />

      {loading && <GridSkeleton />}

      {!loading && error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && results?.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Nenhuma receita encontrada. Tente outro termo — a base é em inglês (ex.: <em>chicken</em>).
        </p>
      )}

      {!loading && results && results.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((meal) => (
            <RecipeResultCard key={meal.mealId} meal={meal} onAdd={setSelected} />
          ))}
        </div>
      )}

      {!loading && !error && results === null && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-400">
          Busque uma receita pelo nome para começar a montar a semana.
        </p>
      )}

      {selected && (
        <AddToMenuModal
          title="Adicionar ao cardápio"
          mealName={selected.mealName}
          submitLabel="Adicionar"
          saving={saving}
          initial={{
            dayOfWeek: context.dayOfWeek ?? 'SEG',
            mealType: context.mealType ?? 'ALMOCO',
            servings: 4,
          }}
          onSubmit={(slot) => void add(slot)}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  )
}
