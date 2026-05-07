import { useState, useCallback, useEffect } from "react";
import { Producto } from "../types";
import { productosService } from "../services/productos.service";

interface LineaCompra {
  id: string;
  productoId: string;
  nombre: string;
  cantidadTotal: number;
  precioCosto: number;
}

let _lineaId = 0;

function lineaVacia(): LineaCompra {
  return {
    id: `l${_lineaId++}`,
    productoId: "",
    nombre: "",
    cantidadTotal: 1,
    precioCosto: 0,
  };
}

function today() {
  const h = new Date();
  const y = h.getFullYear();
  const m = String(h.getMonth() + 1).padStart(2, "0");
  const d = String(h.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function useNuevaCompra() {
  const [fecha, setFecha] = useState(today());
  const [proveedor, setProveedor] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [lineas, setLineas] = useState<LineaCompra[]>([lineaVacia()]);

  // Búsqueda de productos por línea
  const [lineasSearch, setLineasSearch] = useState<
    Record<string, { query: string; results: Producto[] }>
  >({});

  const buscarProducto = useCallback(async (lineaId: string, query: string) => {
    setLineasSearch((prev) => ({
      ...prev,
      [lineaId]: { query, results: prev[lineaId]?.results ?? [] },
    }));
    try {
      const results = await productosService.getAll(query);
      setLineasSearch((prev) => ({ ...prev, [lineaId]: { query, results } }));
    } catch {
      setLineasSearch((prev) => ({
        ...prev,
        [lineaId]: { query, results: [] },
      }));
    }
  }, []);

  const seleccionarProducto = useCallback((lineaId: string, p: Producto) => {
    setLineas((ls) =>
      ls.map((l) =>
        l.id === lineaId ? { ...l, productoId: p.id, nombre: p.nombre } : l,
      ),
    );
    setLineasSearch((prev) => ({
      ...prev,
      [lineaId]: { query: p.nombre, results: [] },
    }));
  }, []);

  const agregarLinea = () => setLineas((ls) => [...ls, lineaVacia()]);

  const actualizarLinea = (updated: LineaCompra) =>
    setLineas((ls) => ls.map((l) => (l.id === updated.id ? updated : l)));

  const eliminarLinea = (id: string) => {
    setLineas((ls) => ls.filter((l) => l.id !== id));
    setLineasSearch((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  };

  const reset = () => {
    setFecha(today());
    setProveedor("");
    setObservaciones("");
    setLineas([lineaVacia()]);
    setLineasSearch({});
  };

  const buildData = () => ({
    fecha,
    proveedorId: "", // se sobreescribe desde el modal
    observaciones,
    lineas: lineas
      .filter((l) => l.productoId)
      .map((l) => ({
        productoId: l.productoId,
        cantidadTotal: l.cantidadTotal,
        precioCosto: l.precioCosto,
      })),
  });

  const validar = () =>
    lineas.some(
      (l) => l.productoId && l.cantidadTotal > 0 && l.precioCosto > 0,
    );

  return {
    fecha,
    setFecha,
    proveedor,
    setProveedor,
    observaciones,
    setObservaciones,
    lineas,
    lineasSearch,
    buscarProducto,
    seleccionarProducto,
    agregarLinea,
    actualizarLinea,
    eliminarLinea,
    buildData,
    validar,
    reset,
  };
}
