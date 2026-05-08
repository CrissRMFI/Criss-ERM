import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Rutas que solo puede ver ADMIN
const SOLO_ADMIN = [
  "/factura",
  "/clientes",
  "/historial",
  "/proveedores",
  "/productos",
];

export default withAuth(
  function middleware(req) {
    const rol = req.nextauth.token?.rol;
    const path = req.nextUrl.pathname;

    // Si es OPERADOR intentando acceder a ruta de ADMIN
    if (rol === "OPERADOR") {
      const bloqueada = SOLO_ADMIN.some((r) => path.startsWith(r));
      if (bloqueada) {
        return NextResponse.redirect(new URL("/almacenes", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
);

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
};
