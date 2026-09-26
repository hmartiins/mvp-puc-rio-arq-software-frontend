import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ToastProvider } from './lib/toast'
import { WeekProvider } from './lib/weekContext'
import { Buscar } from './pages/Buscar'
import { Cardapio } from './pages/Cardapio'
import { ListaDeCompras } from './pages/ListaDeCompras'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <WeekProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Cardapio />} />
              <Route path="/buscar" element={<Buscar />} />
              <Route path="/lista-de-compras" element={<ListaDeCompras />} />
              <Route path="*" element={<Cardapio />} />
            </Route>
          </Routes>
        </WeekProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
