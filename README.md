# Factura App

Stack: **Next.js 14** · **Prisma** · **PostgreSQL (Neon)** · **Vercel**

---

## Instalación local

```bash
# 1. Clonar / descomprimir el proyecto
cd factura-app

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editá .env.local con tus credenciales de Neon (ver paso siguiente)
```

---

## Base de datos — Neon (gratis)

1. Entrá a **https://neon.tech** y creá una cuenta gratuita
2. Creá un nuevo proyecto (ej. `factura-app`)
3. En el dashboard de tu proyecto, andá a **"Connection Details"**
4. Copiá la **Connection string** que dice *"Pooled connection"* → pegala en `DATABASE_URL`
5. Copiá la **Connection string** que dice *"Direct connection"* → pegala en `DIRECT_URL`

Tu `.env.local` tiene que quedar así:
```
DATABASE_URL="postgresql://...@...-pooler.aws.neon.tech/neondb?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://...@...aws.neon.tech/neondb?sslmode=require"
```

---

## Correr migraciones y seed

```bash
# Crear las tablas en la base de datos
npx prisma migrate dev --name init

# Cargar los 25 productos de ejemplo (opcional)
npx prisma db seed
```

Para ver los datos en una interfaz visual:
```bash
npx prisma studio
```

---

## Correr en desarrollo

```bash
npm run dev
# → http://localhost:3000
```

---

## Deploy en Vercel

1. Subí el proyecto a un repositorio de GitHub
2. Entrá a **https://vercel.com** → "Add New Project" → conectá el repo
3. En **Environment Variables** del proyecto en Vercel, agregá:
   - `DATABASE_URL` → la URL pooled de Neon
   - `DIRECT_URL` → la URL directa de Neon
4. Hacé click en **Deploy**

Vercel corre `prisma generate` automáticamente (está en el script `build` y `postinstall`).

> ⚠️ **Importante**: Antes del primer deploy, asegurate de haber corrido `npx prisma migrate dev` localmente para que las tablas existan en Neon.

---

## Estructura del proyecto

```
factura-app/
├── app/
│   ├── api/
│   │   └── productos/
│   │       ├── route.ts          # GET (listar/buscar) + POST (crear)
│   │       └── [id]/
│   │           └── route.ts      # PUT (editar) + DELETE (eliminar)
│   ├── components/
│   │   ├── FacturaPage.tsx       # Página de factura
│   │   └── ProductosPage.tsx     # ABM de productos
│   ├── App.tsx                   # Navegación / tabs
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx
│   ├── page.tsx
│   └── types.ts
├── lib/
│   └── prisma.ts                 # Singleton Prisma client
├── prisma/
│   ├── schema.prisma             # Modelo de datos
│   └── seed.ts                   # Datos iniciales
├── .env.example
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## Agregar productos a la base de datos

Hay dos formas:
1. **Desde la app** → pestaña "Productos" → "+ Nuevo producto"
2. **Desde Prisma Studio** → `npx prisma studio` → tabla `Producto`
