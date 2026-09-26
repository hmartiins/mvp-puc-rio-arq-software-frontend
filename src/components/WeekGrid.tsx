import { useState } from 'react'
import { DAYS, DAY_LABELS, MEAL_LABELS, MEAL_TYPES } from '../types'
import type { DayOfWeek, MealType, MenuItem } from '../types'
import { MealCard } from './MealCard'

interface Props {
  items: MenuItem[]
  onAdd: (day: DayOfWeek, meal: MealType) => void
  onEdit: (item: MenuItem) => void
  onRemove: (item: MenuItem) => void
  onMove: (item: MenuItem, day: DayOfWeek, meal: MealType) => void
}

type Cell = { day: DayOfWeek; meal: MealType }

/** Grid 7 dias × 3 refeições. Aceita arrastar um card de uma célula para outra. */
export function WeekGrid({ items, onAdd, onEdit, onRemove, onMove }: Props) {
  const [dragged, setDragged] = useState<MenuItem | null>(null)
  const [hovered, setHovered] = useState<Cell | null>(null)

  const itemsIn = (day: DayOfWeek, meal: MealType) =>
    items.filter((item) => item.dayOfWeek === day && item.mealType === meal)

  const drop = (day: DayOfWeek, meal: MealType) => {
    setHovered(null)
    if (!dragged) return
    if (dragged.dayOfWeek === day && dragged.mealType === meal) return
    onMove(dragged, day, meal)
  }

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[52rem] grid-cols-[7rem_repeat(7,minmax(0,1fr))] gap-2">
        <div />
        {DAYS.map((day) => (
          <div key={day} className="pb-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            {DAY_LABELS[day]}
          </div>
        ))}

        {MEAL_TYPES.map((meal) => (
          <MealRow
            key={meal}
            meal={meal}
            itemsIn={itemsIn}
            hovered={hovered}
            dragged={dragged}
            setHovered={setHovered}
            onDrop={drop}
            onAdd={onAdd}
            onEdit={onEdit}
            onRemove={onRemove}
            setDragged={setDragged}
          />
        ))}
      </div>
    </div>
  )
}

interface RowProps {
  meal: MealType
  itemsIn: (day: DayOfWeek, meal: MealType) => MenuItem[]
  hovered: Cell | null
  dragged: MenuItem | null
  setHovered: (cell: Cell | null) => void
  setDragged: (item: MenuItem | null) => void
  onDrop: (day: DayOfWeek, meal: MealType) => void
  onAdd: (day: DayOfWeek, meal: MealType) => void
  onEdit: (item: MenuItem) => void
  onRemove: (item: MenuItem) => void
}

function MealRow({
  meal,
  itemsIn,
  hovered,
  dragged,
  setHovered,
  setDragged,
  onDrop,
  onAdd,
  onEdit,
  onRemove,
}: RowProps) {
  return (
    <>
      <div className="flex items-center pr-2 text-right text-xs font-semibold text-slate-600">
        {MEAL_LABELS[meal]}
      </div>

      {DAYS.map((day) => {
        const cellItems = itemsIn(day, meal)
        const isHovered = hovered?.day === day && hovered?.meal === meal

        return (
          <div
            key={`${day}-${meal}`}
            onDragOver={(event) => {
              event.preventDefault()
              event.dataTransfer.dropEffect = 'move'
              setHovered({ day, meal })
            }}
            onDragLeave={() => setHovered(null)}
            onDrop={(event) => {
              event.preventDefault()
              onDrop(day, meal)
            }}
            className={`flex min-h-[7.5rem] flex-col gap-2 rounded-xl border-2 border-dashed p-2 transition ${
              isHovered && dragged
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 bg-white/60'
            }`}
          >
            {cellItems.map((item) => (
              <MealCard
                key={item.id}
                item={item}
                onEdit={onEdit}
                onRemove={onRemove}
                dragging={dragged?.id === item.id}
                onDragStart={setDragged}
                onDragEnd={() => {
                  setDragged(null)
                  setHovered(null)
                }}
              />
            ))}

            <button
              type="button"
              onClick={() => onAdd(day, meal)}
              className="mt-auto rounded-lg border border-transparent py-1.5 text-xs font-medium text-slate-400 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              + adicionar
            </button>
          </div>
        )
      })}
    </>
  )
}
