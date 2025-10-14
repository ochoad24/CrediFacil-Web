import { authStore } from '$lib/stores/auth.svelte';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

interface PermissionGuardOptions {
	/** Permiso único requerido */
	permission?: string;
	/** Al menos uno de estos permisos (OR) */
	anyOf?: string[];
	/** Todos estos permisos (AND) */
	allOf?: string[];
	/** Ruta de redirección si no tiene permisos (default: '/') */
	redirectTo?: string;
	/** Mensaje de error a mostrar (opcional) */
	errorMessage?: string;
}

/**
 * Hook para validar permisos en una página/ruta.
 * Redirecciona automáticamente si el usuario no tiene los permisos necesarios.
 *
 * @example
 * ```typescript
 * // En +page.ts o +page.server.ts
 * import { requirePermission } from '$lib/utils/permission-guard';
 *
 * export const load = async () => {
 *   requirePermission({ permission: 'users.read' });
 *   // o
 *   requirePermission({ anyOf: ['users.read', 'users.update'] });
 *   // o
 *   requirePermission({ allOf: ['users.read', 'users.delete'] });
 * };
 * ```
 */
export function requirePermission(options: PermissionGuardOptions): void {
	if (!browser) return;

	const { permission, anyOf, allOf, redirectTo = '/', errorMessage } = options;

	let hasAccess = false;

	if (permission) {
		hasAccess = authStore.hasPermission(permission);
	} else if (anyOf && anyOf.length > 0) {
		hasAccess = authStore.hasAnyPermission(anyOf);
	} else if (allOf && allOf.length > 0) {
		hasAccess = authStore.hasAllPermissions(allOf);
	}

	if (!hasAccess) {
		console.warn('Permission denied:', options);

		if (errorMessage) {
			// Si tienes un sistema de toast/notificaciones, puedes usarlo aquí
			console.error(errorMessage);
		}

		// Redireccionar
		goto(redirectTo);
	}
}

/**
 * Hook para verificar permisos de forma reactiva en componentes.
 * Retorna una función que verifica los permisos.
 *
 * @example
 * ```svelte
 * <script>
 *   import { checkPermission } from '$lib/utils/permission-guard';
 *
 *   const canEdit = checkPermission({ permission: 'users.update' });
 * </script>
 *
 * {#if canEdit()}
 *   <button>Editar</button>
 * {/if}
 * ```
 */
export function checkPermission(options: Omit<PermissionGuardOptions, 'redirectTo' | 'errorMessage'>): () => boolean {
	const { permission, anyOf, allOf } = options;

	return () => {
		if (permission) {
			return authStore.hasPermission(permission);
		}
		if (anyOf && anyOf.length > 0) {
			return authStore.hasAnyPermission(anyOf);
		}
		if (allOf && allOf.length > 0) {
			return authStore.hasAllPermissions(allOf);
		}
		return false;
	};
}

/**
 * Utilidad para obtener los permisos del usuario actual
 */
export function getUserPermissions(): string[] {
	return authStore.state.permissions;
}

/**
 * Utilidad para verificar si el usuario está autenticado
 */
export function isUserAuthenticated(): boolean {
	return authStore.state.isAuthenticated;
}
