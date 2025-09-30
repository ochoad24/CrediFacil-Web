import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { cookies } from '$lib/utils/cookies';
import { authStore } from '$lib/stores/auth';

/**
 * Configuración de rutas de autenticación
 */
export const authConfig = {
	// Rutas que NO requieren autenticación
	publicRoutes: ['/login', '/register', '/forgot-password', '/reset-password'],

	// Ruta de login por defecto
	loginRoute: '/login',

	// Ruta después del login exitoso
	defaultRedirect: '/'
};

/**
 * Verifica si una ruta es pública (no requiere autenticación)
 */
export function isPublicRoute(pathname: string): boolean {
	return authConfig.publicRoutes.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`)
	);
}

/**
 * Verifica si el usuario está autenticado basado en cookies
 */
export function isAuthenticated(): boolean {
	if (!browser) return false;

	// Verificar si hay usuario autenticado (cookie o localStorage)
	// Las cookies auth_token y refresh_token son HTTP-Only y las maneja el browser automáticamente
	const hasAuthUser = cookies.exists('auth_user') || !!localStorage.getItem('auth_user');

	// Si tenemos datos del usuario, asumimos que está autenticado
	// El backend maneja automáticamente las cookies HTTP-Only
	return hasAuthUser;
}

/**
 * Obtiene información del usuario autenticado desde cookies
 */
export function getAuthenticatedUser() {
	if (!browser) return null;

	return cookies.getTyped('auth_user');
}

/**
 * Guard de autenticación - redirige al login si no está autenticado
 * Uso: await requireAuth() en +page.ts o +layout.ts
 */
export async function requireAuth(): Promise<void> {
	if (!browser) return; // No hacer nada en el servidor

	const currentPage = get(page);
	const pathname = currentPage?.url?.pathname || '/';

	// Si estamos en una ruta pública, no verificar autenticación
	if (isPublicRoute(pathname)) {
		return;
	}

	// Primero verificar el estado del store (más confiable)
	const currentAuthState = get(authStore);

	// Si el store dice que está autenticado, confiar en eso
	if (currentAuthState.isAuthenticated && currentAuthState.user) {
		return;
	}

	// Si no está en el store, verificar cookies como fallback
	if (!isAuthenticated()) {
		// Guardar la ruta actual para redirigir después del login
		const returnUrl = pathname !== '/' ? `?returnUrl=${encodeURIComponent(pathname)}` : '';
		await goto(`${authConfig.loginRoute}${returnUrl}`, { replaceState: true });
		return;
	}

	// Si las cookies están pero el store no, intentar cargar el estado
	await authStore.checkAuth();

	// Verificar nuevamente después de checkAuth
	const updatedAuthState = get(authStore);
	if (!updatedAuthState.isAuthenticated) {
		const returnUrl = pathname !== '/' ? `?returnUrl=${encodeURIComponent(pathname)}` : '';
		await goto(`${authConfig.loginRoute}${returnUrl}`, { replaceState: true });
	}
}

/**
 * Redirigir si YA está autenticado (útil para páginas de login)
 */
export async function redirectIfAuthenticated(
	redirectTo: string = authConfig.defaultRedirect
): Promise<void> {
	if (!browser) return;

	if (isAuthenticated()) {
		// Verificar si hay returnUrl en query params
		const urlParams = new URLSearchParams(window.location.search);
		const returnUrl = urlParams.get('returnUrl');

		const destination = returnUrl || redirectTo;
		await goto(destination, { replaceState: true });
	}
}

/**
 * Hook para usar en componentes - verifica auth automáticamente
 */
export function useAuthGuard() {
	if (browser) {
		requireAuth();
	}
}

/**
 * Utilitaria para proteger rutas individuales
 * Uso en +page.ts: export const load = protectRoute();
 */
export function protectRoute() {
	return async () => {
		await requireAuth();
		return {};
	};
}
