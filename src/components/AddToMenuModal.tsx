import { useEffect, useState, type FormEvent } from 'react'
import { DAYS, DAY_LABELS, MEAL_LABELS, MEAL_TYPES } from '../types'
import type { DayOfWeek, MealType } from '../types'

export interface MenuSlot {
  dayOfWeek: DayOfWeek
  mealType: MealType
  servings: number
}

interface Props {
  title: string
  mealName: string
  initial: MenuSlot
  submitLabel: string
  saving: boolean
  onSubmit: (slot: MenuSlot) => void
  onClose: () => void
}

/** Escolhe dia, refeição e porções — usado tanto para adicionar quanto para editar. */
export function AddToMenuModal({
  title,
  mealName,
  initial,
  submitLabel,
  saving,
  onSubmit,
  onClose,
}: Props) {
  const [slot, setSlot] = useState<MenuSlot>(initial)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit(slot)
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
      >
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{mealName}</p>

        <form onSubmit={submit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="day" className="mb-1 block text-xs font-semibold text-slate-600">
              Dia
            </label>
            <select
              id="day"
              value={slot.dayOfWeek}
              onChange={(event) =>
                setSlot({ ...slot, dayOfWeek: event.target.value as DayOfWeek })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {DAY_LABELS[day]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="meal" className="mb-1 block text-xs font-semibold text-slate-600">
              Refeição
            </label>
            <select
              id="meal"
              value={slot.mealType}
              onChange={(event) =>
                setSlot({ ...slot, mealType: event.target.value as MealType })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            >
              {MEAL_TYPES.map((meal) => (
                <option key={meal} value={meal}>
                  {MEAL_LABELS[meal]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="servings" className="mb-1 block text-xs font-semibold text-slate-600">
              Porções
            </label>
            <input
              id="servings"
              type="number"
              min={1}
              max={50}
              value={slot.servings}
              onChange={(event) =>
                setSlot({ ...slot, servings: Number(event.target.value) })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              As quantidades da lista de compras são ajustadas a esse número.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || slot.servings < 1}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-300"
            >
              {saving ? 'Salvando…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
