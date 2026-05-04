import { useState } from "react";
import { FilaProducto, Pago } from "../types";

let _rowId = 0;
let _payId = 0;

const TIPOS_PAGO = [
  "Efectivo",
  "Transferencia",
  "Tarjeta débito",
  "Tarjeta crédito",
  "Cheque",
  "QR / Billetera",
  "Otro",
];

function today() {
  const h = new Date();
  const y = h.getFullYear();
  const m = String(h.getMonth() + 1).padStart(2, "0");
  const d = String(h.getDate()).padStart(2, "0");
  return { iso: `${y}-${m}-${d}`, display: `${d}/${m}/${y}` };
}

export function useFactura() {
  const { iso, display } = today();

  const [nro, setNro] = useState("0001");
  const [fecha, setFecha] = useState(iso);
  const [cliente, setCliente] = useState("");
  const [saldoAnt, setSaldoAnt] = useState<number | "">("");
  const [obs, setObs] = useState("");
  const [cajaDatos, setCajaDatos] = useState({
    deuda: "",
    dejo: "",
    retiro: "",
  });
  const [filas, setFilas] = useState<FilaProducto[]>([
    { id: `r${_rowId++}`, nombre: "", precio: 0, qty: 1 },
    { id: `r${_rowId++}`, nombre: "", precio: 0, qty: 1 },
    { id: `r${_rowId++}`, nombre: "", precio: 0, qty: 1 },
  ]);
  const [pagos, setPagos] = useState<Pago[]>([]);

  // Cálculos derivados
  const subtotal = filas.reduce((acc, f) => acc + f.qty * f.precio, 0);
  const totalGeneral = subtotal + (saldoAnt === "" ? 0 : saldoAnt);
  const totalPagado = pagos.reduce((acc, p) => acc + p.monto, 0);
  const saldoPendiente = totalGeneral - totalPagado;

  // Filas
  const agregarFila = () =>
    setFilas((fs) => [
      ...fs,
      { id: `r${_rowId++}`, nombre: "", precio: 0, qty: 1 },
    ]);

  const actualizarFila = (updated: FilaProducto) =>
    setFilas((fs) => fs.map((f) => (f.id === updated.id ? updated : f)));

  const eliminarFila = (id: string) =>
    setFilas((fs) => fs.filter((f) => f.id !== id));

  // Pagos
  const agregarPago = () =>
    setPagos((ps) => [
      ...ps,
      { id: `p${_payId++}`, tipo: TIPOS_PAGO[0], detalle: "", monto: 0 },
    ]);

  const actualizarPago = (updated: Pago) =>
    setPagos((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));

  const eliminarPago = (id: string) =>
    setPagos((ps) => ps.filter((p) => p.id !== id));

  return {
    // datos
    nro,
    setNro,
    fecha,
    setFecha,
    fechaDisplay: display,
    cliente,
    setCliente,
    saldoAnt,
    setSaldoAnt,
    obs,
    setObs,
    cajaDatos,
    setCajaDatos,
    // filas
    filas,
    agregarFila,
    actualizarFila,
    eliminarFila,
    // pagos
    pagos,
    TIPOS_PAGO,
    agregarPago,
    actualizarPago,
    eliminarPago,
    // totales
    subtotal,
    totalGeneral,
    totalPagado,
    saldoPendiente,
  };
}
