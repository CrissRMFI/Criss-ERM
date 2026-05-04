"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useState, useEffect, useRef, useCallback } from "react";
import { Producto, FilaProducto, Pago } from "../types";

const TIPOS_PAGO = ["Efectivo", "Transferencia", "Otro"];

function fmt(n: number) {
  return "$ " + (isNaN(n) ? "0.00" : n.toFixed(2));
}

function today() {
  const h = new Date();
  const y = h.getFullYear();
  const m = String(h.getMonth() + 1).padStart(2, "0");
  const d = String(h.getDate()).padStart(2, "0");
  return { iso: `${y}-${m}-${d}`, display: `${d}/${m}/${y}` };
}

let _rowId = 0;
const newFila = (): FilaProducto => ({
  id: `r${_rowId++}`,
  nombre: "",
  precio: 0,
  qty: 1,
});
let _payId = 0;
const newPago = (): Pago => ({
  id: `p${_payId++}`,
  tipo: TIPOS_PAGO[0],
  detalle: "",
  monto: 0,
});

// ── Fila de producto ─────────────────────────────────────────────────────────
function FilaRow({
  fila,
  onChange,
  onDelete,
}: {
  fila: FilaProducto;
  onChange: (f: FilaProducto) => void;
  onDelete: () => void;
}) {
  const [query, setQuery] = useState(fila.nombre);
  const [results, setResults] = useState<Producto[]>([]);
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    try {
      const res = await fetch(`/api/productos?q=${encodeURIComponent(q)}`);
      setResults(await res.json());
    } catch {
      setResults([]);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 200);
    return () => clearTimeout(t);
  }, [query, search]);

  const pick = (p: Producto) => {
    setQuery(p.nombre);
    setDdOpen(false);
    onChange({ ...fila, nombre: p.nombre, precio: p.precio });
  };

  const subtotal = fila.qty * fila.precio;

  return (
    <tr>
      <td>
        <div className="prod-wrap" ref={ddRef}>
          <input
            className="td-in pname"
            type="text"
            placeholder="Buscar producto…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDdOpen(true);
            }}
            onFocus={() => {
              search(query);
              setDdOpen(true);
            }}
            onBlur={() => setTimeout(() => setDdOpen(false), 160)}
          />
          {ddOpen && (
            <div className="dd open">
              {results.length === 0 ? (
                <div className="dd-empty">Sin resultados</div>
              ) : (
                results.map((p) => (
                  <div
                    key={p.id}
                    className="dd-row"
                    onMouseDown={() => pick(p)}
                  >
                    <span>{p.nombre}</span>
                    <span className="dd-price">$ {p.precio.toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </td>
      <td className="c">
        <input
          className="td-in qty"
          type="number"
          min={1}
          value={fila.qty}
          onChange={(e) =>
            onChange({
              ...fila,
              qty: Math.max(1, parseInt(e.target.value) || 1),
            })
          }
        />
      </td>
      <td className="r">
        <input
          className="td-in price"
          type="number"
          placeholder="0.00"
          step="0.01"
          value={fila.precio || ""}
          onChange={(e) =>
            onChange({ ...fila, precio: parseFloat(e.target.value) || 0 })
          }
        />
      </td>
      <td>
        <span className="row-sub">{fmt(subtotal)}</span>
      </td>
      <td>
        <button className="del-row" onClick={onDelete}>
          ✕
        </button>
      </td>
    </tr>
  );
}

// ── Fila de pago ─────────────────────────────────────────────────────────────
function PagoItem({
  pago,
  onChange,
  onDelete,
}: {
  pago: Pago;
  onChange: (p: Pago) => void;
  onDelete: () => void;
}) {
  return (
    <div className="pay-item">
      <select
        value={pago.tipo}
        onChange={(e) => onChange({ ...pago, tipo: e.target.value })}
      >
        {TIPOS_PAGO.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <input
        type="text"
        className="pay-detail"
        placeholder="Detalle…"
        value={pago.detalle}
        onChange={(e) => onChange({ ...pago, detalle: e.target.value })}
      />
      <input
        type="number"
        className="pay-amount"
        placeholder="0.00"
        step="0.01"
        value={pago.monto || ""}
        onChange={(e) =>
          onChange({ ...pago, monto: parseFloat(e.target.value) || 0 })
        }
      />
      <button className="del-btn" onClick={onDelete}>
        ✕
      </button>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function FacturaPage() {
  const { iso, display } = today();
  const [fecha, setFecha] = useState(iso);
  const [nro, setNro] = useState("0001");
  const [cliente, setCliente] = useState("");
  const [filas, setFilas] = useState<FilaProducto[]>([
    newFila(),
    newFila(),
    newFila(),
  ]);
  const [saldoAnt, setSaldoAnt] = useState<number | "">("");
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [cajaDatos, setCajaDatos] = useState({
    deuda: "",
    dejo: "",
    retiro: "",
  });
  const [obs, setObs] = useState("");
  const [waOpen, setWaOpen] = useState(false);
  const [toast, setToast] = useState({ msg: "", show: false });
  const cardRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2400);
  };

  const subtotal = filas.reduce((acc, f) => acc + f.qty * f.precio, 0);
  const totalGeneral = subtotal + (saldoAnt === "" ? 0 : saldoAnt);
  const totalPagado = pagos.reduce((acc, p) => acc + p.monto, 0);
  const saldoPendiente = totalGeneral - totalPagado;

  // ── PDF / Canvas capture ─────────────────────────────────────────────────
  const capture = async () => {
    return html2canvas(cardRef.current!, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
  };

  const exportPDF = async () => {
    showToast("Generando PDF…");
    const canvas = await capture();
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();
    const ih = (canvas.height * pw) / canvas.width;
    if (ih <= ph) {
      pdf.addImage(img, "PNG", 0, 0, pw, ih);
    } else {
      let y = 0,
        rem = ih,
        pg = 0;
      while (rem > 0) {
        if (pg > 0) pdf.addPage();
        pdf.addImage(img, "PNG", 0, -y, pw, ih);
        y += ph;
        rem -= ph;
        pg++;
      }
    }
    pdf.save(
      `factura_${nro}_${cliente.replace(/\s+/g, "_") || "cliente"}_${fecha}.pdf`,
    );
  };

  const exportWA = async () => {
    setWaOpen(false);
    showToast("Generando imagen…");
    const canvas = await capture();
    const link = document.createElement("a");
    link.download = `factura_${nro}_${cliente.replace(/\s+/g, "_") || "cliente"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setTimeout(() => window.open("https://web.whatsapp.com", "_blank"), 900);
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Nueva Factura</h1>
        <div className="btn-group">
          <button className="btn btn-wa" onClick={() => setWaOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>
          <button className="btn btn-primary" onClick={exportPDF}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            PDF
          </button>
        </div>
      </div>

      <div className="card" id="invoice-card" ref={cardRef}>
        {/* HEADER */}
        <div className="inv-header">
          <div>
            <div className="brand-name">Factura</div>
            <div className="brand-sub">Comprobante de Venta</div>
            <div className="badge-factura">Original</div>
          </div>
          <div className="meta-grid">
            <div className="meta-item">
              <span className="meta-label">N° Factura</span>
              <input
                type="text"
                className="meta-input nro-input"
                value={nro}
                onChange={(e) => setNro(e.target.value)}
              />
            </div>
            <div className="meta-item">
              <span className="meta-label">Fecha</span>
              <input
                type="date"
                className="meta-input"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="inv-body">
          {/* CLIENTE */}
          <div>
            <div className="sec-title">Datos del cliente</div>
            <label className="field-label">Nombre del Cliente</label>
            <input
              type="text"
              className="field-input"
              placeholder="Nombre completo…"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </div>

          {/* PRODUCTOS */}
          <div>
            <div className="sec-title">Productos / Servicios</div>
            <table className="ptable">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="c">Cant.</th>
                  <th className="pw r">P. Unit.</th>
                  <th className="ps r">Subtotal</th>
                  <th className="dx"></th>
                </tr>
              </thead>
              <tbody>
                {filas.map((f) => (
                  <FilaRow
                    key={f.id}
                    fila={f}
                    onChange={(updated) =>
                      setFilas((fs) =>
                        fs.map((x) => (x.id === updated.id ? updated : x)),
                      )
                    }
                    onDelete={() =>
                      setFilas((fs) => fs.filter((x) => x.id !== f.id))
                    }
                  />
                ))}
              </tbody>
            </table>
            <button
              className="add-row-btn"
              onClick={() => setFilas((fs) => [...fs, newFila()])}
            >
              + Agregar producto
            </button>
          </div>

          {/* TOTALES */}
          <div>
            <div className="sec-title">Resumen de cuenta</div>
            <div className="totals-box">
              <div className="t-row">
                <span className="t-lbl">Subtotal productos</span>
                <span className="t-val">{fmt(subtotal)}</span>
              </div>
              <div className="t-row">
                <span className="t-lbl">Saldo Anterior</span>
                <input
                  type="number"
                  className="t-inp"
                  placeholder="0.00"
                  step="0.01"
                  value={saldoAnt}
                  onChange={(e) =>
                    setSaldoAnt(
                      e.target.value === "" ? "" : parseFloat(e.target.value),
                    )
                  }
                />
              </div>
              <div className="t-row grand">
                <span className="t-lbl">Total General</span>
                <span className="t-val">{fmt(totalGeneral)}</span>
              </div>
            </div>
          </div>

          {/* PAGOS */}
          <div>
            <div className="sec-title">Pagos recibidos</div>
            <div className="pay-list">
              {pagos.map((p) => (
                <PagoItem
                  key={p.id}
                  pago={p}
                  onChange={(updated) =>
                    setPagos((ps) =>
                      ps.map((x) => (x.id === updated.id ? updated : x)),
                    )
                  }
                  onDelete={() =>
                    setPagos((ps) => ps.filter((x) => x.id !== p.id))
                  }
                />
              ))}
            </div>
            <button
              className="add-pay-btn"
              onClick={() => setPagos((ps) => [...ps, newPago()])}
            >
              + Agregar pago
            </button>
            <div className="totals-box" style={{ marginTop: 12 }}>
              <div className="t-row">
                <span className="t-lbl">Total Pagado</span>
                <span className="t-val" style={{ color: "var(--sage)" }}>
                  {fmt(totalPagado)}
                </span>
              </div>
              <div className="t-row grand">
                <span className="t-lbl">Saldo Pendiente</span>
                <span
                  className="t-val"
                  style={{
                    color:
                      saldoPendiente > 0.005 ? "var(--rust)" : "var(--sage)",
                  }}
                >
                  {fmt(saldoPendiente)}
                </span>
              </div>
            </div>
          </div>

          {/* CAJAS */}
          <div>
            <div className="sec-title">Movimiento de cajas</div>
            <div className="cajas-grid">
              {(["deuda", "dejo", "retiro"] as const).map((k) => (
                <div className="caja" key={k}>
                  <label className="caja-lbl">
                    {k === "deuda" ? "Deuda" : k === "dejo" ? "Dejó" : "Retiró"}
                  </label>
                  <input
                    type="text"
                    placeholder="—"
                    value={cajaDatos[k]}
                    onChange={(e) =>
                      setCajaDatos((c) => ({ ...c, [k]: e.target.value }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* OBSERVACIONES */}
          <div>
            <div className="sec-title">Observaciones</div>
            <textarea
              className="field-input"
              placeholder="Notas, aclaraciones…"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
            />
          </div>
        </div>

        <div className="inv-footer">
          <span>Generado el {display}</span>
          <span>Documento no fiscal · Solo para control interno</span>
        </div>
      </div>

      {/* MODAL WA */}
      <div
        className={`modal-bg ${waOpen ? "open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && setWaOpen(false)}
      >
        <div className="modal wa-modal">
          <h3>Compartir por WhatsApp</h3>
          <p>
            La factura se descargará como imagen PNG. Luego se abrirá WhatsApp
            Web para que la adjuntes y envíes.
          </p>
          <div className="modal-btns">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setWaOpen(false)}
            >
              Cancelar
            </button>
            <button className="btn btn-wa btn-sm" onClick={exportWA}>
              Descargar y abrir WhatsApp
            </button>
          </div>
        </div>
      </div>

      <div className={`toast ${toast.show ? "show" : ""}`}>{toast.msg}</div>
    </>
  );
}
