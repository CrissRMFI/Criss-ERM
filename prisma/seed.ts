// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const productos = [
  { nombre: 'Leche entera 1L',          precio: 1.20 },
  { nombre: 'Pan artesanal 500g',        precio: 2.50 },
  { nombre: 'Aceite de oliva 750ml',     precio: 5.80 },
  { nombre: 'Arroz largo fino 1kg',      precio: 1.60 },
  { nombre: 'Yerba mate 500g',           precio: 3.10 },
  { nombre: 'Jabón en barra x3',         precio: 1.90 },
  { nombre: 'Harina 0000 1kg',           precio: 1.40 },
  { nombre: 'Azúcar blanca 1kg',         precio: 1.10 },
  { nombre: 'Fideos spaghetti 500g',     precio: 0.95 },
  { nombre: 'Detergente líquido 500ml',  precio: 2.20 },
  { nombre: 'Tomate lata 400g',          precio: 1.30 },
  { nombre: 'Atún al natural',           precio: 2.80 },
  { nombre: 'Agua mineral 2L',           precio: 0.80 },
  { nombre: 'Galletitas dulces 200g',    precio: 1.50 },
  { nombre: 'Café molido 250g',          precio: 4.20 },
  { nombre: 'Shampoo 400ml',             precio: 3.60 },
  { nombre: 'Papel higiénico x4',        precio: 2.10 },
  { nombre: 'Queso cremoso 200g',        precio: 3.90 },
  { nombre: 'Mayonesa 250g',             precio: 1.75 },
  { nombre: 'Mermelada frutilla 454g',   precio: 2.40 },
  { nombre: 'Jugo en polvo x5 sobres',   precio: 1.15 },
  { nombre: 'Caldo de gallina x6',       precio: 1.00 },
  { nombre: 'Vinagre de manzana 500ml',  precio: 1.65 },
  { nombre: 'Manteca 200g',             precio: 2.30 },
  { nombre: 'Gelatina sabores',          precio: 0.90 },
]

async function main() {
  console.log('Seeding products...')
  await prisma.producto.deleteMany()
  await prisma.producto.createMany({ data: productos })
  console.log(`Created ${productos.length} products.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
