import AlmacenPage from "../../../components/almacenes/AlmacenPage";

export default function Page({ params }: { params: { id: string } }) {
  return <AlmacenPage almacenId={params.id} />;
}
