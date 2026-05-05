"use client";

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

interface Props {
  detalle: any;
  onClose: () => void;
}

export default function DetalleModal({ detalle, onClose }: Props) {
  return (
    <div
      className="modal-bg open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal w-[90%] max-w-xl max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3>Factura #{detalle.numero}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          <div>
            <div className="sec-title">Cliente</div>
            <p className="font-semibold mt-1">{detalle.clienteNombre}</p>
            <p className="text-[var(--muted)] text-xs mt-0.5">
              {detalle.fecha}
            </p>
          </div>

          <div>
            <div className="sec-title">Productos</div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[var(--cream)]">
                    <th className="p-2 text-left text-xs uppercase tracking-wide text-[var(--muted)]">
                      Producto
                    </th>
                    <th className="p-2 text-center text-xs uppercase tracking-wide text-[var(--muted)]">
                      Cant.
                    </th>
                    <th className="p-2 text-right text-xs uppercase tracking-wide text-[var(--muted)]">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detalle.lineas.map((l: any) => (
                    <tr key={l.id} className="border-b border-[var(--cream)]">
                      <td className="p-2">{l.nombre}</td>
                      <td className="p-2 text-center">{l.qty}</td>
                      <td className="p-2 text-right font-semibold">
                        {fmt(l.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {detalle.pagos.length > 0 && (
            <div>
              <div className="sec-title">Pagos</div>
              {detalle.pagos.map((p: any) => (
                <div
                  key={p.id}
                  className="flex justify-between py-1.5 border-b border-[var(--cream)]"
                >
                  <span className="font-semibold">{p.tipo}</span>
                  {p.detalle && (
                    <span className="text-[var(--muted)] flex-1 ml-2">
                      {p.detalle}
                    </span>
                  )}
                  <span className="font-bold">{fmt(p.monto)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="totals-box">
            <div className="t-row">
              <span className="t-lbl">Total General</span>
              <span className="t-val">{fmt(detalle.totalGeneral)}</span>
            </div>
            <div className="t-row">
              <span className="t-lbl">Total Pagado</span>
              <span className="t-val" style={{ color: "var(--sage)" }}>
                {fmt(detalle.totalPagado)}
              </span>
            </div>
            <div className="t-row grand">
              <span className="t-lbl">Saldo Pendiente</span>
              <span
                className="t-val"
                style={{
                  color:
                    detalle.saldoPendiente > 0 ? "var(--rust)" : "var(--sage)",
                }}
              >
                {fmt(detalle.saldoPendiente)}
              </span>
            </div>
          </div>

          {(detalle.cajaDeuda || detalle.cajaDejo || detalle.cajaRetiro) && (
            <div>
              <div className="sec-title">Movimiento de cajas</div>
              <div className="cajas-grid mb-2">
                {[
                  { label: "Deuda", value: detalle.cajaDeuda },
                  { label: "Dejo", value: detalle.cajaDejo },
                  { label: "Retiro", value: detalle.cajaRetiro },
                ].map(({ label, value }) => (
                  <div className="caja" key={label}>
                    <label className="caja-lbl">{label}</label>
                    <div className="font-bold text-base">{value ?? 0}</div>
                  </div>
                ))}
              </div>
              <div className="totals-box">
                <div className="t-row grand">
                  <span className="t-lbl">Nuevo saldo en cajas</span>
                  <span
                    className="t-val"
                    style={{
                      color:
                        detalle.cajaNuevoSaldo > 0
                          ? "var(--rust)"
                          : "var(--sage)",
                    }}
                  >
                    {Math.round(detalle.cajaNuevoSaldo)} cajas
                  </span>
                </div>
              </div>
            </div>
          )}

          {detalle.observaciones?.trim() && (
            <div>
              <div className="sec-title">Observaciones</div>
              <div className="bg-[var(--cream)] rounded-lg p-3 text-sm leading-relaxed border-l-2 border-[var(--gold)]">
                {detalle.observaciones}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
