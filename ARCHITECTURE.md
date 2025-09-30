# CrediFacil - Arquitectura del Frontend

Este documento describe la arquitectura y organización del proyecto frontend de CrediFacil, diseñado para ser escalable y facilitar el trabajo de múltiples desarrolladores.

## 📁 Estructura del Proyecto

```
src/
├── lib/                              # Lógica compartida y utilidades
│   ├── components/                   # Componentes reutilizables
│   │   ├── ui/                       # Sistema de diseño base
│   │   │   ├── Badge.svelte
│   │   │   ├── Button.svelte
│   │   │   ├── Card.svelte
│   │   │   ├── Input.svelte
│   │   │   └── index.ts
│   │   ├── layout/                   # Componentes de layout
│   │   │   ├── Header.svelte
│   │   │   ├── Sidebar.svelte
│   │   │   └── index.ts
│   │   ├── forms/                    # Formularios específicos
│   │   └── common/                   # Componentes comunes del negocio
│   ├── stores/                       # Gestión de estado (Svelte stores)
│   │   ├── auth.ts                   # Estado de autenticación
│   │   ├── credits.ts                # Estado de créditos
│   │   └── index.ts
│   ├── services/                     # Servicios de API y lógica de negocio
│   │   ├── api/
│   │   │   └── client.ts             # Cliente HTTP base
│   │   ├── auth/
│   │   │   └── authService.ts        # Servicios de autenticación
│   │   ├── credits/
│   │   │   └── creditService.ts      # Servicios de créditos
│   │   └── index.ts
│   ├── utils/                        # Utilidades y helpers
│   │   └── cn.ts                     # Utility para clases CSS
│   ├── types/                        # Tipos TypeScript
│   │   ├── user.ts
│   │   ├── credit.ts
│   │   └── index.ts
│   └── constants/                    # Constantes globales
│       └── index.ts
├── routes/                           # Páginas y rutas (SvelteKit)
│   ├── (auth)/                       # Grupo: Autenticación
│   │   ├── login/
│   │   │   └── +page.svelte
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/                  # Grupo: Dashboard principal
│   │   ├── dashboard/
│   │   ├── credits/
│   │   ├── clients/
│   │   └── reports/
│   ├── (admin)/                      # Grupo: Administración
│   │   ├── users/
│   │   ├── settings/
│   │   └── audit/
│   └── api/                          # Endpoints de API (opcional)
├── assets/                           # Recursos estáticos
├── app.html                          # Template HTML base
├── app.css                           # Estilos globales
└── app.d.ts                          # Definiciones de tipos de la app
```

## 📋 Convenciones de Nomenclatura

### Archivos y Carpetas

- **Carpetas**: `kebab-case` para todas las carpetas
  - ✅ `client-profile`, `credit-requests`, `forgot-password`
  - ❌ `clientProfile`, `CreditRequests`, `forgotPassword`

- **Componentes Svelte**: `PascalCase.svelte`
  - ✅ `CreditForm.svelte`, `ClientCard.svelte`, `PaymentModal.svelte`
  - ❌ `creditForm.svelte`, `client-card.svelte`

- **Servicios y Utilidades**: `camelCase.ts`
  - ✅ `authService.ts`, `creditService.ts`, `dateUtils.ts`
  - ❌ `AuthService.ts`, `credit-service.ts`

- **Stores**: `camelCase.ts`
  - ✅ `authStore.ts`, `creditsStore.ts`, `userPreferences.ts`
  - ❌ `AuthStore.ts`, `credits-store.ts`

### Rutas

- **Route Groups**: `(nombre)` para agrupar rutas relacionadas
  - `(auth)` - Páginas de autenticación
  - `(dashboard)` - Páginas del dashboard principal
  - `(admin)` - Páginas administrativas

- **Páginas**: `kebab-case` para URLs consistentes
  - `/credit-requests`, `/client-profile`, `/payment-history`

## 🏗️ Principios de Arquitectura

### 1. Separación por Capas

**Presentación (`/routes` + `/lib/components`)**

- Componentes de UI y páginas
- Lógica de presentación únicamente
- No contiene lógica de negocio

**Lógica de Negocio (`/lib/stores` + `/lib/services`)**

- Gestión de estado de la aplicación
- Comunicación con APIs
- Reglas de negocio

**Utilidades (`/lib/utils` + `/lib/types` + `/lib/constants`)**

- Funciones helper reutilizables
- Definiciones de tipos
- Constantes de configuración

### 2. Organización por Módulos

Cada módulo de negocio tiene su propia estructura:

```
credits/
├── components/           # Componentes específicos de créditos
├── stores/              # Estado relacionado con créditos
├── services/            # API calls para créditos
├── types/              # Tipos específicos de créditos
└── routes/             # Páginas de créditos
```

### 3. Reutilización de Componentes

**Sistema de Diseño (`/lib/components/ui`)**

- Componentes base reutilizables
- Implementan el design system
- Sin lógica de negocio específica

**Componentes de Negocio (`/lib/components/common`)**

- Componentes específicos del dominio
- Combinan múltiples componentes UI
- Contienen lógica de negocio relacionada

## 📤 Estrategias de Importación

### Imports Absolutos Recomendados

```typescript
// ✅ Correcto - Imports desde lib
import { Button, Card, Input } from '$lib/components/ui';
import { authStore, creditsStore } from '$lib/stores';
import { authService } from '$lib/services';
import type { User, Credit } from '$lib/types';

// ✅ Correcto - Imports de SvelteKit
import { goto } from '$app/navigation';
import { page } from '$app/stores';

// ❌ Evitar - Imports relativos largos
import Button from '../../../components/ui/Button.svelte';
```

### Patrón de Index Files

Cada carpeta principal debe tener un `index.ts` para exportaciones centralizadas:

```typescript
// src/lib/components/ui/index.ts
export { default as Button } from './Button.svelte';
export { default as Card } from './Card.svelte';
export { default as Input } from './Input.svelte';

// src/lib/services/index.ts
export { authService } from './auth/authService';
export { creditService } from './credits/creditService';
```

## 🔄 Flujo de Datos

### 1. Arquitectura Unidireccional

```
UI Components → Stores → Services → API → Backend
     ↑                                        ↓
     └──────── State Updates ←─────────────────┘
```

### 2. Gestión de Estado

**Stores Reactivos (Svelte)**

```typescript
// Definición del store
export const authStore = writable<AuthState>(initialState);

// Uso en componentes
$: user = $authStore.user;
$: isLoggedIn = $authStore.isAuthenticated;
```

**Derived Stores para Datos Computados**

```typescript
export const activeCredits = derived(creditsStore, ($credits) =>
	$credits.filter((c) => c.status === 'active')
);
```

### 3. Comunicación con APIs

**Patrón Service Layer**

```typescript
// En el service
async function fetchCredits(): Promise<Credit[]> {
	const response = await apiClient.get('/credits');
	return response.data;
}

// En el store
async function loadCredits() {
	try {
		const credits = await creditService.fetchCredits();
		creditsStore.update((state) => ({ ...state, credits }));
	} catch (error) {
		// Handle error
	}
}
```

## 🚀 Mejores Prácticas para Equipos

### 1. Desarrollo en Paralelo

**Asignación por Módulos**

- Developer A: Módulo de Authentication (`(auth)/*`)
- Developer B: Módulo de Credits (`(dashboard)/credits/*`)
- Developer C: Módulo de Users (`(admin)/users/*`)

**Shared Components**

- Un developer líder mantiene `/lib/components/ui`
- Changes require review antes de merge

### 2. Patrones de Componentes

**Componente con Props Tipadas**

```svelte
<script lang="ts">
	import type { Credit } from '$lib/types';

	export let credit: Credit;
	export let onEdit: (id: string) => void = () => {};
	export let readonly: boolean = false;
</script>
```

**Componente con Slots**

```svelte
<script lang="ts">
	export let title: string;
</script>

<div class="card">
	<header>
		<h2>{title}</h2>
		<slot name="actions" />
	</header>
	<main>
		<slot />
	</main>
</div>
```

### 3. Testing Strategy

**Estructura de Tests**

```
tests/
├── unit/
│   ├── components/
│   ├── services/
│   └── utils/
├── integration/
└── e2e/
```

### 4. Code Review Guidelines

**Checklist para PRs**

- [ ] Sigue convenciones de nomenclatura
- [ ] Componentes están en la carpeta correcta
- [ ] Exports añadidos a index.ts correspondiente
- [ ] Types definidos correctamente
- [ ] No hay imports relativos largos
- [ ] Tests añadidos/actualizados

## 📈 Escalabilidad

### Agregar Nuevo Módulo

1. **Crear estructura de carpetas**

   ```bash
   mkdir -p src/routes/\(dashboard\)/nueva-funcionalidad
   mkdir -p src/lib/components/nueva-funcionalidad
   ```

2. **Definir tipos**

   ```typescript
   // src/lib/types/nuevaFuncionalidad.ts
   export interface NuevaEntity {
   	id: string;
   	// propiedades...
   }
   ```

3. **Crear servicios**

   ```typescript
   // src/lib/services/nuevaFuncionalidad/
   export class NuevaFuncionalidadService {
   	// métodos de API...
   }
   ```

4. **Implementar store**

   ```typescript
   // src/lib/stores/nuevaFuncionalidad.ts
   export const nuevaFuncionalidadStore = writable<State>(initialState);
   ```

5. **Crear componentes y páginas**

### Mantener Consistencia

- **Linter**: ESLint + Prettier configurados
- **Git Hooks**: Pre-commit hooks para formato
- **Documentation**: Actualizar este README con cambios

## 🔧 Configuración de Desarrollo

### Scripts Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Linting
npm run lint
npm run format

# Testing
npm run test
npm run test:unit
```

### VSCode Extensions Recomendadas

- Svelte for VS Code
- TypeScript Hero
- Tailwind CSS IntelliSense
- ESLint
- Prettier

Esta arquitectura garantiza que el proyecto sea mantenible, escalable y permita el trabajo colaborativo efectivo de múltiples desarrolladores.
