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
  const { compras, loading, error, retirar, pagar, cancelar, refetch } =
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
    )
      return;
    try {
      const result = await cancelar(compra.id);
      if (result.advertencias?.length) {
        alert(
          `Compra cancelada con advertencias:\n${result.advertencias.join("\n")}\n\nDinero a devolver: ${fmt(result.totalPagado)}`,
        );
      } else {
        showToast(`Compra cancelada — Devolución: ${fmt(result.totalPagado)}`);
      }
    } catch (e: any) {
      showToast(e.message ?? "Error al cancelar");
    }
  };

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
                <th className="hidden md:table-cell">Productos</th>
                <th className="r hidden sm:table-cell">Total</th>
                <th className="r hidden sm:table-cell">Pagado</th>
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
                    <td className="hidden sm:table-cell text-[var(--muted)]">
                      {c.proveedor?.nombre || "—"}
                    </td>
                    <td className="hidden md:table-cell">
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
                    <td className="r hidden sm:table-cell font-semibold">
                      {fmt(totalCompra)}
                    </td>
                    <td
                      className="r hidden sm:table-cell"
                      style={{ color: "var(--sage)" }}
                    >
                      {fmt(totalPagado)}
                    </td>
                    <td>
                      <span
                        className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${ESTADO_STYLE[c.estado]}`}
                      >
                        {c.estado}
                      </span>
                    </td>
                    <td className="r">
                      {c.estado !== "CANCELADA" && (
                        <div className="row-actions">
                          {pendienteRetiro && (
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => setRetirarCompra(c)}
                            >
                              Retirar
                            </button>
                          )}
                          {totalPagado < totalCompra && (
                            <button
                              className="btn btn-ghost btn-sm"
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
