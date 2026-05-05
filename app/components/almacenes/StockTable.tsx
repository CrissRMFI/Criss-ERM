import { StockProducto } from "../../hooks/useStock";

interface Props {
  stock: StockProducto[];
  loading: boolean;
  search: string;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function StockTable({ stock, loading, search }: Props) {
  if (loading) return <div className="empty-state">Cargando…</div>;

  if (!stock.length) {
    return (
      <div className="empty-state">
        {search
          ? `Sin resultados para "${search}"`
          : "Sin stock en este almacén."}
      </div>
    );
  }

  return (
    <table className="prod-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th className="r">Cantidad</th>
          <th className="r hidden sm:table-cell">Precio venta</th>
          <th className="r hidden md:table-cell">Lotes</th>
        </tr>
      </thead>
      <tbody>
        {stock.map((p) => (
          <tr key={p.productoId}>
            <td className="font-medium">{p.nombre}</td>
            <td className="r">
              <span
                className={`font-bold ${p.cantidadTotal <= 5 ? "text-[var(--rust)]" : "text-[var(--ink)]"}`}
              >
                {p.cantidadTotal}
              </span>
            </td>
            <td className="r hidden sm:table-cell">{fmt(p.precioVenta)}</td>
            <td className="r hidden md:table-cell">
              <div className="flex flex-col items-end gap-0.5">
                {p.lotes.map((l) => (
                  <span key={l.id} className="text-xs text-[var(--muted)]">
                    {l.cantidad} u. @ {fmt(l.precioCosto)} costo
                  </span>
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
