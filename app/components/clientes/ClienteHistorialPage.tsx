"use client";

import { useState } from "react";
import { useCliente } from "../../hooks/useCliente";
import { useHistorial } from "../../hooks/useHistorial";
import { useToast } from "../../hooks/useToast";
import DetalleModal from "../historial/DetalleModal";
import Toast from "../../ui/Toast";
import Link from "next/link";

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

interface Props {
  clienteId: string;
}

export default function ClienteHistorialPage({ clienteId }: Props) {
  const { cliente, loading: loadingCliente } = useCliente(clienteId);
  const [verAnuladas, setVerAnuladas] = useState(false);
  const {
    facturas,
    loading: loadingFacturas,
    anular,
  } = useHistorial(clienteId, verAnuladas);
  const [detalle, setDetalle] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const { toast, showToast } = useToast();

  const filtradas = facturas.filter(
    (f) => String(f.numero).includes(search) || f.fecha.includes(search),
  );

  // Última factura no anulada del cliente
  const ultimaFactura = facturas.find((f) => !f.anulada);

  const handleAnular = async (id: string) => {
    await anular(id);
    setDetalle(null);
    showToast("Factura anulada");
  };

  if (loadingCliente) return <div className="empty-state">Cargando…</div>;
  if (!cliente)
    return <div className="empty-state">Cliente no encontrado.</div>;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="mb-1">
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
      {ultimaFactura && (
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
                    ultimaFactura.saldoPendiente > 0
                      ? "var(--rust)"
                      : "var(--sage)",
                }}
              >
                {fmt(ultimaFactura.saldoPendiente)}
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
                    ultimaFactura.cajaNuevoSaldo > 0
                      ? "var(--rust)"
                      : "var(--sage)",
                }}
              >
                {ultimaFactura.cajaNuevoSaldo} cajas
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
                Facturas
              </div>
              <div className="text-xl font-bold text-[var(--ink)]">
                {facturas.filter((f) => !f.anulada).length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FILTROS */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="search-bar flex-1 min-w-[200px] mb-0">
          <input
            type="text"
            placeholder="Buscar por número o fecha…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--muted)] cursor-pointer">
          <input
            type="checkbox"
            checked={verAnuladas}
            onChange={(e) => setVerAnuladas(e.target.checked)}
          />
          Ver anuladas
        </label>
      </div>

      <div className="prod-count">
        {loadingFacturas
          ? ""
          : `${filtradas.length} factura${filtradas.length !== 1 ? "s" : ""}`}
      </div>

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
                <tr key={f.id} className={f.anulada ? "opacity-40" : ""}>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--gold)]">
                        #{f.numero}
                      </span>
                      {f.anulada && (
                        <span className="text-xs font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-500">
                          Anulada
                        </span>
                      )}
                    </div>
                  </td>
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
        <DetalleModal
          detalle={detalle}
          onClose={() => setDetalle(null)}
          onAnular={handleAnular}
          puedeAnular={ultimaFactura?.id === detalle.id}
        />
      )}

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
