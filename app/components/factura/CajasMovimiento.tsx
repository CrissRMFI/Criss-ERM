interface Props {
  datos: { deuda: string; dejo: string; retiro: string };
  nuevoSaldo: number;
  onChange: (datos: { deuda: string; dejo: string; retiro: string }) => void;
}

const CAJAS = [
  { key: "deuda", label: "Deuda", readonly: true },
  { key: "dejo", label: "Dejo", readonly: false },
  { key: "retiro", label: "Retiro", readonly: false },
] as const;

export default function CajasMovimiento({
  datos,
  nuevoSaldo,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="cajas-grid">
        {CAJAS.map(({ key, label, readonly }) => (
          <div className="caja" key={key}>
            <label className="caja-lbl">{label}</label>
            {readonly ? (
              <div
                className="font-bold text-base"
                style={{ color: "var(--muted)" }}
              >
                {datos[key] || "0"}
              </div>
            ) : (
              <input
                type="number"
                step="1"
                min="0"
                placeholder="0"
                value={datos[key]}
                onChange={(e) => {
                  const val = Math.floor(parseFloat(e.target.value)) || 0;
                  onChange({ ...datos, [key]: val === 0 ? "" : String(val) });
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="totals-box">
        <div className="t-row grand">
          <span className="t-lbl">Nuevo saldo en cajas</span>
          <span
            className="t-val"
            style={{ color: nuevoSaldo > 0 ? "var(--rust)" : "var(--sage)" }}
          >
            {nuevoSaldo} cajas
          </span>
        </div>
      </div>
    </div>
  );
}
