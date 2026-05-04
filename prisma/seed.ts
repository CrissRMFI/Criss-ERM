// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const productos = [
  { nombre: "Leche entera 1L", precio: 1.2 },
  { nombre: "Pan artesanal 500g", precio: 2.5 },
  { nombre: "Aceite de oliva 750ml", precio: 5.8 },
  { nombre: "Arroz largo fino 1kg", precio: 1.6 },
  { nombre: "Yerba mate 500g", precio: 3.1 },
  { nombre: "Jabón en barra x3", precio: 1.9 },
  { nombre: "Harina 0000 1kg", precio: 1.4 },
  { nombre: "Azúcar blanca 1kg", precio: 1.1 },
  { nombre: "Fideos spaghetti 500g", precio: 0.95 },
  { nombre: "Detergente líquido 500ml", precio: 2.2 },
  { nombre: "Tomate lata 400g", precio: 1.3 },
  { nombre: "Atún al natural", precio: 2.8 },
  { nombre: "Agua mineral 2L", precio: 0.8 },
  { nombre: "Galletitas dulces 200g", precio: 1.5 },
  { nombre: "Café molido 250g", precio: 4.2 },
  { nombre: "Shampoo 400ml", precio: 3.6 },
  { nombre: "Papel higiénico x4", precio: 2.1 },
  { nombre: "Queso cremoso 200g", precio: 3.9 },
  { nombre: "Mayonesa 250g", precio: 1.75 },
  { nombre: "Mermelada frutilla 454g", precio: 2.4 },
  { nombre: "Jugo en polvo x5 sobres", precio: 1.15 },
  { nombre: "Caldo de gallina x6", precio: 1.0 },
  { nombre: "Vinagre de manzana 500ml", precio: 1.65 },
  { nombre: "Manteca 200g", precio: 2.3 },
  { nombre: "Gelatina sabores", precio: 0.9 },
];

async function main() {
  console.log("Seeding products...");
  await prisma.producto.deleteMany();
  await prisma.producto.createMany({ data: productos });
  console.log(`Created ${productos.length} products.`);

  const numeroInicial = Math.floor(Math.random() * 900) + 100;
  await prisma.config.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", ultimoNumeroFactura: numeroInicial },
  });
  console.log(`Número inicial de factura: ${numeroInicial}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
