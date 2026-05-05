"use client";

import { useState } from "react";
import { useCompras, Compra } from "../../hooks/useCompras";
import { useToast } from "../../hooks/useToast";
import NuevaCompraModal from "./NuevaCompraModal";
import RetirarModal from "./RetirarModal";
import Toast from "../../ui/Toast";

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function ComprasPage() {
  const { compras, loading, error, retirar, refetch } = useCompras();
  const { toast, showToast } = useToast();
  const [nuevaOpen, setNuevaOpen] = useState(false);
  const [retirarCompra, setRetirarCompra] = useState<Compra | null>(null);

  if (error) return <div className="empty-state">Error al cargar compras.</div>;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h1 className="page-title">Compras</h1>
        <button className="btn btn-primary" onClick={() => setNuevaOpen(true)}>
          + Nueva compra
        </button>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="empty-state">Cargando…</div>
        ) : compras.length === 0 ? (
          <div className="empty-state">No hay compras registradas.</div>
        ) : (
          <table className="prod-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th className="hidden sm:table-cell">Proveedor</th>
                <th>Productos</th>
                <th className="r">Estado</th>
                <th className="r"></th>
              </tr>
            </thead>
            <tbody>
              {compras.map((c) => {
                const pendiente = c.lineas.some(
                  (l) => l.cantidadRetirada < l.cantidadTotal,
                );
                return (
                  <tr key={c.id}>
                    <td>{c.fecha}</td>
                    <td className="hidden sm:table-cell text-[var(--muted)]">
                      {c.proveedor || "—"}
                    </td>
                    <td>
                      <div className="flex flex-col gap-0.5">
                        {c.lineas.map((l) => (
                          <span key={l.id} className="text-sm">
                            {l.producto.nombre} —{" "}
                            <span className="text-[var(--muted)]">
                              {l.cantidadRetirada}/{l.cantidadTotal} retiradas
                            </span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="r">
                      <span
                        className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full
                        ${
                          pendiente
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-[var(--sage)]"
                        }`}
                      >
                        {pendiente ? "Pendiente" : "Completa"}
                      </span>
                    </td>
                    <td className="r">
                      {pendiente && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setRetirarCompra(c)}
                        >
                          Retirar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {nuevaOpen && (
        <NuevaCompraModal
          onClose={() => setNuevaOpen(false)}
          onGuardado={refetch}
        />
      )}

      {retirarCompra && (
        <RetirarModal
          compra={retirarCompra}
          onClose={() => setRetirarCompra(null)}
          onGuardado={() => {
            refetch();
            setRetirarCompra(null);
          }}
        />
      )}

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
