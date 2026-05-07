"use client";

import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { Compra } from "../../hooks/useCompras";
import Toast from "../../ui/Toast";

const TIPOS_PAGO = ["Efectivo", "Transferencia", "Cheque", "Otro"];

interface Props {
  compra: Compra;
  onClose: () => void;
  onGuardado: () => void;
  onPagar: (
    compraId: string,
    data: {
      monto: number;
      fecha: string;
      tipo: string;
      notas?: string;
    },
  ) => Promise<void>;
}

function today() {
  const h = new Date();
  return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, "0")}-${String(h.getDate()).padStart(2, "0")}`;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function PagarCompraModal({
  compra,
  onClose,
  onGuardado,
  onPagar,
}: Props) {
  const { toast, showToast } = useToast();
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(today());
  const [tipo, setTipo] = useState(TIPOS_PAGO[0]);
  const [notas, setNotas] = useState("");
  const [saving, setSaving] = useState(false);

  const totalCompra = compra.lineas.reduce(
    (acc, l) => acc + l.cantidadTotal * l.precioCosto,
    0,
  );
  const totalPagado = compra.pagos.reduce((acc, p) => acc + p.monto, 0);
  const restante = totalCompra - totalPagado;

  const handlePagar = async () => {
    const montoNum = parseFloat(monto);
    if (!montoNum || montoNum <= 0) {
      showToast("Ingresá un monto válido");
      return;
    }
    setSaving(true);
    try {
      await onPagar(compra.id, { monto: montoNum, fecha, tipo, notas });
      showToast("Pago registrado");
      setTimeout(() => {
        onGuardado();
        onClose();
      }, 1200);
    } catch (e: any) {
      showToast(e.message ?? "Error al registrar pago");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        className="modal-bg open"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal w-[90%] max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3>Registrar pago</h3>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>
              Cerrar
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="totals-box">
              <div className="t-row">
                <span className="t-lbl">Total compra</span>
                <span className="t-val">{fmt(totalCompra)}</span>
              </div>
              <div className="t-row">
                <span className="t-lbl">Ya pagado</span>
                <span className="t-val" style={{ color: "var(--sage)" }}>
                  {fmt(totalPagado)}
                </span>
              </div>
              <div className="t-row grand">
                <span className="t-lbl">Restante</span>
                <span className="t-val" style={{ color: "var(--rust)" }}>
                  {fmt(restante)}
                </span>
              </div>
            </div>

            {compra.pagos.length > 0 && (
              <div>
                <div className="sec-title">Pagos anteriores</div>
                {compra.pagos.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between py-1.5 border-b border-[var(--cream)] text-sm"
                  >
                    <span className="font-medium">{p.tipo}</span>
                    <span className="text-[var(--muted)]">{p.fecha}</span>
                    <span className="font-bold">{fmt(p.monto)}</span>
                  </div>
                ))}
              </div>
            )}

            <div>
              <div className="sec-title">Nuevo pago</div>
              <div className="flex flex-col gap-3">
                <div className="modal-field">
                  <label>Tipo</label>
                  <select
                    className="field-input"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  >
                    {TIPOS_PAGO.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Monto</label>
                  <input
                    type="number"
                    placeholder="0"
                    step="1"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="field-input"
                  />
                </div>
                <div className="modal-field">
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="field-input"
                  />
                </div>
                <div className="modal-field">
                  <label>Notas</label>
                  <input
                    type="text"
                    placeholder="Opcional…"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    className="field-input"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button className="btn btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePagar}
                disabled={saving}
              >
                {saving ? "Registrando…" : "Registrar pago"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toast msg={toast.msg} show={toast.show} />
    </>
  );
}
