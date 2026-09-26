import type { ShoppingListItem as Item } from '../types'

interface Props {
  item: Item
  pending: boolean
  onToggle: (item: Item) => void
}

export function ShoppingListItem({ item, pending, onToggle }: Props) {
  return (
    <li>
      <label
        className={`flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 transition ${
          item.checked ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300'
        } ${pending ? 'opacity-60' : ''}`}
      >
        <input
          type="checkbox"
          checked={item.checked}
          disabled={pending}
          onChange={() => onToggle(item)}
          className="size-5 shrink-0 accent-emerald-600"
        />

        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-sm font-medium ${
              item.checked ? 'text-slate-400 line-through' : 'text-slate-800'
            }`}
          >
            {item.ingredient}
          </p>
          {item.recipes.length > 0 && (
            <p className="truncate text-[11px] text-slate-400">{item.recipes.join(' · ')}</p>
          )}
        </div>

        {item.quantity && (
          <span className="shrink-0 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {item.quantity}
          </span>
        )}
      </label>
    </li>
  )
}
