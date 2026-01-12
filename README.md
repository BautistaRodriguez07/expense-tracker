# Expense Tracker (Expenso)

Aplicación web moderna para el seguimiento y gestión de gastos personales y grupales, construida con Next.js, TypeScript, Prisma y Clerk.

## 🚀 Características

- ✅ Autenticación con Clerk
- ✅ Gestión de gastos con múltiples monedas
- ✅ Categorización de gastos
- ✅ División de gastos entre usuarios
- ✅ Subida de recibos (múltiples imágenes)
- ✅ Espacios de trabajo compartidos
- ✅ Internacionalización (i18n) - Español, Inglés, Francés
- ✅ Tema claro/oscuro
- ✅ Diseño responsive

## 📋 Requisitos Previos

- **Bun** >= 1.3.0 ([Instalación](https://bun.sh/docs/installation))
- **Node.js** >= 20.x (si no usas Bun)
- **PostgreSQL** (recomendado: [Neon](https://neon.tech) para desarrollo)
- **Cuenta de Clerk** ([Registro](https://clerk.com))

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd expense-tracker
```

### 2. Instalar dependencias

```bash
bun install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Clerk Webhook (para desarrollo local)
CLERK_WEBHOOK_SECRET="whsec_..."

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Configurar Clerk

1. Crea una cuenta en [Clerk](https://clerk.com)
2. Crea una nueva aplicación
3. Copia las claves de API:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (Dashboard → API Keys)
   - `CLERK_SECRET_KEY` (Dashboard → API Keys)
4. Configura el webhook:
   - URL: `https://tu-dominio.com/api/webhooks/clerk`
   - Eventos: `user.created`, `user.updated`, `user.deleted`
   - Copia el `CLERK_WEBHOOK_SECRET`

### 5. Configurar Base de Datos

#### Opción A: Neon (Recomendado para desarrollo)

1. Crea una cuenta en [Neon](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia la connection string y úsala como `DATABASE_URL`

#### Opción B: PostgreSQL Local

```bash
# Instalar PostgreSQL
brew install postgresql@15  # macOS
# o
sudo apt-get install postgresql  # Linux

# Crear base de datos
createdb expense_tracker

# Actualizar DATABASE_URL en .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/expense_tracker"
```

### 6. Ejecutar migraciones y seed

```bash
# Generar cliente de Prisma
bunx prisma generate

# Ejecutar migraciones
bunx prisma migrate dev

# Poblar base de datos con categorías iniciales
bun prisma/seed.ts
```

## 🏃 Ejecutar el proyecto

### Modo desarrollo

```bash
bun dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Modo producción

```bash
# Construir
bun run build

# Iniciar servidor
bun start
```

## 📁 Estructura del Proyecto

```
expense-tracker/
├── prisma/
│   ├── schema.prisma          # Schema de base de datos
│   ├── seed.ts                # Script de seed
│   └── migrations/            # Migraciones de Prisma
├── src/
│   ├── app/                   # App Router de Next.js
│   │   ├── [locale]/         # Rutas internacionalizadas
│   │   ├── api/               # API routes
│   │   └── sign-in/          # Páginas de autenticación
│   ├── components/            # Componentes reutilizables
│   │   ├── auth/             # Componentes de autenticación
│   │   ├── custom/           # Componentes personalizados
│   │   └── ui/               # Componentes UI (ShadCN)
│   ├── features/             # Features organizados por dominio
│   │   ├── auth/             # Autenticación
│   │   ├── expense/          # Gestión de gastos
│   │   ├── space/            # Espacios de trabajo
│   │   └── user/             # Usuarios
│   ├── lib/                  # Utilidades y configuraciones
│   ├── i18n/                 # Configuración de internacionalización
│   └── middleware.ts         # Middleware de Next.js
├── messages/                  # Archivos de traducción
│   ├── en.json
│   ├── es.json
│   └── fr.json
└── public/                    # Archivos estáticos
```

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
bun dev                    # Iniciar servidor de desarrollo

# Base de datos
bunx prisma generate       # Generar cliente de Prisma
bunx prisma migrate dev    # Crear y aplicar migraciones
bunx prisma migrate reset  # Resetear base de datos (⚠️ borra datos)
bun prisma/seed.ts         # Ejecutar seed

# Producción
bun run build             # Construir para producción
bun start                  # Iniciar servidor de producción

# Linting
bun run lint              # Ejecutar ESLint
```

## 🗄️ Base de Datos

El proyecto usa **Prisma** como ORM y **PostgreSQL** como base de datos.

### Schema Principal

- **User**: Usuarios del sistema (UUID)
- **Space**: Espacios de trabajo (UUID)
- **Expense**: Gastos (UUID)
- **Category**: Categorías predeterminadas (Int)
- **ExpenseReceipt**: Recibos de gastos (UUID)
- **Tag**: Etiquetas personalizadas (UUID)

### Migraciones

Las migraciones se encuentran en `prisma/migrations/`. Para crear una nueva:

```bash
bunx prisma migrate dev --name nombre_de_la_migracion
```

## 🔐 Autenticación

El proyecto usa **Clerk** para autenticación. Las rutas protegidas están definidas en `src/middleware.ts`.

### Rutas Públicas

- `/sign-in`
- `/sign-up`
- `/forgot-password`
- `/api/webhooks/*`

### Rutas Protegidas

Todas las demás rutas requieren autenticación.

## 🌍 Internacionalización

El proyecto soporta múltiples idiomas usando `next-intl`:

- **Español** (`es`)
- **Inglés** (`en`)
- **Francés** (`fr`)

Los archivos de traducción están en `messages/`. Para agregar un nuevo idioma:

1. Crea `messages/[locale].json`
2. Agrega el locale en `src/i18n/routing.ts`

## 🎨 Estilos

El proyecto usa **Tailwind CSS** y componentes de **ShadCN UI**.

### Tema

El proyecto soporta tema claro y oscuro. El toggle se encuentra en el sidebar.

## 📝 Notas Importantes

- **Bun es el package manager principal**: Aunque el proyecto puede funcionar con npm/yarn, se recomienda usar Bun.
- **UUIDs**: Los IDs principales (User, Space, Expense) usan UUIDs para mejor escalabilidad.
- **Categorías**: Las categorías usan IDs numéricos fijos (1-58) ya que son predeterminadas.
- **Recibos**: Se pueden subir múltiples imágenes al pagar un gasto.
- **Webhooks**: Asegúrate de configurar el webhook de Clerk para sincronización de usuarios.

## 🐛 Solución de Problemas

### Error: "Cannot find module '@prisma/client'"

```bash
bunx prisma generate
```

### Error: "Database connection failed"

- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que la base de datos esté accesible
- Para Neon, verifica que la conexión use SSL

### Error: "Clerk authentication failed"

- Verifica que las claves de Clerk estén correctas en `.env`
- Asegúrate de que el webhook esté configurado correctamente

### Error: "Prisma migrate reset"

⚠️ **Cuidado**: Este comando borra todos los datos de la base de datos.

```bash
bunx prisma migrate reset --force
bunx prisma migrate dev
bun prisma/seed.ts
```

## 📚 Tecnologías

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL (Neon)
- **Autenticación**: Clerk
- **UI**: Tailwind CSS + ShadCN UI
- **i18n**: next-intl
- **Validación**: Zod
- **Estado**: Zustand
- **Formularios**: React Hook Form

## 📄 Licencia

Este proyecto es privado.

## 👥 Contribución

Para contribuir al proyecto, por favor sigue las convenciones de código establecidas y crea un PR con una descripción clara de los cambios.

---

**Desarrollado con ❤️ usando Next.js y TypeScript**
