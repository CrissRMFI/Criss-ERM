"use client";

import { Cliente } from "../../types";

interface Props {
  query: string;
  results: Cliente[];
  onQueryChange: (q: string) => void;
  onSelect: (c: Cliente) => void;
}

export default function SelectorCliente({
  query,
  results,
  onQueryChange,
  onSelect,
}: Props) {
  const ddOpen = query.length > 0 && results.length > 0;

  return (
    <div className="prod-wrap">
      <input
        className="field-input"
        type="text"
        placeholder="Buscar cliente…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
      {ddOpen && (
        <div className="dd open" style={{ zIndex: 600 }}>
          {results.map((c) => (
            <div key={c.id} className="dd-row" onMouseDown={() => onSelect(c)}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 600 }}>{c.nombre}</span>
                {c.telefono && (
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                    {c.telefono}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
