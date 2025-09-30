# Web Kredix

Frontend de CrediFacil construido con SvelteKit y TypeScript.

## Características

- **Framework**: SvelteKit con Svelte 5
- **Estilos**: TailwindCSS 4.0
- **Pruebas**: Vitest con Playwright para pruebas de navegador
- **Lenguaje**: TypeScript
- **Herramienta de construcción**: Vite

## Desarrollo

Una vez que hayas clonado el proyecto e instalado las dependencias con `npm install`, inicia el servidor de desarrollo:

```sh
npm run dev

# o inicia el servidor y abre la aplicación en una nueva pestaña del navegador
npm run dev -- --open
```

## Scripts disponibles

```sh
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo
npm run dev -- --open  # Iniciar servidor y abrir navegador

# Construcción
npm run build        # Crear versión de producción
npm run preview      # Vista previa de la construcción de producción

# Calidad de código
npm run check        # Verificar tipos con svelte-check
npm run check:watch  # Verificar tipos en modo observación
npm run lint         # Ejecutar ESLint y verificar formato con Prettier
npm run format       # Formatear código con Prettier

# Pruebas
npm run test         # Ejecutar todas las pruebas
npm run test:unit    # Ejecutar pruebas unitarias en modo observación
```

## Estructura del proyecto

```
src/
├── lib/             # Componentes y utilidades reutilizables
├── routes/          # Páginas y rutas de la aplicación
├── app.html         # Plantilla HTML principal
├── app.css          # Estilos globales
└── app.d.ts         # Definiciones de tipos TypeScript
```

## Despliegue

Para desplegar tu aplicación, es posible que necesites instalar un [adaptador](https://svelte.dev/docs/kit/adapters) para tu entorno de destino.
