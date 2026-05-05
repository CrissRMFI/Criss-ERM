"use client";

import { useState } from "react";
import { Cliente } from "../../types";

interface Props {
  query: string;
  results: Cliente[];
  onQueryChange: (q: string) => void;
  onFocus: () => void;
  onSelect: (c: Cliente) => void;
}

export default function SelectorCliente({
  query,
  results,
  onQueryChange,
  onFocus,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="prod-wrap">
      <input
        className="field-input"
        type="text"
        placeholder="Seleccioná o buscá un cliente…"
        value={query}
        onChange={(e) => {
          onQueryChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          onFocus();
          setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
      />
      {open && results.length > 0 && (
        <div className="dd open" style={{ zIndex: 600 }}>
          {results.map((c) => (
            <div
              key={c.id}
              className="dd-row"
              onMouseDown={() => {
                onSelect(c);
                setOpen(false);
              }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold">{c.nombre}</span>
                {c.telefono && (
                  <span className="text-xs text-[var(--muted)]">
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
