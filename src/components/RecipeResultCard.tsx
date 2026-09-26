import type { MealSearchResult } from '../types'

interface Props {
  meal: MealSearchResult
  onAdd: (meal: MealSearchResult) => void
}

export function RecipeResultCard({ meal, onAdd }: Props) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      {meal.thumbnailUrl && (
        <img src={meal.thumbnailUrl} alt="" loading="lazy" className="h-36 w-full object-cover" />
      )}
      <div className="flex flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">{meal.mealName}</h3>
        <div className="flex flex-wrap gap-1">
          {[meal.category, meal.area].filter(Boolean).map((tag) => (
            <span key={tag} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
              {tag}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onAdd(meal)}
          className="mt-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          Adicionar ao cardápio
        </button>
      </div>
    </article>
  )
}
