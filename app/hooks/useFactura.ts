import { useState, useEffect, useCallback } from "react";
import { FilaProducto, Pago, Cliente, Producto } from "../types";
import { facturasService } from "../services/facturas.service";
import { clientesService } from "../services/clientes.service";
import { productosService } from "../services/productos.service";

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

function filaVacia(): FilaProducto {
  return { id: `r${_rowId++}`, nombre: "", precio: 0, qty: 1 };
}

function pagoVacio(): Pago {
  return { id: `p${_payId++}`, tipo: TIPOS_PAGO[0], detalle: "", monto: 0 };
}

// Estado de búsqueda por fila
interface FilaSearch {
  query: string;
  results: Producto[];
}

export function useFactura() {
  const { iso, display } = today();

  // Factura base
  const [nro, setNro] = useState<number | null>(null);
  const [fecha, setFecha] = useState(iso);
  const [saldoAnt, setSaldoAnt] = useState<number | "">("");
  const [obs, setObs] = useState("");
  const [cajaDatos, setCajaDatos] = useState({
    deuda: "",
    dejo: "",
    retiro: "",
  });
  const [filas, setFilas] = useState<FilaProducto[]>([
    filaVacia(),
    filaVacia(),
    filaVacia(),
  ]);
  const [pagos, setPagos] = useState<Pago[]>([]);

  // Búsqueda de productos por fila — mapa id -> {query, results}
  const [filasSearch, setFilasSearch] = useState<Record<string, FilaSearch>>(
    {},
  );

  // Cliente
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteQuery, setClienteQuery] = useState("");
  const [clienteResults, setClienteResults] = useState<Cliente[]>([]);

  // Cargar número de factura
  useEffect(() => {
    facturasService
      .getNextNumero()
      .then(setNro)
      .catch(() => setNro(null));
  }, []);

  // Buscar clientes
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!clienteQuery.trim()) {
        setClienteResults([]);
        return;
      }
      try {
        setClienteResults(await clientesService.getAll(clienteQuery, true));
      } catch {
        setClienteResults([]);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [clienteQuery]);

  // Seleccionar cliente y autocompletar deuda
  const seleccionarCliente = useCallback(async (c: Cliente) => {
    setClienteSeleccionado(c);
    setClienteNombre(c.nombre);
    setClienteQuery(c.nombre);
    setClienteResults([]);
    try {
      const deuda = await clientesService.getDeuda(c.id);
      setSaldoAnt(deuda.deudaMonetaria || "");
      setCajaDatos((prev) => ({
        ...prev,
        deuda: String(deuda.deudaCajas || ""),
      }));
    } catch {
      /* el usuario puede ingresar manualmente */
    }
  }, []);

  // Búsqueda de producto en una fila específica
  const buscarProductoEnFila = useCallback(
    async (filaId: string, query: string) => {
      setFilasSearch((prev) => ({
        ...prev,
        [filaId]: { query, results: prev[filaId]?.results ?? [] },
      }));
      try {
        const results = await productosService.getAll(query);
        setFilasSearch((prev) => ({ ...prev, [filaId]: { query, results } }));
      } catch {
        setFilasSearch((prev) => ({
          ...prev,
          [filaId]: { query, results: [] },
        }));
      }
    },
    [],
  );

  // Seleccionar producto en una fila
  const seleccionarProductoEnFila = useCallback(
    (filaId: string, p: Producto) => {
      setFilas((fs) =>
        fs.map((f) =>
          f.id === filaId ? { ...f, nombre: p.nombre, precio: p.precio } : f,
        ),
      );
      setFilasSearch((prev) => ({
        ...prev,
        [filaId]: { query: p.nombre, results: [] },
      }));
    },
    [],
  );

  // Cálculos
  const subtotal = filas.reduce((acc, f) => acc + f.qty * f.precio, 0);
  const totalGeneral = subtotal + (saldoAnt === "" ? 0 : saldoAnt);
  const totalPagado = pagos.reduce((acc, p) => acc + p.monto, 0);
  const saldoPendiente = totalGeneral - totalPagado;
  const cajaNuevoSaldo =
    Math.floor(parseFloat(cajaDatos.deuda) || 0) +
    Math.floor(parseFloat(cajaDatos.dejo) || 0) -
    Math.floor(parseFloat(cajaDatos.retiro) || 0);

  // Filas
  const agregarFila = () => setFilas((fs) => [...fs, filaVacia()]);
  const actualizarFila = (updated: FilaProducto) =>
    setFilas((fs) => fs.map((f) => (f.id === updated.id ? updated : f)));
  const eliminarFila = (id: string) => {
    setFilas((fs) => fs.filter((f) => f.id !== id));
    setFilasSearch((prev) => {
      const n = { ...prev };
      delete n[id];
      return n;
    });
  };

  // Pagos
  const agregarPago = () => setPagos((ps) => [...ps, pagoVacio()]);
  const actualizarPago = (updated: Pago) =>
    setPagos((ps) => ps.map((p) => (p.id === updated.id ? updated : p)));
  const eliminarPago = (id: string) =>
    setPagos((ps) => ps.filter((p) => p.id !== id));

  // Reset
  const reset = () => {
    setNro(null);
    setFecha(iso);
    setClienteSeleccionado(null);
    setClienteNombre("");
    setClienteQuery("");
    setClienteResults([]);
    setSaldoAnt("");
    setObs("");
    setCajaDatos({ deuda: "", dejo: "", retiro: "" });
    setFilas([filaVacia(), filaVacia(), filaVacia()]);
    setFilasSearch({});
    setPagos([]);
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
    saldoAnt,
    setSaldoAnt,
    obs,
    setObs,
    cajaDatos,
    setCajaDatos,
    cajaNuevoSaldo,
    filas,
    agregarFila,
    actualizarFila,
    eliminarFila,
    filasSearch,
    buscarProductoEnFila,
    seleccionarProductoEnFila,
    pagos,
    TIPOS_PAGO,
    agregarPago,
    actualizarPago,
    eliminarPago,
    subtotal,
    totalGeneral,
    totalPagado,
    saldoPendiente,
    clienteSeleccionado,
    clienteNombre,
    setClienteNombre,
    clienteQuery,
    setClienteQuery,
    clienteResults,
    seleccionarCliente,
    reset,
  };
}
