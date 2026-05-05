"use client";

import { useRef, useState } from "react";
import FacturaExport from "../factura/FacturaExport";
import { useExport } from "../../hooks/useExports";
import { useToast } from "../../hooks/useToast";
import Toast from "../../ui/Toast";

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

interface Props {
  detalle: any;
  onClose: () => void;
}

export default function DetalleModal({ detalle, onClose }: Props) {
  const exportRef = useRef<HTMLDivElement>(null);
  const { exportWA } = useExport(exportRef);
  const { toast, showToast } = useToast();
  const [sending, setSending] = useState(false);

  const handleWA = async () => {
    setSending(true);
    showToast("Generando imagen…");
    try {
      await exportWA(detalle.numero, detalle.clienteNombre);
    } catch {
      showToast("Error al generar imagen");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div
        className="modal-bg open"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal w-[90%] max-w-xl max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3>Factura #{detalle.numero}</h3>
            <div className="flex gap-2">
              <button
                className="btn btn-wa btn-sm"
                onClick={handleWA}
                disabled={sending}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {sending ? "Generando…" : "WhatsApp"}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={onClose}>
                Cerrar
              </button>
            </div>
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
                      detalle.saldoPendiente > 0
                        ? "var(--rust)"
                        : "var(--sage)",
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

      {/* Componente invisible para exportar */}
      <div className="absolute -top-[9999px] -left-[9999px] pointer-events-none">
        <div ref={exportRef}>
          <FacturaExport
            nro={detalle.numero}
            fecha={detalle.fecha}
            cliente={detalle.clienteNombre}
            filas={detalle.lineas.map((l: any) => ({
              id: l.id,
              nombre: l.nombre,
              qty: l.qty,
              precio: l.precio,
            }))}
            subtotal={detalle.subtotal}
            saldoAnt={detalle.saldoAnterior}
            totalGeneral={detalle.totalGeneral}
            pagos={detalle.pagos.map((p: any) => ({
              id: p.id,
              tipo: p.tipo,
              detalle: p.detalle,
              monto: p.monto,
            }))}
            totalPagado={detalle.totalPagado}
            saldoPendiente={detalle.saldoPendiente}
            cajaDatos={{
              deuda: String(detalle.cajaDeuda ?? ""),
              dejo: String(detalle.cajaDejo ?? ""),
              retiro: String(detalle.cajaRetiro ?? ""),
            }}
            cajaNuevoSaldo={detalle.cajaNuevoSaldo}
            obs={detalle.observaciones ?? ""}
            fechaDisplay={detalle.fecha}
          />
        </div>
      </div>

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
