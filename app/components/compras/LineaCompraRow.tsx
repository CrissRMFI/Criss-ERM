"use client";

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
  const ddOpen = results.length > 0;

  return (
    <tr>
      <td>
        <div className="prod-wrap">
          <input
            className="td-in pname"
            type="text"
            placeholder="Buscar producto…"
            value={query}
            onChange={(e) => onQueryChange(linea.id, e.target.value)}
            onFocus={() => onQueryChange(linea.id, query)}
            onBlur={() => setTimeout(() => onQueryChange(linea.id, query), 160)}
          />
          {ddOpen && (
            <div className="dd open">
              {results.map((p) => (
                <div
                  key={p.id}
                  className="dd-row"
                  onMouseDown={() => onSelect(linea.id, p)}
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
