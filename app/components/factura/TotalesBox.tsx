interface Props {
  subtotal: number;
  saldoAnt: number | "";
  totalGeneral: number;
  totalPagado: number;
  saldoPendiente: number;
}

function fmt(n: number) {
  return "$ " + Math.round(n).toLocaleString("es-AR");
}

export default function TotalesBox({
  subtotal,
  saldoAnt,
  totalGeneral,
  totalPagado,
  saldoPendiente,
}: Props) {
  return (
    <>
      <div className="totals-box">
        <div className="t-row">
          <span className="t-lbl">Subtotal productos</span>
          <span className="t-val">{fmt(subtotal)}</span>
        </div>
        <div className="t-row">
          <span className="t-lbl">Saldo Anterior</span>
          <span className="t-val" style={{ color: "var(--muted)" }}>
            {saldoAnt === "" || saldoAnt === 0
              ? "$ 0"
              : fmt(saldoAnt as number)}
          </span>
        </div>
        <div className="t-row grand">
          <span className="t-lbl">Total General</span>
          <span className="t-val">{fmt(totalGeneral)}</span>
        </div>
      </div>

      <div className="totals-box mt-3">
        <div className="t-row">
          <span className="t-lbl">Total Pagado</span>
          <span className="t-val" style={{ color: "var(--sage)" }}>
            {fmt(totalPagado)}
          </span>
        </div>
        <div className="t-row grand">
          <span className="t-lbl">Saldo Pendiente</span>
          <span
            className="t-val"
            style={{
              color: saldoPendiente > 0.005 ? "var(--rust)" : "var(--sage)",
            }}
          >
            {fmt(saldoPendiente)}
          </span>
        </div>
      </div>
    </>
  );
}
