// app/types.ts
export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilaProducto {
  id: string;
  nombre: string;
  precio: number;
  qty: number;
}

export interface Pago {
  id: string;
  tipo: string;
  detalle: string;
  monto: number;
}

export interface Cliente {
  id: string;
  nombre: string;
  telefono?: string | null;
  direccion?: string | null;
  notas?: string | null;
  activo: boolean;
  createdAt: string;
}
