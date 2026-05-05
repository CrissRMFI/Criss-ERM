import { ClienteConDeuda } from "../../hooks/useClientes";

interface Props {
  cliente: ClienteConDeuda;
  onHistorial: (c: ClienteConDeuda) => void;
  onEditar: (c: ClienteConDeuda) => void;
  onToggle: (c: ClienteConDeuda) => void;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function ClienteRow({
  cliente: c,
  onHistorial,
  onEditar,
  onToggle,
}: Props) {
  return (
    <tr className={c.activo ? "" : "opacity-50"}>
      <td>
        <div className="font-semibold">{c.nombre}</div>
        {c.telefono && (
          <div className="text-xs text-[var(--muted)] mt-0.5">{c.telefono}</div>
        )}
      </td>

      <td className="hidden md:table-cell text-sm text-[var(--muted)]">
        {c.direccion || "—"}
      </td>

      <td className="r">
        <div className="flex flex-col items-end gap-0.5">
          <span
            className={`font-bold text-sm ${c.deudaMonetaria > 0 ? "text-[var(--rust)]" : "text-[var(--sage)]"}`}
          >
            {fmt(c.deudaMonetaria)}
          </span>
          {c.deudaCajas > 0 && (
            <span className="text-xs text-[var(--muted)]">
              {c.deudaCajas} cajas
            </span>
          )}
        </div>
      </td>

      <td className="hidden sm:table-cell">
        <span
          className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full
          ${
            c.activo
              ? "bg-green-100 text-[var(--sage)]"
              : "bg-gray-100 text-[var(--muted)]"
          }`}
        >
          {c.activo ? "Activo" : "Inactivo"}
        </span>
      </td>

      <td className="r">
        <div className="row-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onHistorial(c)}
          >
            Historial
          </button>
          <button
            className="btn btn-ghost btn-sm hidden sm:inline-flex"
            onClick={() => onEditar(c)}
          >
            Editar
          </button>
          <button
            className={`btn btn-sm hidden sm:inline-flex ${c.activo ? "btn-danger" : "btn-ghost"}`}
            onClick={() => onToggle(c)}
          >
            {c.activo ? "Desactivar" : "Activar"}
          </button>
          <button
            className="btn btn-ghost btn-sm sm:hidden"
            onClick={() => onEditar(c)}
          >
            ✎
          </button>
        </div>
      </td>
    </tr>
  );
}
