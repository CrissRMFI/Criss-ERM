interface Props {
  datos: { deuda: string; dejo: string; retiro: string };
  nuevoSaldo: number;
  onChange: (datos: { deuda: string; dejo: string; retiro: string }) => void;
}

export default function CajasMovimiento({
  datos,
  nuevoSaldo,
  onChange,
}: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="cajas-grid">
        {(
          [
            { key: "deuda", label: "Deuda" },
            { key: "dejo", label: "Dejo" },
            { key: "retiro", label: "Retiro" },
          ] as const
        ).map(({ key, label }) => (
          <div className="caja" key={key}>
            <label className="caja-lbl">{label}</label>
            <input
              type={key === "deuda" ? "text" : "number"}
              placeholder="—"
              value={datos[key]}
              onChange={(e) => onChange({ ...datos, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>

      {/* Nuevo saldo calculado */}
      <div className="totals-box">
        <div className="t-row grand">
          <span
            className="t-lbl"
            style={{ fontFamily: "inherit", fontSize: "0.88rem" }}
          >
            Nuevo saldo en cajas
          </span>
          <span
            className="t-val"
            style={{ color: nuevoSaldo > 0 ? "var(--rust)" : "var(--sage)" }}
          >
            $ {nuevoSaldo.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
