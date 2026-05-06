import { Suspense } from "react";
import NuevoTrasladoPage from "../../../components/traslados/NuevoTrasladoPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="empty-state">Cargando…</div>}>
      <NuevoTrasladoPage />
    </Suspense>
  );
}
