import { NavLink, Outlet } from 'react-router-dom'
import { useWeek } from '../lib/weekContext'
import { formatWeekRange, isCurrentWeek } from '../lib/week'

const TABS = [
  { to: '/', label: 'Cardápio' },
  { to: '/buscar', label: 'Buscar receitas' },
  { to: '/lista-de-compras', label: 'Lista de compras' },
]

export function Layout() {
  const { week, next, previous, goToCurrent } = useWeek()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span aria-hidden className="text-2xl">🍽️</span>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Cardápio Semanal</h1>
              <p className="text-xs text-slate-500">Planeje a semana e monte a lista de compras</p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={previous}
              aria-label="Semana anterior"
              className="rounded-md px-2 py-1 text-slate-600 transition hover:bg-white hover:text-slate-900"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goToCurrent}
              title="Voltar para a semana atual"
              className="min-w-[9.5rem] rounded-md px-3 py-1 text-center text-sm font-medium text-slate-700 transition hover:bg-white"
            >
              {formatWeekRange(week)}
              {isCurrentWeek(week) && (
                <span className="ml-2 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                  atual
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Próxima semana"
              className="rounded-md px-2 py-1 text-slate-600 transition hover:bg-white hover:text-slate-900"
            >
              ›
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-1 px-4">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
