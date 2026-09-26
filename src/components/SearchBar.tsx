import { useState, type FormEvent } from 'react'

interface Props {
  initialValue?: string
  loading: boolean
  onSearch: (query: string) => void
}

export function SearchBar({ initialValue = '', loading, onSearch }: Props) {
  const [value, setValue] = useState(initialValue)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const query = value.trim()
    if (query) {
      onSearch(query)
    }
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar receita por nome (ex.: chicken, pasta, arrabiata)"
        aria-label="Buscar receita por nome"
        className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {loading ? 'Buscando…' : 'Buscar'}
      </button>
    </form>
  )
}
