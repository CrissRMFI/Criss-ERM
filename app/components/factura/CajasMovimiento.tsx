interface Props {
  datos: { deuda: string; dejo: string; retiro: string };
  onChange: (datos: { deuda: string; dejo: string; retiro: string }) => void;
}

const CAJAS = [
  { key: "deuda", label: "Deuda" },
  { key: "dejo", label: "Dejó" },
  { key: "retiro", label: "Retiró" },
] as const;

export default function CajasMovimiento({ datos, onChange }: Props) {
  return (
    <div className="cajas-grid">
      {CAJAS.map(({ key, label }) => (
        <div className="caja" key={key}>
          <label className="caja-lbl">{label}</label>
          <input
            type="text"
            placeholder="—"
            value={datos[key]}
            onChange={(e) => onChange({ ...datos, [key]: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}
