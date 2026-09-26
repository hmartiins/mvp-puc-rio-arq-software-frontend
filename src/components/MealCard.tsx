import type { MenuItem } from '../types'

interface Props {
  item: MenuItem
  onEdit: (item: MenuItem) => void
  onRemove: (item: MenuItem) => void
  onDragStart: (item: MenuItem) => void
  onDragEnd: () => void
  dragging: boolean
}

/** Receita já atribuída a uma célula do grid. Arrastável para outro dia/refeição. */
export function MealCard({ item, onEdit, onRemove, onDragStart, onDragEnd, dragging }: Props) {
  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', String(item.id))
        onDragStart(item)
      }}
      onDragEnd={onDragEnd}
      className={`group relative cursor-grab overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition active:cursor-grabbing ${
        dragging ? 'opacity-40' : 'hover:shadow-md'
      }`}
    >
      {item.thumbnailUrl && (
        <img
          src={item.thumbnailUrl}
          alt=""
          loading="lazy"
          className="h-20 w-full object-cover"
        />
      )}
      <div className="p-2">
        <p className="line-clamp-2 text-xs font-semibold leading-tight text-slate-800">
          {item.mealName}
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          {item.servings} {item.servings === 1 ? 'porção' : 'porções'}
        </p>
      </div>

      <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(item)}
          aria-label={`Editar ${item.mealName}`}
          title="Editar"
          className="rounded bg-white/90 px-1.5 py-0.5 text-xs shadow hover:bg-white"
        >
          ✎
        </button>
        <button
          type="button"
          onClick={() => onRemove(item)}
          aria-label={`Remover ${item.mealName}`}
          title="Remover"
          className="rounded bg-white/90 px-1.5 py-0.5 text-xs text-rose-600 shadow hover:bg-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
