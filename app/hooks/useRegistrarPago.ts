import { useState, useRef } from "react";
import { Cliente } from "../types";
import { facturasService } from "../services/facturas.service";
import { useExport } from "./useExports";
import { TIPOS_PAGO } from "./useFactura";

interface Pago {
  id: string;
  tipo: string;
  detalle: string;
  monto: number;
}

let _payId = 0;

function pagoVacio(): Pago {
  return { id: `p${_payId++}`, tipo: TIPOS_PAGO[0], detalle: "", monto: 0 };
}

function today() {
  const h = new Date();
  const y = h.getFullYear();
  const m = String(h.getMonth() + 1).padStart(2, "0");
  const d = String(h.getDate()).padStart(2, "0");
  return { iso: `${y}-${m}-${d}`, display: `${d}/${m}/${y}` };
}

export function useRegistrarPago(
  cliente: Cliente,
  deudaMonetaria: number,
  deudaCajas: number,
  nroFactura: number | null,
) {
  const { iso, display } = today();
  const exportRef = useRef<HTMLDivElement>(null);
  const { exportWA } = useExport(exportRef);

  const [pagos, setPagos] = useState<Pago[]>([pagoVacio()]);
  const [dejo, setDejo] = useState("");
  const [retiro, setRetiro] = useState("");
  const [obs, setObs] = useState("");
  const [saving, setSaving] = useState(false);

  // Cálculos derivados
  const totalPagado = pagos.reduce((acc, p) => acc + p.monto, 0);
  const saldoPendiente = deudaMonetaria - totalPagado;
  const cajaNuevoSaldo =
    deudaCajas +
    Math.floor(parseFloat(dejo) || 0) -
    Math.floor(parseFloat(retiro) || 0);

  // Pagos
  const agregarPago = () => setPagos((ps) => [...ps, pagoVacio()]);
  const actualizarPago = (updated: Pago) =>
    setPagos((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
  const eliminarPago = (id: string) =>
    setPagos((ps) => ps.filter((p) => p.id !== id));

  const buildData = () => ({
    clienteId: cliente.id,
    clienteNombre: cliente.nombre,
    fecha: iso,
    subtotal: 0,
    saldoAnterior: deudaMonetaria,
    totalGeneral: deudaMonetaria,
    totalPagado,
    saldoPendiente,
    cajaDeuda: String(deudaCajas),
    cajaDejo: dejo,
    cajaRetiro: retiro,
    cajaNuevoSaldo,
    observaciones: obs,
    lineas: [],
    pagos,
  });

  const guardar = async () => {
    if (!validar())
      throw new Error("Ingresá al menos un pago o movimiento de cajas");
    setSaving(true);
    try {
      await facturasService.create(buildData());
    } finally {
      setSaving(false);
    }
  };

  const guardarYEnviar = async () => {
    if (!validar())
      throw new Error("Ingresá al menos un pago o movimiento de cajas");
    setSaving(true);
    try {
      const factura = await facturasService.create(buildData()); // tiene el número real
      await exportWA(factura.numero, cliente.nombre);
    } finally {
      setSaving(false);
    }
  };

  const validar = () => {
    const tienePago = pagos.some((p) => p.monto > 0);
    const tieneCajas = !!dejo || !!retiro;
    return tienePago || tieneCajas;
  };

  return {
    // estado
    pagos,
    dejo,
    retiro,
    obs,
    setDejo,
    setRetiro,
    setObs,
    // acciones pagos
    agregarPago,
    actualizarPago,
    eliminarPago,
    // cálculos
    totalPagado,
    saldoPendiente,
    cajaNuevoSaldo,
    // export
    exportRef,
    // acciones principales
    saving,
    guardar,
    guardarYEnviar,
    // datos para export
    iso,
    display,
    TIPOS_PAGO,
  };
}
