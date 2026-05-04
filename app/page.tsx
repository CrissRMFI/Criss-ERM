import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-4xl font-serif">Bienvenido</h1>
      <p className="text-gray-500 text-sm">Sistema de facturación</p>
      <Link
        href="/factura"
        className="bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-700 transition"
      >
        Ingresar
      </Link>
    </div>
  );
}
