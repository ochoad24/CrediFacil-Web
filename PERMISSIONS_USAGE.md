# Guía de Uso del Sistema de Permisos - Frontend

Esta guía explica cómo usar el sistema de permisos integrado en el frontend de CrediFacil.

## 📋 Tabla de Contenidos

1. [Instalación Completada](#instalación-completada)
2. [Uso Básico](#uso-básico)
3. [Componente PermissionGuard](#componente-permissionguard)
4. [Validación de Rutas](#validación-de-rutas)
5. [Ejemplos Prácticos](#ejemplos-prácticos)
6. [Permisos Disponibles](#permisos-disponibles)

## ✅ Instalación Completada

El sistema de permisos ya está completamente integrado. Los componentes clave son:

- **Store de Auth con Runes**: `/src/lib/stores/auth.svelte.ts`
- **Servicio de Auth**: `/src/lib/services/auth/authService.ts`
- **Componente PermissionGuard**: `/src/lib/components/PermissionGuard.svelte`
- **Utils de Permisos**: `/src/lib/utils/permission-guard.ts`

## 🚀 Uso Básico

### 1. Acceder al Store de Auth

```typescript
import { authStore } from '$lib/stores/auth.svelte';

// Verificar un permiso
const canEdit = authStore.hasPermission('users.update');

// Verificar múltiples permisos (OR)
const canManageUsers = authStore.hasAnyPermission(['users.create', 'users.update']);

// Verificar múltiples permisos (AND)
const canFullManage = authStore.hasAllPermissions(['users.read', 'users.delete']);

// Acceder al usuario actual
const currentUser = authStore.state.user;

// Acceder a los permisos
const permissions = authStore.state.permissions;
```

### 2. En Componentes Svelte

```svelte
<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';

	// Verificar permisos directamente en el template
</script>

{#if authStore.hasPermission('users.create')}
	<button>Crear Usuario</button>
{/if}

{#if authStore.hasAnyPermission(['users.read', 'users.update'])}
	<div>
		<!-- Contenido para usuarios con permisos de lectura o edición -->
	</div>
{/if}
```

## 🛡️ Componente PermissionGuard

El componente `PermissionGuard` te permite mostrar u ocultar elementos basándose en permisos.

### Uso Básico

```svelte
<script lang="ts">
	import PermissionGuard from '$lib/components/PermissionGuard.svelte';
</script>

<!-- Verificar un solo permiso -->
<PermissionGuard permission="users.create">
	<button>Crear Usuario</button>
</PermissionGuard>

<!-- Verificar múltiples permisos (OR) - al menos uno -->
<PermissionGuard anyOf={['users.read', 'users.update']}>
	<div>Lista de usuarios</div>
</PermissionGuard>

<!-- Verificar múltiples permisos (AND) - todos requeridos -->
<PermissionGuard allOf={['users.read', 'users.delete']}>
	<button>Eliminar Usuario</button>
</PermissionGuard>
```

### Con Fallback

```svelte
<PermissionGuard permission="users.create">
	{#snippet fallback()}
		<p class="text-gray-500">No tienes permisos para crear usuarios</p>
	{/snippet}

	<button>Crear Usuario</button>
</PermissionGuard>
```

## 🚪 Validación de Rutas

### Opción 1: En el archivo +page.ts

```typescript
// src/routes/users/+page.ts
import { requirePermission } from '$lib/utils/permission-guard';

export const load = async () => {
	// Redirige a "/" si no tiene el permiso
	requirePermission({ permission: 'users.read' });

	return {};
};
```

### Opción 2: Con opciones personalizadas

```typescript
// src/routes/users/create/+page.ts
import { requirePermission } from '$lib/utils/permission-guard';

export const load = async () => {
	requirePermission({
		permission: 'users.create',
		redirectTo: '/users',
		errorMessage: 'No tienes permisos para crear usuarios'
	});

	return {};
};
```

### Opción 3: Múltiples permisos

```typescript
// src/routes/admin/+page.ts
import { requirePermission } from '$lib/utils/permission-guard';

export const load = async () => {
	// Requiere TODOS estos permisos
	requirePermission({
		allOf: ['users.read', 'roles.read', 'users.delete']
	});

	// O al menos UNO de estos permisos
	requirePermission({
		anyOf: ['users.read', 'roles.read']
	});

	return {};
};
```

## 💡 Ejemplos Prácticos

### Ejemplo 1: Página de Usuarios con Permisos

```svelte
<!-- src/routes/users/+page.svelte -->
<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import PermissionGuard from '$lib/components/PermissionGuard.svelte';

	let users = [];

	async function loadUsers() {
		// Cargar usuarios...
	}

	async function createUser() {
		// Crear usuario...
	}

	async function deleteUser(id: string) {
		// Eliminar usuario...
	}
</script>

<div class="users-page">
	<div class="header">
		<h1>Gestión de Usuarios</h1>

		<!-- Botón de crear solo si tiene permiso -->
		<PermissionGuard permission="users.create">
			<button on:click={createUser}>
				Crear Usuario
			</button>
		</PermissionGuard>
	</div>

	<!-- Lista de usuarios solo si tiene permiso de lectura -->
	<PermissionGuard permission="users.read">
		<div class="users-list">
			{#each users as user}
				<div class="user-item">
					<span>{user.name}</span>

					<!-- Botón de editar solo si tiene permiso -->
					{#if authStore.hasPermission('users.update')}
						<button>Editar</button>
					{/if}

					<!-- Botón de eliminar solo si tiene permiso -->
					<PermissionGuard permission="users.delete">
						<button on:click={() => deleteUser(user.id)}>
							Eliminar
						</button>
					</PermissionGuard>
				</div>
			{/each}
		</div>
	</PermissionGuard>
</div>
```

### Ejemplo 2: Sidebar con Permisos (Ya Implementado)

El Sidebar ya está configurado con permisos. Para agregar permisos a un item del menú:

```typescript
// src/lib/components/layout/Sidebar.svelte
const menuItems: MenuItem[] = [
	{
		key: 'users',
		href: '/users',
		icon: Users,
		label: 'Usuarios',
		permissions: ['users.read'] // Solo visible si tiene este permiso
	},
	{
		key: 'roles',
		href: '/roles',
		icon: Layers,
		label: 'Roles',
		permissions: ['roles.read']
	}
];
```

### Ejemplo 3: Validación en Formularios

```svelte
<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import PermissionGuard from '$lib/components/PermissionGuard.svelte';

	let formData = {
		name: '',
		email: '',
		role: ''
	};

	async function handleSubmit() {
		// Guardar datos...
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<input bind:value={formData.name} placeholder="Nombre" />
	<input bind:value={formData.email} placeholder="Email" />

	<!-- Campo de rol solo visible para administradores -->
	<PermissionGuard anyOf={['users.create', 'users.update']}>
		<select bind:value={formData.role}>
			<option value="">Seleccionar Rol</option>
			<option value="admin">Administrador</option>
			<option value="user">Usuario</option>
		</select>
	</PermissionGuard>

	<!-- Botón de guardar con validación de permisos -->
	{#if authStore.hasAnyPermission(['users.create', 'users.update'])}
		<button type="submit">Guardar</button>
	{/if}
</form>
```

## 📝 Permisos Disponibles

### Roles
- `roles.create` - Crear nuevos roles
- `roles.read` - Ver roles
- `roles.update` - Actualizar roles
- `roles.delete` - Eliminar roles

### Usuarios
- `users.create` - Crear usuarios
- `users.read` - Ver usuarios
- `users.update` - Actualizar usuarios
- `users.delete` - Eliminar usuarios
- `users.unlock` - Desbloquear usuarios

### Archivos
- `files.upload` - Subir archivos
- `files.read` - Ver archivos
- `files.download` - Descargar archivos
- `files.update` - Actualizar archivos
- `files.delete` - Eliminar archivos

## 🔧 Funciones Útiles

### checkPermission

Útil para crear funciones reactivas de verificación:

```svelte
<script lang="ts">
	import { checkPermission } from '$lib/utils/permission-guard';

	const canEdit = checkPermission({ permission: 'users.update' });
	const canDelete = checkPermission({ permission: 'users.delete' });
</script>

{#if canEdit()}
	<button>Editar</button>
{/if}

{#if canDelete()}
	<button>Eliminar</button>
{/if}
```

### getUserPermissions

Obtener todos los permisos del usuario actual:

```typescript
import { getUserPermissions } from '$lib/utils/permission-guard';

const permissions = getUserPermissions();
console.log('Permisos del usuario:', permissions);
```

### isUserAuthenticated

Verificar si el usuario está autenticado:

```typescript
import { isUserAuthenticated } from '$lib/utils/permission-guard';

if (isUserAuthenticated()) {
	// Usuario autenticado
}
```

## 🔄 Refrescar Permisos

Si los permisos del usuario cambian (por ejemplo, después de actualizar su rol), puedes refrescarlos:

```typescript
import { authStore } from '$lib/stores/auth.svelte';

// Refrescar permisos desde el servidor
await authStore.refreshPermissions();
```

## ⚠️ Mejores Prácticas

1. **Siempre verificar en el backend**: Los permisos del frontend son solo para UX. La seguridad real está en el backend.

2. **Usar PermissionGuard para UI**: Para elementos de UI, usa el componente `PermissionGuard` para mantener el código limpio.

3. **Usar requirePermission para rutas**: Para proteger rutas completas, usa `requirePermission` en los archivos `+page.ts`.

4. **Cachear permisos**: Los permisos se guardan en localStorage automáticamente para mejorar el rendimiento.

5. **Manejar errores 403**: Si el backend rechaza una petición por falta de permisos, muestra un mensaje claro al usuario.

## 🐛 Debugging

Para ver los permisos actuales del usuario en la consola:

```typescript
import { authStore } from '$lib/stores/auth.svelte';

console.log('Usuario actual:', authStore.state.user);
console.log('Permisos:', authStore.state.permissions);
console.log('¿Autenticado?:', authStore.state.isAuthenticated);
```

## 📚 Recursos Adicionales

- Documentación del backend: `/api-kredix/FRONTEND_PERMISSIONS_GUIDE.md`
- Ejemplos de uso: Esta guía
- Código fuente del store: `/src/lib/stores/auth.svelte.ts`
- Componente PermissionGuard: `/src/lib/components/PermissionGuard.svelte`
