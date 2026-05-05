"use client";

import { useHistorial } from "../../hooks/useHistorial";

interface Props {
  clienteId: string;
  clienteNombre: string;
  onClose: () => void;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function HistorialCliente({
  clienteId,
  clienteNombre,
  onClose,
}: Props) {
  const { facturas, loading } = useHistorial(clienteId);

  return (
    <div
      className="modal-bg open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal w-[90%] max-w-xl max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3>Historial</h3>
            <p className="text-sm text-[var(--muted)] mt-0.5">
              {clienteNombre}
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Cerrar
          </button>
        </div>

        {loading ? (
          <div className="empty-state">Cargando…</div>
        ) : facturas.length === 0 ? (
          <div className="empty-state">Sin facturas aún.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="prod-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th className="hidden sm:table-cell">Fecha</th>
                  <th className="r">Total</th>
                  <th className="r hidden sm:table-cell">Pagado</th>
                  <th className="r">Pendiente</th>
                </tr>
              </thead>
              <tbody>
                {facturas.map((f: any) => (
                  <tr key={f.id}>
                    <td className="font-bold text-[var(--gold)]">
                      #{f.numero}
                    </td>
                    <td className="hidden sm:table-cell text-sm">{f.fecha}</td>
                    <td className="r font-semibold">{fmt(f.totalGeneral)}</td>
                    <td className="r hidden sm:table-cell text-[var(--sage)]">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
