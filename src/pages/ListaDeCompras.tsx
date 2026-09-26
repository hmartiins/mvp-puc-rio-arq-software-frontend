import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ListSkeleton } from '../components/Skeleton'
import { ShoppingListItem } from '../components/ShoppingListItem'
import { api, ApiError } from '../lib/api'
import { useToast } from '../lib/toast'
import { useWeek } from '../lib/weekContext'
import { ErrorState } from './Cardapio'
import type { ShoppingListItem as Item } from '../types'

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'pendentes', label: 'Pendentes' },
  { id: 'comprados', label: 'Comprados' },
] as const

type Filter = (typeof FILTERS)[number]['id']

export function ListaDeCompras() {
  const { week } = useWeek()
  const toast = useToast()

  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('todos')
  const [pending, setPending] = useState<string[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await api.getShoppingList(week))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Falha ao carregar a lista de compras')
    } finally {
      setLoading(false)
    }
  }, [week])

  useEffect(() => {
    void load()
  }, [load])

  const toggle = async (item: Item) => {
    const checked = !item.checked
    setPending((current) => [...current, item.ingredient])
    setItems((current) =>
      current.map((i) => (i.ingredient === item.ingredient ? { ...i, checked } : i)),
    )
    try {
      await api.checkIngredient(week, item.ingredient, checked)
    } catch (e) {
      setItems((current) =>
        current.map((i) =>
          i.ingredient === item.ingredient ? { ...i, checked: item.checked } : i,
        ),
      )
      toast.error(e instanceof ApiError ? e.message : 'Falha ao marcar o ingrediente')
    } finally {
      setPending((current) => current.filter((name) => name !== item.ingredient))
    }
  }

  const checkedCount = items.filter((item) => item.checked).length
  const progress = items.length === 0 ? 0 : Math.round((checkedCount / items.length) * 100)

  const visible = items.filter((item) => {
    if (filter === 'pendentes') return !item.checked
    if (filter === 'comprados') return item.checked
    return true
  })

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Lista de compras</h2>
        <p className="text-sm text-slate-500">
          Ingredientes de todas as receitas da semana, somados e ajustados às porções.
        </p>
      </div>

      {loading && <ListSkeleton />}

      {!loading && error && <ErrorState message={error} onRetry={() => void load()} />}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">Nenhuma receita no cardápio desta semana ainda.</p>
          <Link
            to="/buscar"
            className="mt-3 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Buscar receitas
          </Link>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">
                {checkedCount} de {items.length} itens comprados
              </span>
              <span className="font-bold text-emerald-700">{progress}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100"
            >
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 text-sm">
            {FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilter(option.id)}
                className={`flex-1 rounded-md px-3 py-1.5 font-medium transition ${
                  filter === option.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              {filter === 'pendentes'
                ? 'Tudo comprado! 🎉'
                : 'Nenhum item comprado ainda.'}
            </p>
          ) : (
            <ul className="space-y-2">
              {visible.map((item) => (
                <ShoppingListItem
                  key={item.ingredient}
                  item={item}
                  pending={pending.includes(item.ingredient)}
                  onToggle={(target) => void toggle(target)}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
