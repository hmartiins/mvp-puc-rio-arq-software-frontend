import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AddToMenuModal, type MenuSlot } from '../components/AddToMenuModal'
import { GridSkeleton } from '../components/Skeleton'
import { WeekGrid } from '../components/WeekGrid'
import { api, ApiError } from '../lib/api'
import { useToast } from '../lib/toast'
import { useWeek } from '../lib/weekContext'
import type { DayOfWeek, MealType, MenuItem } from '../types'

export function Cardapio() {
  const { week } = useWeek()
  const toast = useToast()
  const navigate = useNavigate()

  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<MenuItem | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setItems(await api.listMenuItems(week))
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Falha ao carregar o cardápio')
    } finally {
      setLoading(false)
    }
  }, [week])

  useEffect(() => {
    void load()
  }, [load])

  const goToSearch = (dayOfWeek: DayOfWeek, mealType: MealType) => {
    navigate('/buscar', { state: { dayOfWeek, mealType } })
  }

  const remove = async (item: MenuItem) => {
    const previous = items
    setItems((current) => current.filter((i) => i.id !== item.id))
    try {
      await api.deleteMenuItem(item.id)
      toast.success(`${item.mealName} removido do cardápio`)
    } catch (e) {
      setItems(previous)
      toast.error(e instanceof ApiError ? e.message : 'Falha ao remover o item')
    }
  }

  const move = async (item: MenuItem, dayOfWeek: DayOfWeek, mealType: MealType) => {
    const previous = items
    // Move na tela antes da resposta: arrastar precisa parecer instantâneo.
    setItems((current) =>
      current.map((i) => (i.id === item.id ? { ...i, dayOfWeek, mealType } : i)),
    )
    try {
      const updated = await api.updateMenuItem(item.id, {
        dayOfWeek,
        mealType,
        servings: item.servings,
      })
      setItems((current) => current.map((i) => (i.id === updated.id ? updated : i)))
    } catch (e) {
      setItems(previous)
      toast.error(e instanceof ApiError ? e.message : 'Falha ao mover a receita')
    }
  }

  const saveEdit = async (slot: MenuSlot) => {
    if (!editing) return
    setSaving(true)
    try {
      const updated = await api.updateMenuItem(editing.id, slot)
      setItems((current) => current.map((i) => (i.id === updated.id ? updated : i)))
      setEditing(null)
      toast.success('Item atualizado')
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Falha ao atualizar o item')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Cardápio da semana</h2>
          <p className="text-sm text-slate-500">
            {items.length} {items.length === 1 ? 'receita planejada' : 'receitas planejadas'} · arraste
            um card para trocar de dia ou refeição
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/buscar')}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Buscar receitas
        </button>
      </div>

      {loading && <GridSkeleton />}

      {!loading && error && (
        <ErrorState message={error} onRetry={() => void load()} />
      )}

      {!loading && !error && (
        <WeekGrid
          items={items}
          onAdd={goToSearch}
          onEdit={setEditing}
          onRemove={(item) => void remove(item)}
          onMove={(item, day, meal) => void move(item, day, meal)}
        />
      )}

      {editing && (
        <AddToMenuModal
          title="Editar item do cardápio"
          mealName={editing.mealName}
          submitLabel="Salvar"
          saving={saving}
          initial={{
            dayOfWeek: editing.dayOfWeek,
            mealType: editing.mealType,
            servings: editing.servings,
          }}
          onSubmit={(slot) => void saveEdit(slot)}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
      <p className="text-sm font-medium text-rose-700">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
      >
        Tentar de novo
      </button>
    </div>
  )
}
