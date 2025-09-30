# Sistema de Manejo de Cookies

Este sistema proporciona una solución completa para manejar cookies en la aplicación web-kredix de manera type-safe y reactiva.

## Características

- **Type-safe**: Tipos definidos para cookies conocidas
- **Reactive**: Stores de Svelte para actualizaciones automáticas
- **Seguro**: Configuración de seguridad por defecto
- **Flexible**: Funciona con cookies simples o complejas (JSON)
- **SSR-friendly**: Funciona correctamente en servidor y cliente

## Estructura del Sistema

### 1. Utilidades Base (`/src/lib/utils/cookies.ts`)

Funciones básicas para manipular cookies:

```typescript
import { cookies, getCookie, setCookie, removeCookie } from '$lib/utils/cookies';

// Uso básico
setCookie('theme', 'dark');
const theme = getCookie('theme'); // 'dark' | null

// Con opciones
setCookie('auth_token', 'abc123', {
	maxAge: 60 * 60 * 24, // 1 día
	secure: true,
	sameSite: 'strict'
});

// JSON automático
setCookieJSON('user_prefs', { theme: 'dark', lang: 'es' });
const prefs = getCookieJSON('user_prefs'); // objeto parseado o null
```

### 2. Stores Reactivos (`/src/lib/stores/cookies.ts`)

Stores que sincronizan automáticamente con cookies:

```typescript
import { themeStore, userPreferencesStore, cookieAuth } from '$lib/stores/cookies';

// Theme store
themeStore.set('dark'); // Guarda en cookie y actualiza UI
$: console.log($themeStore); // Reactivo

// User preferences
userPreferencesStore.updatePartial({ language: 'en' });
$: prefs = $userPreferencesStore; // Reactivo
```

## Uso en Componentes

### Theme Toggle

```svelte
<script>
	import { themeStore } from '$lib/stores/cookies';
	import { ThemeToggle } from '$lib/components/ui';
</script>

<!-- Componente pre-construido -->
<ThemeToggle />

<!-- O manualmente -->
<button on:click={() => themeStore.set('dark')}> Tema oscuro </button>
```

### Preferencias de Usuario

```svelte
<script>
	import { userPreferencesStore } from '$lib/stores/cookies';
	import { UserPreferences } from '$lib/components/ui';
</script>

<!-- Componente completo de preferencias -->
<UserPreferences />

<!-- O acceso directo -->
<select
	value={$userPreferencesStore.language}
	on:change={(e) => userPreferencesStore.updatePartial({ language: e.target.value })}
>
	<option value="es">Español</option>
	<option value="en">English</option>
</select>
```

## Autenticación con Cookies

### Login

```typescript
import { cookieAuth } from '$lib/stores/cookies';

// Después del login exitoso
const user = { id: '123', username: 'john', name: 'John Doe' };
cookieAuth.saveUser(user);

// Verificar autenticación
if (cookieAuth.isAuthenticated()) {
	const user = cookieAuth.getUser();
	console.log('Usuario logueado:', user);
}
```

### Logout

```typescript
// Limpiar todas las cookies de auth
cookieAuth.logout();
```

### Verificación Automática

```typescript
// En el layout principal (ya configurado)
import { authStore } from '$lib/stores/auth';
import { onMount } from 'svelte';

onMount(() => {
	authStore.checkAuth(); // Verifica cookies automáticamente
});
```

## Tipos de Cookies Definidos

El sistema incluye tipos predefinidos para cookies comunes:

```typescript
interface CookieTypes {
	auth_token: string;
	auth_user: {
		id: string;
		username: string;
		name: string;
		role?: string;
	};
	user_preferences: {
		notifications: boolean;
		theme: 'light' | 'dark' | 'auto';
		language: string;
		currency: string;
	};
	theme: 'light' | 'dark' | 'auto';
	language: string;
	session_id: string;
	remember_me: boolean;
}
```

### Uso Type-safe

```typescript
import { cookies } from '$lib/utils/cookies';

// Type-safe con autocompletado
cookies.setTyped('theme', 'dark'); // ✓ Válido
cookies.setTyped('theme', 'invalid'); // ✗ Error de TypeScript

const user = cookies.getTyped('auth_user'); // Tipo inferido automáticamente
```

## Configuración por Defecto

Cada tipo de cookie tiene configuración de seguridad automática:

- **auth_token**: `secure: true, sameSite: 'strict', maxAge: 7 días`
- **user_preferences**: `maxAge: 1 año, sameSite: 'lax'`
- **theme**: `maxAge: 1 año, sameSite: 'lax'`

## Ejemplos Avanzados

### Cookie Personalizada con Validación

```typescript
import { cookies } from '$lib/utils/cookies';

function saveUserSettings(settings: UserSettings) {
	// Validar antes de guardar
	if (!isValidSettings(settings)) {
		throw new Error('Settings inválidos');
	}

	cookies.setJSON('user_settings', settings, {
		maxAge: 60 * 60 * 24 * 30, // 30 días
		secure: true,
		sameSite: 'lax'
	});
}

function getUserSettings(): UserSettings | null {
	const settings = cookies.getJSON<UserSettings>('user_settings');

	// Validar después de leer
	if (settings && !isValidSettings(settings)) {
		cookies.remove('user_settings');
		return null;
	}

	return settings;
}
```

### Store Personalizado para Cookie Específica

```typescript
import { writable } from 'svelte/store';
import { cookies } from '$lib/utils/cookies';
import { browser } from '$app/environment';

function createCustomStore(cookieName: string, defaultValue: string) {
	const { subscribe, set } = writable(defaultValue);

	return {
		subscribe,
		set: (value: string) => {
			set(value);
			if (browser) {
				cookies.set(cookieName, value, { maxAge: 60 * 60 * 24 * 365 });
			}
		},
		init: () => {
			if (browser) {
				const saved = cookies.get(cookieName) || defaultValue;
				set(saved);
			}
		}
	};
}

export const customStore = createCustomStore('custom_setting', 'default');
```

## Migración de localStorage

Si ya usas localStorage, migrar es sencillo:

```typescript
// Antes (localStorage)
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');

// Después (cookies)
setCookie('theme', 'dark');
const theme = getCookie('theme');

// O con stores (recomendado)
themeStore.set('dark');
const theme = $themeStore;
```

## Debugging

Todas las cookies se pueden inspeccionar fácilmente:

```typescript
import { cookies } from '$lib/utils/cookies';

// Ver todas las cookies
console.log(cookies.getAll());

// Verificar cookie específica
console.log('Auth token exists:', cookies.exists('auth_token'));
console.log('Auth user:', cookies.getTyped('auth_user'));

// Limpiar todas las cookies (desarrollo)
if (import.meta.env.DEV) {
	cookies.clearAll();
}
```

## Consideraciones de Seguridad

1. **Tokens de autenticación**: Siempre usar `secure: true` y `httpOnly: true` (cuando sea posible)
2. **Datos sensibles**: No almacenar información sensible en cookies del lado cliente
3. **HTTPS**: Las cookies seguras solo funcionan sobre HTTPS
4. **SameSite**: Usar `strict` para auth, `lax` para preferencias

## SSR y Hidratación

El sistema maneja correctamente SSR:

```typescript
// En el servidor, las funciones de cookies no hacen nada
// En el cliente, funcionan normalmente
// Los stores se inicializan automáticamente en onMount
```

## Troubleshooting

### Cookie no se guarda

- Verificar que estés en HTTPS si usas `secure: true`
- Revisar el tamaño (límite ~4KB por cookie)
- Verificar formato de fecha en `expires`

### Store no se actualiza

- Asegurar que `browser` sea `true`
- Llamar `.init()` en stores personalizados
- Verificar que el componente esté montado

### Tipos no funcionan

- Verificar que hayas importado de `$lib/utils/cookies`
- Asegurar que el nombre de cookie esté en `CookieTypes`
- Usar `.setTyped()` y `.getTyped()` para type safety
