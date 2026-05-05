"use client";

import { useState } from "react";
import { Pago } from "../../types";

interface Props {
  pago: Pago;
  tipos: string[];
  onChange: (p: Pago) => void;
  onDelete: () => void;
}

export default function FilaPago({ pago, tipos, onChange, onDelete }: Props) {
  const [showDetalle, setShowDetalle] = useState(false);

  return (
    <div className="pay-item">
      {/* Fila principal */}
      <div className="flex items-center gap-2 w-full">
        <select
          value={pago.tipo}
          onChange={(e) => onChange({ ...pago, tipo: e.target.value })}
          className="flex-1 min-w-0 font-semibold cursor-pointer bg-transparent border-none outline-none text-[var(--ink)] text-sm"
        >
          {tipos.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <input
          type="number"
          className="pay-amount w-24 shrink-0"
          placeholder="0"
          step="1"
          value={pago.monto || ""}
          onChange={(e) =>
            onChange({ ...pago, monto: parseFloat(e.target.value) || 0 })
          }
        />
        <button
          className="text-xs text-[var(--muted)] hover:text-[var(--ink)] transition-colors whitespace-nowrap shrink-0"
          onClick={() => setShowDetalle((s) => !s)}
          type="button"
        >
          {showDetalle ? "Sin detalle" : "+ Detalle"}
        </button>
        <button className="del-btn shrink-0" onClick={onDelete}>
          ✕
        </button>
      </div>

      {/* Detalle opcional */}
      {showDetalle && (
        <input
          type="text"
          className="pay-detail w-full mt-1 border-t border-[var(--border)] pt-2"
          placeholder="Detalle del pago…"
          value={pago.detalle}
          onChange={(e) => onChange({ ...pago, detalle: e.target.value })}
          autoFocus
        />
      )}
    </div>
  );
}
