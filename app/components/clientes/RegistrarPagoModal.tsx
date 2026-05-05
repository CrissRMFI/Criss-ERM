"use client";

import { useRegistrarPago } from "../../hooks/useRegistrarPago";
import { useToast } from "../../hooks/useToast";
import FacturaExport from "../factura/FacturaExport";
import Toast from "../../ui/Toast";
import { Cliente } from "../../types";
import FilaPago from "../factura/FilaPago";

interface Props {
  cliente: Cliente;
  deudaMonetaria: number;
  deudaCajas: number;
  nroFactura: number | null;
  onClose: () => void;
  onGuardado: () => void;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function RegistrarPagoModal({
  cliente,
  deudaMonetaria,
  deudaCajas,
  nroFactura,
  onClose,
  onGuardado,
}: Props) {
  const r = useRegistrarPago(cliente, deudaMonetaria, deudaCajas, nroFactura);
  const { toast, showToast } = useToast();

  const handleGuardar = async () => {
    try {
      await r.guardar();
      showToast("Pago registrado");
      setTimeout(() => {
        onGuardado();
        onClose();
      }, 1200);
    } catch (e: any) {
      showToast(e.message ?? "Error al guardar");
    }
  };

  const handleWA = async () => {
    try {
      await r.guardarYEnviar();
      showToast("Enviado");
      setTimeout(() => {
        onGuardado();
        onClose();
      }, 1200);
    } catch (e: any) {
      showToast(e.message ?? "Error al procesar");
    }
  };

  return (
    <>
      <div
        className="modal-bg open"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal w-[90%] max-w-lg max-h-[85vh] overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3>Registrar pago</h3>
              <p className="text-sm text-[var(--muted)] mt-0.5">
                {cliente.nombre}
              </p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              Cerrar
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* DEUDA ACTUAL */}
            <div className="totals-box">
              <div className="t-row">
                <span className="t-lbl">Deuda monetaria actual</span>
                <span
                  className="t-val"
                  style={{
                    color: deudaMonetaria > 0 ? "var(--rust)" : "var(--sage)",
                  }}
                >
                  {fmt(deudaMonetaria)}
                </span>
              </div>
              <div className="t-row">
                <span className="t-lbl">Deuda en cajas actual</span>
                <span
                  className="t-val"
                  style={{
                    color: deudaCajas > 0 ? "var(--rust)" : "var(--sage)",
                  }}
                >
                  {deudaCajas} cajas
                </span>
              </div>
            </div>

            {/* PAGOS */}
            <div>
              <div className="sec-title">Pagos</div>
              <div className="pay-list">
                {r.pagos.map((p) => (
                  <FilaPago
                    key={p.id}
                    pago={p}
                    tipos={r.TIPOS_PAGO}
                    onChange={r.actualizarPago}
                    onDelete={() => r.eliminarPago(p.id)}
                  />
                ))}
              </div>
              <button className="add-pay-btn mt-2" onClick={r.agregarPago}>
                + Agregar pago
              </button>
            </div>

            {/* CAJAS */}
            <div>
              <div className="sec-title">Movimiento de cajas</div>
              <div className="cajas-grid">
                <div className="caja">
                  <label className="caja-lbl">Deuda</label>
                  <div
                    className="font-bold text-base"
                    style={{ color: "var(--muted)" }}
                  >
                    {deudaCajas || "0"}
                  </div>
                </div>
                <div className="caja">
                  <label className="caja-lbl">Dejo</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    value={r.dejo}
                    onChange={(e) => {
                      const val = Math.floor(parseFloat(e.target.value)) || 0;
                      r.setDejo(val === 0 ? "" : String(val));
                    }}
                  />
                </div>
                <div className="caja">
                  <label className="caja-lbl">Retiro</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    value={r.retiro}
                    onChange={(e) => {
                      const val = Math.floor(parseFloat(e.target.value)) || 0;
                      r.setRetiro(val === 0 ? "" : String(val));
                    }}
                  />
                </div>
              </div>
              <div className="totals-box mt-3">
                <div className="t-row grand">
                  <span className="t-lbl">Nuevo saldo en cajas</span>
                  <span
                    className="t-val"
                    style={{
                      color:
                        r.cajaNuevoSaldo > 0 ? "var(--rust)" : "var(--sage)",
                    }}
                  >
                    {r.cajaNuevoSaldo} cajas
                  </span>
                </div>
              </div>
            </div>

            {/* RESUMEN */}
            <div className="totals-box">
              <div className="t-row">
                <span className="t-lbl">Total pagado</span>
                <span className="t-val" style={{ color: "var(--sage)" }}>
                  {fmt(r.totalPagado)}
                </span>
              </div>
              <div className="t-row grand">
                <span className="t-lbl">Nuevo saldo monetario</span>
                <span
                  className="t-val"
                  style={{
                    color: r.saldoPendiente > 0 ? "var(--rust)" : "var(--sage)",
                  }}
                >
                  {fmt(r.saldoPendiente)}
                </span>
              </div>
            </div>

            {/* OBSERVACIONES */}
            <div>
              <div className="sec-title">Observaciones</div>
              <textarea
                className="field-input"
                placeholder="Notas, aclaraciones…"
                value={r.obs}
                onChange={(e) => r.setObs(e.target.value)}
              />
            </div>

            {/* BOTONES */}
            <div className="flex gap-2 justify-end flex-wrap">
              <button className="btn btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="btn btn-wa"
                onClick={handleWA}
                disabled={r.saving}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {r.saving ? "Procesando…" : "Guardar y enviar"}
              </button>
              <button
                className="btn btn-primary"
                onClick={handleGuardar}
                disabled={r.saving}
              >
                {r.saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export invisible */}
      <div className="absolute -top-[9999px] -left-[9999px] pointer-events-none">
        <div ref={r.exportRef}>
          <FacturaExport
            nro={nroFactura}
            fecha={r.iso}
            cliente={cliente.nombre}
            filas={[]}
            subtotal={0}
            saldoAnt={deudaMonetaria}
            totalGeneral={deudaMonetaria}
            pagos={r.pagos}
            totalPagado={r.totalPagado}
            saldoPendiente={r.saldoPendiente}
            cajaDatos={{
              deuda: String(deudaCajas),
              dejo: r.dejo,
              retiro: r.retiro,
            }}
            cajaNuevoSaldo={r.cajaNuevoSaldo}
            obs={r.obs}
            fechaDisplay={r.display}
          />
        </div>
      </div>

      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
