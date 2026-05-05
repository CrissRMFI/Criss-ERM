interface Props {
  nro: string;
  fecha: string;
  onNroChange: (v: string) => void;
  onFechaChange: (v: string) => void;
}

export default function FacturaHeader({
  nro,
  fecha,
  onNroChange,
  onFechaChange,
}: Props) {
  return (
    <div className="inv-header">
      <div>
        <div className="brand-name">Factura</div>
        <div className="brand-sub">Comprobante de Venta</div>
        <div className="badge-factura">Original</div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex flex-col items-end gap-1">
          <span className="meta-label">N° Factura</span>
          <input
            type="text"
            className="meta-input nro-input"
            value={nro}
            onChange={(e) => onNroChange(e.target.value)}
            readOnly
          />
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="meta-label">Fecha</span>
          <input
            type="date"
            className="meta-input"
            value={fecha}
            onChange={(e) => onFechaChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
