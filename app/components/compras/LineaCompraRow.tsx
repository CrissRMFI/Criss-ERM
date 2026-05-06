"use client";

import { useRef, useState } from "react";
import { Producto } from "../../types";

interface LineaCompra {
  id: string;
  productoId: string;
  nombre: string;
  cantidadTotal: number;
  precioCosto: number;
}

interface Props {
  linea: LineaCompra;
  query: string;
  results: Producto[];
  onQueryChange: (id: string, q: string) => void;
  onSelect: (id: string, p: Producto) => void;
  onChange: (l: LineaCompra) => void;
  onDelete: () => void;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function LineaCompraRow({
  linea,
  query,
  results,
  onQueryChange,
  onSelect,
  onChange,
  onDelete,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ddPos, setDdPos] = useState({ top: 0, left: 0, width: 0 });
  const [open, setOpen] = useState(false);

  const handleFocus = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDdPos({
        top: rect.bottom + window.scrollY + 2,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    onQueryChange(linea.id, "");
    setOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 160);
  };

  return (
    <tr>
      <td>
        <div className="prod-wrap">
          <input
            ref={inputRef}
            className="td-in pname"
            type="text"
            placeholder="Buscar producto…"
            value={query}
            onChange={(e) => {
              onQueryChange(linea.id, e.target.value);
              setOpen(true);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {open && results.length > 0 && (
            <div
              className="dd-fixed"
              style={{
                top: ddPos.top,
                left: ddPos.left,
                width: ddPos.width,
              }}
            >
              {results.map((p) => (
                <div
                  key={p.id}
                  className="dd-row"
                  onMouseDown={() => {
                    onSelect(linea.id, p);
                    setOpen(false);
                  }}
                >
                  <span>{p.nombre}</span>
                  <span className="dd-price">{fmt(p.precio)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </td>
      <td className="c">
        <input
          className="td-in qty"
          type="number"
          min={1}
          value={linea.cantidadTotal}
          onChange={(e) =>
            onChange({
              ...linea,
              cantidadTotal: Math.max(1, parseInt(e.target.value) || 1),
            })
          }
        />
      </td>
      <td className="r">
        <input
          className="td-in price"
          type="number"
          placeholder="0"
          step="1"
          value={linea.precioCosto || ""}
          onChange={(e) =>
            onChange({ ...linea, precioCosto: parseFloat(e.target.value) || 0 })
          }
        />
      </td>
      <td>
        <span className="row-sub">
          {fmt(linea.cantidadTotal * linea.precioCosto)}
        </span>
      </td>
      <td>
        <button className="del-row" onClick={onDelete}>
          ✕
        </button>
      </td>
    </tr>
  );
}
