import { Pago } from "../../types";

interface Props {
  pago: Pago;
  tipos: string[];
  onChange: (p: Pago) => void;
  onDelete: () => void;
}

export default function FilaPago({ pago, tipos, onChange, onDelete }: Props) {
  return (
    <div className="pay-item">
      <select
        value={pago.tipo}
        onChange={(e) => onChange({ ...pago, tipo: e.target.value })}
        className="flex-shrink-0"
      >
        {tipos.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <input
        type="text"
        className="pay-detail min-w-0 flex-1"
        placeholder="Detalle…"
        value={pago.detalle}
        onChange={(e) => onChange({ ...pago, detalle: e.target.value })}
      />
      <input
        type="number"
        className="pay-amount w-24 flex-shrink-0"
        placeholder="0"
        step="1"
        value={pago.monto || ""}
        onChange={(e) =>
          onChange({ ...pago, monto: parseFloat(e.target.value) || 0 })
        }
      />
      <button className="del-btn flex-shrink-0" onClick={onDelete}>
        ✕
      </button>
    </div>
  );
}
