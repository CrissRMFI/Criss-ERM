"use client";

import { useState } from "react";
import { useCliente } from "../../hooks/useCliente";
import { useHistorial } from "../../hooks/useHistorial";
import DetalleModal from "../historial/DetalleModal";
import Link from "next/link";

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

interface Props {
  clienteId: string;
}

export default function ClienteHistorialPage({ clienteId }: Props) {
  const { cliente, loading: loadingCliente } = useCliente(clienteId);
  const { facturas, loading: loadingFacturas } = useHistorial(clienteId);
  const [detalle, setDetalle] = useState<any | null>(null);
  const [search, setSearch] = useState("");

  const filtradas = facturas.filter(
    (f) => String(f.numero).includes(search) || f.fecha.includes(search),
  );

  if (loadingCliente) return <div className="empty-state">Cargando…</div>;
  if (!cliente)
    return <div className="empty-state">Cliente no encontrado.</div>;

  return (
    <>
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/clientes"
              className="text-sm text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
            >
              ← Clientes
            </Link>
          </div>
          <h1 className="page-title">{cliente.nombre}</h1>
          <div className="flex flex-wrap gap-4 mt-1 text-sm text-[var(--muted)]">
            {cliente.telefono && <span>📞 {cliente.telefono}</span>}
            {cliente.direccion && <span>📍 {cliente.direccion}</span>}
          </div>
          {cliente.notas && (
            <div className="mt-2 text-sm text-[var(--muted)] italic">
              📝 {cliente.notas}
            </div>
          )}
        </div>
      </div>

      {/* DEUDA ACTUAL */}
      {facturas.length > 0 && (
        <div className="card mb-5 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
                Deuda monetaria
              </div>
              <div
                className="text-xl font-bold"
                style={{
                  color:
                    facturas[0].saldoPendiente > 0
                      ? "var(--rust)"
                      : "var(--sage)",
                }}
              >
                {fmt(facturas[0].saldoPendiente)}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
                Deuda en cajas
              </div>
              <div
                className="text-xl font-bold"
                style={{
                  color:
                    facturas[0].cajaNuevoSaldo > 0
                      ? "var(--rust)"
                      : "var(--sage)",
                }}
              >
                {facturas[0].cajaNuevoSaldo} cajas
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
                Facturas
              </div>
              <div className="text-xl font-bold text-[var(--ink)]">
                {facturas.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BUSCAR */}
      <div className="search-bar mb-4">
        <input
          type="text"
          placeholder="Buscar por número o fecha…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="prod-count">
        {loadingFacturas
          ? ""
          : `${filtradas.length} factura${filtradas.length !== 1 ? "s" : ""}`}
      </div>

      {/* TABLA */}
      <div className="card overflow-x-auto">
        {loadingFacturas ? (
          <div className="empty-state">Cargando…</div>
        ) : filtradas.length === 0 ? (
          <div className="empty-state">Sin facturas aún.</div>
        ) : (
          <table className="prod-table">
            <thead>
              <tr>
                <th>N°</th>
                <th className="hidden sm:table-cell">Fecha</th>
                <th className="r hidden sm:table-cell">Total</th>
                <th className="r hidden sm:table-cell">Pagado</th>
                <th className="r">Pendiente</th>
                <th className="r">Cajas</th>
                <th className="r"></th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((f) => (
                <tr key={f.id}>
                  <td className="font-bold text-[var(--gold)]">#{f.numero}</td>
                  <td className="hidden sm:table-cell text-sm">{f.fecha}</td>
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
                        f.saldoPendiente > 0 ? "var(--rust)" : "var(--sage)",
                    }}
                  >
                    {fmt(f.saldoPendiente)}
                  </td>
                  <td className="r text-sm text-[var(--muted)]">
                    {f.cajaNuevoSaldo} cj
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
    </>
  );
}
