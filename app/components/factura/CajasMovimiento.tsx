interface Props {
  datos: { deuda: string; dejo: string; retiro: string };
  nuevoSaldo: number;
  onChange: (datos: { deuda: string; dejo: string; retiro: string }) => void;
}

const CAJAS = [
  { key: "deuda", label: "Deuda" },
  { key: "dejo", label: "Dejo" },
  { key: "retiro", label: "Retiro" },
] as const;

export default function CajasMovimiento({
  datos,
  nuevoSaldo,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="cajas-grid">
        {CAJAS.map(({ key, label }) => (
          <div className="caja" key={key}>
            <label className="caja-lbl">{label}</label>
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
