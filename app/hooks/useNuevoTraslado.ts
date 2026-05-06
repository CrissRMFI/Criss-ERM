import { useState, useCallback } from "react";
import { StockProducto } from "./useStock";
import { trasladosService } from "../services/traslados.service";

const ALMACEN_CENTRAL = "almacen-central";
const ALMACEN_MOVIL = "almacen-movil";

interface LineaTraslado {
  loteId: string;
  productoId: string;
  nombre: string;
  precioCosto: number;
  cantidadDisponible: number;
  cantidad: number;
}

function today() {
  const h = new Date();
  const y = h.getFullYear();
  const m = String(h.getMonth() + 1).padStart(2, "0");
  const d = String(h.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function useNuevoTraslado() {
  const [origenTipo, setOrigenTipo] = useState<"CENTRAL" | "MOVIL">("CENTRAL");
  const [fecha, setFecha] = useState(today());
  const [observaciones, setObservaciones] = useState("");
  const [lineas, setLineas] = useState<LineaTraslado[]>([]);

  const origenId = origenTipo === "CENTRAL" ? ALMACEN_CENTRAL : ALMACEN_MOVIL;
  const destinoId = origenTipo === "CENTRAL" ? ALMACEN_MOVIL : ALMACEN_CENTRAL;
  const destinoNombre =
    origenTipo === "CENTRAL" ? "Depósito Móvil" : "Casa Central";

  // Cargar productos del origen al seleccionarlo
  const cargarStock = useCallback((stock: StockProducto[]) => {
    const nuevasLineas: LineaTraslado[] = [];
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
          });
        }
      });
    });
    setLineas(nuevasLineas);
  }, []);

  const actualizarCantidad = (loteId: string, cantidad: number) => {
    setLineas((ls) =>
      ls.map((l) =>
        l.loteId === loteId
          ? {
              ...l,
              cantidad: Math.min(l.cantidadDisponible, Math.max(0, cantidad)),
            }
          : l,
      ),
    );
  };

  const lineasActivas = lineas.filter((l) => l.cantidad > 0);

  const validar = () => lineasActivas.length > 0;

  const buildData = () => ({
    origenId,
    destinoId,
    fecha,
    observaciones,
    lineas: lineasActivas.map((l) => ({
      loteId: l.loteId,
      productoId: l.productoId,
      cantidad: l.cantidad,
      precioCosto: l.precioCosto,
    })),
  });

  const reset = () => {
    setFecha(today());
    setObservaciones("");
    setLineas([]);
  };

  return {
    origenTipo,
    setOrigenTipo,
    origenId,
    destinoId,
    destinoNombre,
    fecha,
    setFecha,
    observaciones,
    setObservaciones,
    lineas,
    lineasActivas,
    cargarStock,
    actualizarCantidad,
    validar,
    buildData,
    reset,
  };
}
