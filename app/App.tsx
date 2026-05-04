'use client'

import { useState } from 'react'
import FacturaPage from './components/FacturaPage'
import ProductosPage from './components/ProductosPage'

type Tab = 'factura' | 'productos'

export default function App() {
  const [tab, setTab] = useState<Tab>('factura')

  return (
    <>
      <nav className="nav">
        <span className="nav-logo">Factura.</span>
        <button
          className={`nav-tab ${tab === 'factura' ? 'active' : ''}`}
          onClick={() => setTab('factura')}
        >
          Factura
        </button>
        <button
          className={`nav-tab ${tab === 'productos' ? 'active' : ''}`}
          onClick={() => setTab('productos')}
        >
          Productos
        </button>
      </nav>

      <div className={`page ${tab === 'factura' ? 'active' : ''}`}>
        <FacturaPage />
      </div>
      <div className={`page ${tab === 'productos' ? 'active' : ''}`}>
        <ProductosPage />
      </div>
    </>
  )
}
