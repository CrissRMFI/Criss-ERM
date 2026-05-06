import { useState, useCallback } from "react";
import { StockProducto } from "./useStock";
import { Almacen } from "./useAlmacenes";

interface LineaTraslado {
  loteId: string;
  productoId: string;
  nombre: string;
  precioCosto: number;
  cantidadDisponible: number;
  cantidad: number;
  esNegativo: boolean; // para externos
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

  const origen = almacenes.find((a) => a.id === origenId);
  const destino = almacenes.find((a) => a.id === destinoId);

  const cargarStock = useCallback(
    (stock: StockProducto[]) => {
      const nuevasLineas: LineaTraslado[] = [];

      if (origen?.tipo === "EXTERNO") {
        // Para externos mostramos el stock disponible
        // pero permitimos ingresar cualquier cantidad
        stock.forEach((p) => {
          p.lotes.forEach((l) => {
            nuevasLineas.push({
              loteId: l.id,
              productoId: p.productoId,
              nombre: p.nombre,
              precioCosto: l.precioCosto,
              cantidadDisponible: l.cantidad,
              cantidad: 0,
              esNegativo: false,
            });
          });
        });
      } else {
        stock.forEach((p) => {
          p.lotes.forEach((l) => {
            if (l.cantidad > 0) {
              nuevasLineas.push({
                loteId: l.id,
                productoId: p.productoId,
                nombre: p.nombre,
                precioCosto: l.precioCosto,
                cantidadDisponible: l.cantidad,
                cantidad: 0,
                esNegativo: false,
              });
            }
          });
        });
      }

      setLineas(nuevasLineas);
    },
    [origen],
  );

  const actualizarCantidad = (loteId: string, cantidad: number) => {
    setLineas((ls) =>
      ls.map((l) => {
        if (l.loteId !== loteId) return l;
        const esNegativo =
          origen?.tipo === "EXTERNO" ? cantidad > l.cantidadDisponible : false;
        return {
          ...l,
          cantidad: Math.max(0, cantidad),
          esNegativo,
        };
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
    cargarStock,
    actualizarCantidad,
    actualizarCosto,
    validar,
    buildData,
    reset,
  };
}
