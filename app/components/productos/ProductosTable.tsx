import { Producto } from "../../types";

interface Props {
  productos: Producto[];
  loading: boolean;
  search: string;
  onEdit: (p: Producto) => void;
  onDelete: (id: string) => void;
}

export default function ProductosTable({
  productos,
  loading,
  search,
  onEdit,
  onDelete,
}: Props) {
  if (loading) return <div className="empty-state">Cargando…</div>;

  if (!productos.length) {
    return (
      <div className="empty-state">
        {search
          ? `Sin resultados para "${search}"`
          : 'No hay productos aún. Usá "+ Nuevo producto" para agregar.'}
      </div>
    );
  }

  return (
    <table className="prod-table">
      <thead>
        <tr>
          <th>Nombre del producto</th>
          <th className="r">Precio venta</th>
          <th className="r">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((p) => (
          <tr key={p.id}>
            <td className="font-medium">{p.nombre}</td>
            <td className="r font-semibold">
              $ {Math.round(p.precio).toLocaleString("es-AR")}
            </td>
            <td className="r">
              <div className="row-actions">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onEdit(p)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(p.id)}
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
