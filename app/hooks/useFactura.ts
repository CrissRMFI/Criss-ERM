import { useState, useEffect } from "react";
import { FilaProducto, Pago } from "../types";
import { facturasService } from "../services/facturas.service";

let _rowId = 0;
let _payId = 0;

export const TIPOS_PAGO = [
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

  const [nro, setNro] = useState<number | null>(null);
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

  // Cargar número de factura al montar
  useEffect(() => {
    facturasService
      .getNextNumero()
      .then(setNro)
      .catch(() => setNro(101));
  }, []);

  // Cálculos derivados
  const subtotal = filas.reduce((acc, f) => acc + f.qty * f.precio, 0);
  const totalGeneral = subtotal + (saldoAnt === "" ? 0 : saldoAnt);
  const totalPagado = pagos.reduce((acc, p) => acc + p.monto, 0);
  const saldoPendiente = totalGeneral - totalPagado;

  // Cajas
  const cajaDeuda = cajaDatos.deuda;
  const cajaDejo = cajaDatos.dejo;
  const cajaRetiro = cajaDatos.retiro;
  const cajaNuevoSaldo =
    Math.floor(parseFloat(cajaDatos.deuda) || 0) +
    Math.floor(parseFloat(cajaDatos.dejo) || 0) -
    Math.floor(parseFloat(cajaDatos.retiro) || 0);

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

  // al final del return de useFactura
  const reset = () => {
    setNro(null);
    setFecha(iso);
    setCliente("");
    setSaldoAnt("");
    setObs("");
    setCajaDatos({ deuda: "", dejo: "", retiro: "" });
    setFilas([
      { id: `r${_rowId++}`, nombre: "", precio: 0, qty: 1 },
      { id: `r${_rowId++}`, nombre: "", precio: 0, qty: 1 },
      { id: `r${_rowId++}`, nombre: "", precio: 0, qty: 1 },
    ]);
    setPagos([]);
    // Pedir nuevo número
    facturasService
      .getNextNumero()
      .then(setNro)
      .catch(() => setNro(null));
  };

  return {
    nro,
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
    cajaDeuda,
    cajaDejo,
    cajaRetiro,
    cajaNuevoSaldo,
    filas,
    agregarFila,
    actualizarFila,
    eliminarFila,
    pagos,
    TIPOS_PAGO,
    agregarPago,
    actualizarPago,
    eliminarPago,
    subtotal,
    totalGeneral,
    totalPagado,
    saldoPendiente,
    reset,
  };
}
