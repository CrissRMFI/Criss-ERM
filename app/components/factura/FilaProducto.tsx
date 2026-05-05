"use client";

import { FilaProducto, Producto } from "../../types";

interface Props {
  fila: FilaProducto;
  query: string;
  results: Producto[];
  onQueryChange: (filaId: string, query: string) => void;
  onSelect: (filaId: string, p: Producto) => void;
  onChange: (f: FilaProducto) => void;
  onDelete: () => void;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function FilaProductoRow({
  fila,
  query,
  results,
  onQueryChange,
  onSelect,
  onChange,
  onDelete,
}: Props) {
  const ddOpen = results.length > 0;

  return (
    <tr>
      <td className="relative">
        <div className="prod-wrap">
          <input
            className="td-in pname"
            type="text"
            placeholder="Buscar producto…"
            value={query}
            onChange={(e) => onQueryChange(fila.id, e.target.value)}
            onFocus={() => onQueryChange(fila.id, query)}
          />
          {ddOpen && (
            <div className="dd open">
              {results.map((p) => (
                <div
                  key={p.id}
                  className="dd-row"
                  onMouseDown={() => onSelect(fila.id, p)}
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
          value={fila.qty}
          onChange={(e) =>
            onChange({
              ...fila,
              qty: Math.max(1, parseInt(e.target.value) || 1),
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
          value={fila.precio || ""}
          onChange={(e) =>
            onChange({
              ...fila,
              precio: parseFloat(e.target.value) || 0,
            })
          }
        />
      </td>
      <td>
        <span className="row-sub">{fmt(fila.qty * fila.precio)}</span>
      </td>
      <td>
        <button className="del-row" onClick={onDelete}>
          ✕
        </button>
      </td>
    </tr>
  );
}
