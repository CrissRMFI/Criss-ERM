import ClienteHistorialPage from "../../../components/clientes/ClienteHistorialPage";

export default function Page({ params }: { params: { id: string } }) {
  return <ClienteHistorialPage clienteId={params.id} />;
}
