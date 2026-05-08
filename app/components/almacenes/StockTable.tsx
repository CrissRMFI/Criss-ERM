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
          <th className="r w-10 sm:w-20">Cantidad</th>
          <th className="r w-24 sm:w-32">Costo</th>
        </tr>
      </thead>
      <tbody>
        {stock.map((p) => {
          const tieneVariosLotes = p.lotes.length > 1;

          return (
            <>
              <tr
                key={p.productoId}
                className={tieneVariosLotes ? "border-b-0" : ""}
              >
                <td className={`font-medium ${tieneVariosLotes ? "pb-0" : ""}`}>
                  {p.nombre}
                </td>
                <td className={`r ${tieneVariosLotes ? "pb-0" : ""} `}>
                  <span
                    className={`font-bold ${p.cantidadTotal <= 5 ? "text-[var(--rust)]" : "text-[var(--ink)]"} `}
                  >
                    {p.cantidadTotal}
                  </span>
                </td>
                <td className={`r ${tieneVariosLotes ? "pb-0" : ""}`}>
                  {!tieneVariosLotes && (
                    <span className="font-semibold whitespace-nowrap text-sm">
                      {fmt(p.lotes[0]?.precioCosto ?? 0)}
                    </span>
                  )}
                </td>
              </tr>

              {tieneVariosLotes &&
                p.lotes.map((l, i) => (
                  <tr
                    key={l.id}
                    className={i === p.lotes.length - 1 ? "" : "border-b-0"}
                  >
                    <td className="pt-0 pl-6 text-xs text-[var(--muted)]">
                      Lote {i + 1}
                    </td>
                    <td className="r pt-0 text-sm text-[var(--muted)]">
                      {l.cantidad}
                    </td>
                    <td className="r pt-0 text-sm font-semibold whitespace-nowrap">
                      {fmt(l.precioCosto)}
                    </td>
                  </tr>
                ))}
            </>
          );
        })}
      </tbody>
    </table>
  );
}
