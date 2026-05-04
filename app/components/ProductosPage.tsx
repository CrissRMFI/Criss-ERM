'use client'

import { useState, useEffect, useCallback } from 'react'
import { Producto } from '../types'

function Toast({ msg, show }: { msg: string; show: boolean }) {
  return <div className={`toast ${show ? 'show' : ''}`}>{msg}</div>
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg: '', show: false })

  const showToast = (msg: string) => {
    setToast({ msg, show: true })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2400)
  }

  const fetchProductos = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/productos${search ? `?q=${encodeURIComponent(search)}` : ''}`)
      const data = await res.json()
      setProductos(data)
    } catch {
      showToast('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const t = setTimeout(fetchProductos, 300)
    return () => clearTimeout(t)
  }, [fetchProductos])

  const abrirNuevo = () => {
    setEditId(null)
    setNombre('')
    setPrecio('')
    setModalOpen(true)
  }

  const abrirEditar = (p: Producto) => {
    setEditId(p.id)
    setNombre(p.nombre)
    setPrecio(String(p.precio))
    setModalOpen(true)
  }

  const cerrarModal = () => {
    setModalOpen(false)
    setEditId(null)
  }

  const guardar = async () => {
    if (!nombre.trim()) { showToast('Ingresá el nombre'); return }
    const precioNum = parseFloat(precio)
    if (isNaN(precioNum) || precioNum < 0) { showToast('Ingresá un precio válido'); return }

    setSaving(true)
    try {
      const url = editId ? `/api/productos/${editId}` : '/api/productos'
      const method = editId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre.trim(), precio: precioNum }),
      })
      if (!res.ok) throw new Error()
      showToast(editId ? 'Producto actualizado' : 'Producto agregado')
      cerrarModal()
      fetchProductos()
    } catch {
      showToast('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await fetch(`/api/productos/${id}`, { method: 'DELETE' })
      showToast('Producto eliminado')
      fetchProductos()
    } catch {
      showToast('Error al eliminar')
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Base de Productos</h1>
        <button className="btn btn-primary" onClick={abrirNuevo}>
          + Nuevo producto
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="prod-count">
        {loading ? 'Cargando…' : `${productos.length} producto${productos.length !== 1 ? 's' : ''}`}
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        {!loading && productos.length === 0 ? (
          <div className="empty-state">
            {search
              ? `Sin resultados para "${search}"`
              : 'No hay productos aún.\nUsá el botón "+ Nuevo producto" para agregar.'}
          </div>
        ) : (
          <table className="prod-table">
            <thead>
              <tr>
                <th>Nombre del producto</th>
                <th className="r">Precio venta</th>
                <th className="r">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td className="r" style={{ fontWeight: 600 }}>$ {p.precio.toFixed(2)}</td>
                  <td className="r">
                    <div className="row-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => abrirEditar(p)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => eliminar(p.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      <div className={`modal-bg ${modalOpen ? 'open' : ''}`} onClick={e => e.target === e.currentTarget && cerrarModal()}>
        <div className="modal">
          <h3>{editId ? 'Editar producto' : 'Nuevo producto'}</h3>
          <div className="modal-field">
            <label>Nombre del producto</label>
            <input
              type="text"
              placeholder="Ej: Leche entera 1L"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && guardar()}
              autoFocus
            />
          </div>
          <div className="modal-field">
            <label>Precio de venta</label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={precio}
              onChange={e => setPrecio(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && guardar()}
            />
          </div>
          <div className="modal-btns">
            <button className="btn btn-ghost btn-sm" onClick={cerrarModal}>Cancelar</button>
            <button className="btn btn-primary btn-sm" onClick={guardar} disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>

      <Toast msg={toast.msg} show={toast.show} />
    </>
  )
}
