import DetalleTrasladoPage from "../../../components/traslados/DetalleTrasladoPage";

export default function Page({ params }: { params: { id: string } }) {
  return <DetalleTrasladoPage trasladoId={params.id} />;
}
