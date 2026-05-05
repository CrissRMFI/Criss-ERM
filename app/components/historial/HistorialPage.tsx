"use client";

import { useState } from "react";
import { useHistorial } from "../../hooks/useHistorial";
import { useToast } from "../../hooks/useToast";
import DetalleModal from "./DetalleModal";
import Toast from "../../ui/Toast";

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function HistorialPage() {
  const { facturas, loading, error } = useHistorial();
  const [search, setSearch] = useState("");
  const [detalle, setDetalle] = useState<any | null>(null);
  const { toast } = useToast();

  const filtradas = facturas.filter(
    (f) =>
      f.clienteNombre.toLowerCase().includes(search.toLowerCase()) ||
      String(f.numero).includes(search),
  );

  if (error)
    return <div className="empty-state">Error al cargar el historial.</div>;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="page-title">Historial</h1>
      </div>

      <div className="search-bar mb-4">
        <input
          type="text"
          placeholder="Buscar por cliente o número…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="prod-count">
        {loading
          ? ""
          : `${filtradas.length} factura${filtradas.length !== 1 ? "s" : ""}`}
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="empty-state">Cargando…</div>
        ) : filtradas.length === 0 ? (
          <div className="empty-state">No hay facturas aún.</div>
        ) : (
          <table className="prod-table">
            <thead>
              <tr>
                <th>N°</th>
                <th className="hidden sm:table-cell">Fecha</th>
                <th>Cliente</th>
                <th className="r hidden sm:table-cell">Total</th>
                <th className="r hidden sm:table-cell">Pagado</th>
                <th className="r">Pendiente</th>
                <th className="r"></th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((f) => (
                <tr key={f.id}>
                  <td className="font-bold text-[var(--gold)]">#{f.numero}</td>
                  <td className="hidden sm:table-cell text-sm">{f.fecha}</td>
                  <td className="font-medium">{f.clienteNombre}</td>
                  <td className="r font-semibold hidden sm:table-cell">
                    {fmt(f.totalGeneral)}
                  </td>
                  <td
                    className="r hidden sm:table-cell"
                    style={{ color: "var(--sage)" }}
                  >
                    {fmt(f.totalPagado)}
                  </td>
                  <td
                    className="r font-bold"
                    style={{
                      color:
                        f.saldoPendiente > 0.005
                          ? "var(--rust)"
                          : "var(--sage)",
                    }}
                  >
                    {fmt(f.saldoPendiente)}
                  </td>
                  <td className="r">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => setDetalle(f)}
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {detalle && (
        <DetalleModal detalle={detalle} onClose={() => setDetalle(null)} />
      )}

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
