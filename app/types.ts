// app/types.ts
export interface Producto {
  id: string
  nombre: string
  precio: number
  createdAt?: string
  updatedAt?: string
}

export interface FilaProducto {
  id: string
  nombre: string
  precio: number
  qty: number
}

export interface Pago {
  id: string
  tipo: string
  detalle: string
  monto: number
}
