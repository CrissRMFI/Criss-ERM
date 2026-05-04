interface Props {
  subtotal: number;
  saldoAnt: number | "";
  totalGeneral: number;
  totalPagado: number;
  saldoPendiente: number;
  onSaldoAntChange: (v: number | "") => void;
}

function fmt(n: number) {
  return "$ " + n.toFixed(2);
}

export default function TotalesBox({
  subtotal,
  saldoAnt,
  totalGeneral,
  totalPagado,
  saldoPendiente,
  onSaldoAntChange,
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
          <input
            type="number"
            className="t-inp"
            placeholder="0.00"
            step="0.01"
            value={saldoAnt}
            onChange={(e) =>
              onSaldoAntChange(
                e.target.value === "" ? "" : parseFloat(e.target.value),
              )
            }
          />
        </div>
        <div className="t-row grand">
          <span className="t-lbl">Total General</span>
          <span className="t-val">{fmt(totalGeneral)}</span>
        </div>
      </div>

      <div className="totals-box" style={{ marginTop: 12 }}>
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
