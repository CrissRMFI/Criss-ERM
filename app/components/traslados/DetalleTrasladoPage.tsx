"use client";

import { useRef, useState } from "react";
import { useTraslado } from "../../hooks/useTraslado";
import { useExport } from "../../hooks/useExports";
import { useToast } from "../../hooks/useToast";
import MovimientoExport from "./MovimientoExport";
import Toast from "../../ui/Toast";
import Link from "next/link";

interface Props {
  trasladoId: string;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function DetalleTrasladoPage({ trasladoId }: Props) {
  const { traslado, loading, error } = useTraslado(trasladoId);
  const exportRef = useRef<HTMLDivElement>(null);
  const { exportWA } = useExport(exportRef);
  const { toast, showToast } = useToast();
  const [sending, setSending] = useState(false);

  const handleWA = async () => {
    if (!traslado) return;
    setSending(true);
    showToast("Generando imagen…");
    try {
      await exportWA(
        traslado.numeroMovimiento,
        `MOV-${String(traslado.numeroMovimiento).padStart(3, "0")}`,
      );
    } catch {
      showToast("Error al generar imagen");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="empty-state">Cargando…</div>;
  if (error || !traslado)
    return <div className="empty-state">Traslado no encontrado.</div>;

  const nroMov = `MOV-${String(traslado.numeroMovimiento).padStart(3, "0")}`;
  const totalCosto = traslado.lineas.reduce(
    (acc, l) => acc + l.cantidad * l.precioCosto,
    0,
  );

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <Link
            href="/traslados"
            className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors mb-1 block"
          >
            ← Traslados
          </Link>
          <h1 className="page-title">{nroMov}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {traslado.origen.nombre} → {traslado.destino.nombre} ·{" "}
            {traslado.fecha}
          </p>
        </div>
        <button className="btn btn-wa" onClick={handleWA} disabled={sending}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          {sending ? "Generando…" : "WhatsApp"}
        </button>
      </div>

      {/* DETALLE */}
      <div className="card">
        {/* HEADER */}
        <div className="inv-header">
          <div>
            <div className="brand-name">{nroMov}</div>
            <div className="brand-sub">Comprobante de traslado</div>
            <div className="badge-factura">Interno</div>
          </div>
          <div className="meta-grid">
            <div className="meta-item">
              <span className="meta-label">Fecha</span>
              <span
                className="meta-input"
                style={{ border: "none", background: "transparent" }}
              >
                {traslado.fecha}
              </span>
            </div>
          </div>
        </div>

        <div className="inv-body">
          {/* ORIGEN / DESTINO */}
          <div>
            <div className="sec-title">Movimiento</div>
            <div className="cajas-grid">
              <div className="caja">
                <label className="caja-lbl">Origen</label>
                <div className="font-bold">{traslado.origen.nombre}</div>
              </div>
              <div
                className="caja"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  background: "transparent",
                }}
              >
                <span className="text-2xl text-[var(--gold)]">→</span>
              </div>
              <div className="caja">
                <label className="caja-lbl">Destino</label>
                <div className="font-bold">{traslado.destino.nombre}</div>
              </div>
            </div>
          </div>

          {/* PRODUCTOS */}
          <div>
            <div className="sec-title">Productos</div>
            <div className="overflow-x-auto">
              <table className="ptable">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="c">Cant.</th>
                    <th className="r hidden sm:table-cell">P. Costo</th>
                    <th className="r">Total costo</th>
                  </tr>
                </thead>
                <tbody>
                  {traslado.lineas.map((l) => (
                    <tr key={l.id}>
                      <td className="font-medium">{l.producto.nombre}</td>
                      <td className="c">{l.cantidad}</td>
                      <td className="r hidden sm:table-cell text-[var(--muted)]">
                        {fmt(l.precioCosto)}
                      </td>
                      <td className="r font-semibold">
                        {fmt(l.cantidad * l.precioCosto)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TOTAL */}
          <div className="totals-box">
            <div className="t-row grand">
              <span className="t-lbl">Total en costo</span>
              <span className="t-val">{fmt(totalCosto)}</span>
            </div>
          </div>

          {/* OBSERVACIONES */}
          {traslado.observaciones?.trim() && (
            <div>
              <div className="sec-title">Observaciones</div>
              <div className="bg-[var(--cream)] rounded-lg p-3 text-sm leading-relaxed border-l-2 border-[var(--gold)]">
                {traslado.observaciones}
              </div>
            </div>
          )}
        </div>

        <div className="inv-footer">
          <span>Documento interno · Criss ERM</span>
        </div>
      </div>

      {/* Export invisible */}
      <div className="absolute -top-[9999px] -left-[9999px] pointer-events-none">
        <div ref={exportRef}>
          <MovimientoExport traslado={traslado} />
        </div>
      </div>

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
