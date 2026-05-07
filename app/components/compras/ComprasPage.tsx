"use client";

import { useState } from "react";
import { useCompras, Compra } from "../../hooks/useCompras";
import { useToast } from "../../hooks/useToast";
import NuevaCompraModal from "./NuevaCompraModal";
import RetirarModal from "./RetirarModal";
import PagarCompraModal from "./PagarCompraModal";
import Toast from "../../ui/Toast";

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

const ESTADO_STYLE: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  COMPLETADA: "bg-green-100 text-[var(--sage)]",
  CANCELADA: "bg-red-100 text-red-600",
};

export default function ComprasPage() {
  const { compras, loading, error, crear, retirar, pagar, cancelar, refetch } =
    useCompras();

  const { toast, showToast } = useToast();

  const [nuevaOpen, setNuevaOpen] = useState(false);
  const [retirarCompra, setRetirarCompra] = useState<Compra | null>(null);
  const [pagarCompra, setPagarCompra] = useState<Compra | null>(null);

  const handleCancelar = async (compra: Compra) => {
    if (
      !confirm(
        `¿Cancelar la compra del ${compra.fecha}? Esta acción es irreversible.`,
      )
    ) {
      return;
    }

    try {
      const result = await cancelar(compra.id);

      if (result.advertencias?.length) {
        alert(
          `Compra cancelada con advertencias:\n${result.advertencias.join(
            "\n",
          )}\n\nDinero a devolver: ${fmt(result.totalPagado)}`,
        );
      } else {
        showToast(`Compra cancelada — Devolución: ${fmt(result.totalPagado)}`);
      }
    } catch (e: any) {
      showToast(e.message ?? "Error al cancelar");
    }
  };

  if (error) {
    return <div className="empty-state">Error al cargar compras.</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-5">
        <h1 className="page-title">Compras</h1>

        <button
          className="btn btn-primary shrink-0 px-4 py-2 text-sm"
          onClick={() => setNuevaOpen(true)}
        >
          <span className="hidden sm:inline">+ Nueva compra</span>
          <span className="sm:hidden">+ Nueva</span>
        </button>
      </div>

      {loading ? (
        <div className="card">
          <div className="empty-state">Cargando…</div>
        </div>
      ) : compras.length === 0 ? (
        <div className="card">
          <div className="empty-state">No hay compras registradas.</div>
        </div>
      ) : (
        <>
          {/* MOBILE */}
          <div className="md:hidden space-y-3">
            {compras.map((c) => {
              const totalCompra = c.lineas.reduce(
                (acc, l) => acc + l.cantidadTotal * l.precioCosto,
                0,
              );

              const totalPagado = c.pagos.reduce((acc, p) => acc + p.monto, 0);

              const pendienteRetiro = c.lineas.some(
                (l) => l.cantidadRetirada < l.cantidadTotal,
              );

              return (
                <article
                  key={c.id}
                  className={`rounded-2xl border border-[var(--border)] bg-white p-4 shadow-sm ${
                    c.estado === "CANCELADA" ? "opacity-40" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                        Fecha
                      </p>
                      <p className="mt-1 font-semibold text-[var(--ink)]">
                        {c.fecha}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold uppercase tracking-wide ${
                        ESTADO_STYLE[c.estado]
                      }`}
                    >
                      {c.estado}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-[var(--muted)]">Proveedor</span>
                      <span className="text-right font-medium text-[var(--ink)]">
                        {c.proveedor?.nombre || "—"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-[var(--muted)]">Total</span>
                      <span className="font-bold text-[var(--ink)]">
                        {fmt(totalCompra)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-[var(--muted)]">Pagado</span>
                      <span className="font-semibold text-[var(--sage)]">
                        {fmt(totalPagado)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-[var(--cream)] pt-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
                      Productos
                    </p>

                    <div className="space-y-1">
                      {c.lineas.map((l) => (
                        <div key={l.id} className="text-sm text-[var(--ink)]">
                          <span className="font-medium">
                            {l.producto.nombre}
                          </span>{" "}
                          <span className="text-[var(--muted)]">
                            {l.cantidadRetirada}/{l.cantidadTotal}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {c.estado !== "CANCELADA" && (
                    <div className="mt-4 flex flex-col w-full justify-center align-middle">
                      {pendienteRetiro && (
                        <button
                          className="btn btn-wa btn-sm w-full justify-center"
                          onClick={() => setRetirarCompra(c)}
                        >
                          Retirar
                        </button>
                      )}

                      {totalPagado < totalCompra && (
                        <button
                          className="btn btn-ghost-pay btn-ghost btn-sm w-full justify-center"
                          onClick={() => setPagarCompra(c)}
                        >
                          Pagar
                        </button>
                      )}

                      <button
                        className="btn btn-danger btn-sm w-full justify-center"
                        onClick={() => handleCancelar(c)}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* DESKTOP */}
          <div className="hidden md:block card overflow-x-auto">
            <table className="prod-table min-w-[780px]">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>Productos</th>
                  <th className="r">Total</th>
                  <th className="r">Pagado</th>
                  <th>Estado</th>
                  <th className="r">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {compras.map((c) => {
                  const totalCompra = c.lineas.reduce(
                    (acc, l) => acc + l.cantidadTotal * l.precioCosto,
                    0,
                  );

                  const totalPagado = c.pagos.reduce(
                    (acc, p) => acc + p.monto,
                    0,
                  );

                  const pendienteRetiro = c.lineas.some(
                    (l) => l.cantidadRetirada < l.cantidadTotal,
                  );

                  return (
                    <tr
                      key={c.id}
                      className={c.estado === "CANCELADA" ? "opacity-40" : ""}
                    >
                      <td>{c.fecha}</td>

                      <td className="text-[var(--muted)]">
                        {c.proveedor?.nombre || "—"}
                      </td>

                      <td>
                        <div className="flex flex-col gap-0.5">
                          {c.lineas.map((l) => (
                            <span key={l.id} className="text-sm">
                              {l.producto.nombre} —{" "}
                              <span className="text-[var(--muted)]">
                                {l.cantidadRetirada}/{l.cantidadTotal}
                              </span>
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="r font-semibold">{fmt(totalCompra)}</td>

                      <td className="r text-[var(--sage)]">
                        {fmt(totalPagado)}
                      </td>

                      <td>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${
                            ESTADO_STYLE[c.estado]
                          }`}
                        >
                          {c.estado}
                        </span>
                      </td>

                      <td className="r">
                        {c.estado !== "CANCELADA" && (
                          <div className="flex  gap-2 w-full justify-end">
                            {pendienteRetiro && (
                              <button
                                className="btn btn-wa btn-sm w-full"
                                onClick={() => setRetirarCompra(c)}
                              >
                                Retirar
                              </button>
                            )}

                            {totalPagado < totalCompra && (
                              <button
                                className="btn btn-ghost btn-sm w-full"
                                onClick={() => setPagarCompra(c)}
                              >
                                Pagar
                              </button>
                            )}

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleCancelar(c)}
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {nuevaOpen && (
        <NuevaCompraModal
          onClose={() => setNuevaOpen(false)}
          onGuardado={refetch}
          onCreate={crear}
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

      {pagarCompra && (
        <PagarCompraModal
          compra={pagarCompra}
          onClose={() => setPagarCompra(null)}
          onGuardado={refetch}
          onPagar={pagar}
        />
      )}

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
