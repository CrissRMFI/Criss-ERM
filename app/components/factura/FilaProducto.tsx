"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { FilaProducto, Producto } from "../../types";
import { productosService } from "../../services/productos.service";

interface Props {
  fila: FilaProducto;
  onChange: (f: FilaProducto) => void;
  onDelete: () => void;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function FilaProductoRow({ fila, onChange, onDelete }: Props) {
  const [query, setQuery] = useState(fila.nombre);
  const [results, setResults] = useState<Producto[]>([]);
  const [ddOpen, setDdOpen] = useState(false);
  const ddRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    try {
      setResults(await productosService.getAll(q));
    } catch {
      setResults([]);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 200);
    return () => clearTimeout(t);
  }, [query, search]);

  const pick = (p: Producto) => {
    setQuery(p.nombre);
    setDdOpen(false);
    onChange({ ...fila, nombre: p.nombre, precio: p.precio });
  };

  return (
    <tr>
      <td>
        <div className="prod-wrap" ref={ddRef}>
          <input
            className="td-in pname"
            type="text"
            placeholder="Buscar producto…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDdOpen(true);
            }}
            onFocus={() => {
              search(query);
              setDdOpen(true);
            }}
            onBlur={() => setTimeout(() => setDdOpen(false), 160)}
          />
          {ddOpen && (
            <div className="dd open">
              {results.length === 0 ? (
                <div className="dd-empty">Sin resultados</div>
              ) : (
                results.map((p) => (
                  <div
                    key={p.id}
                    className="dd-row"
                    onMouseDown={() => pick(p)}
                  >
                    <span>{p.nombre}</span>
                    <span className="dd-price">$ {p.precio.toFixed(2)}</span>
                  </div>
                ))
              )}
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
          placeholder="0.00"
          step="0.01"
          value={fila.precio || ""}
          onChange={(e) =>
            onChange({ ...fila, precio: parseFloat(e.target.value) || 0 })
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
