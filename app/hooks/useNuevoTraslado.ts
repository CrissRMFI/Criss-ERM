import { useState, useCallback } from "react";
import { Almacen } from "./useAlmacenes";
import { StockProducto } from "./useStock";

interface LineaTraslado {
  loteId: string;
  productoId: string;
  nombre: string;
  precioCosto: number;
  cantidadDisponible: number;
  cantidad: number;
  esNegativo: boolean;
}

function today() {
  const h = new Date();
  const y = h.getFullYear();
  const m = String(h.getMonth() + 1).padStart(2, "0");
  const d = String(h.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function useNuevoTraslado(almacenes: Almacen[]) {
  const [origenId, setOrigenId] = useState("");
  const [destinoId, setDestinoId] = useState("");
  const [fecha, setFecha] = useState(today());
  const [observaciones, setObservaciones] = useState("");
  const [lineas, setLineas] = useState<LineaTraslado[]>([]);
  const [stockDisponible, setStockDisponible] = useState<StockProducto[]>([]);

  const origen = almacenes.find((a) => a.id === origenId);
  const destino = almacenes.find((a) => a.id === destinoId);

  // Guardar el stock disponible para búsqueda
  const cargarStock = useCallback((stock: StockProducto[]) => {
    setStockDisponible(stock);
    setLineas([]);
  }, []);

  // Agregar producto al traslado desde búsqueda
  const agregarProducto = useCallback(
    (productoId: string) => {
      const producto = stockDisponible.find((p) => p.productoId === productoId);
      if (!producto) return;

      // Verificar que no esté ya agregado
      const yaAgregado = lineas.some((l) => l.productoId === productoId);
      if (yaAgregado) return;

      // Agregar una línea por cada lote del producto
      const nuevasLineas: LineaTraslado[] = producto.lotes.map((l) => ({
        loteId: l.id,
        productoId: producto.productoId,
        nombre: producto.nombre,
        precioCosto: l.precioCosto,
        cantidadDisponible: l.cantidad,
        cantidad: 0,
        esNegativo: false,
      }));

      setLineas((prev) => [...prev, ...nuevasLineas]);
    },
    [stockDisponible, lineas],
  );

  const eliminarLinea = (loteId: string) => {
    setLineas((prev) => prev.filter((l) => l.loteId !== loteId));
  };

  const actualizarCantidad = (loteId: string, cantidad: number) => {
    setLineas((ls) =>
      ls.map((l) => {
        if (l.loteId !== loteId) return l;
        const esNegativo =
          origen?.tipo === "EXTERNO" ? cantidad > l.cantidadDisponible : false;
        return { ...l, cantidad: Math.max(0, cantidad), esNegativo };
      }),
    );
  };

  const actualizarCosto = (loteId: string, precioCosto: number) => {
    setLineas((ls) =>
      ls.map((l) => (l.loteId === loteId ? { ...l, precioCosto } : l)),
    );
  };

  const lineasActivas = lineas.filter((l) => l.cantidad > 0);
  const validar = () =>
    !!origenId &&
    !!destinoId &&
    origenId !== destinoId &&
    lineasActivas.length > 0;

  const buildData = () => ({
    origenId,
    destinoId,
    fecha,
    observaciones,
    lineas: lineasActivas.map((l) => ({
      loteId: l.loteId,
      productoId: l.productoId,
      nombre: l.nombre,
      cantidad: l.cantidad,
      precioCosto: l.precioCosto,
    })),
  });

  const reset = () => {
    setOrigenId("");
    setDestinoId("");
    setFecha(today());
    setObservaciones("");
    setLineas([]);
    setStockDisponible([]);
  };

  return {
    origenId,
    setOrigenId,
    destinoId,
    setDestinoId,
    origen,
    destino,
    fecha,
    setFecha,
    observaciones,
    setObservaciones,
    lineas,
    lineasActivas,
    stockDisponible,
    cargarStock,
    agregarProducto,
    eliminarLinea,
    actualizarCantidad,
    actualizarCosto,
    validar,
    buildData,
    reset,
  };
}
