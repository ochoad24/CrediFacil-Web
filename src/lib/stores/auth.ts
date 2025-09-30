import { writable, derived } from 'svelte/store';
import { authService } from '$lib/services/auth/authService';
import { cookieAuth } from '$lib/stores/cookies';

interface LoginUser {
	id: string;
	username: string;
	name: string;
}

interface AuthState {
	user: LoginUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
	user: null,
	isLoading: false,
	isAuthenticated: false
};

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(initialState);

	return {
		subscribe,

		// Actions
		login: async (credentials: { username: string; password: string }) => {
			update((state) => ({ ...state, isLoading: true }));

			try {
				const response = await authService.login(credentials);

				if (!response || !response.user) {
					throw new Error('Respuesta de login inválida');
				}

				// Guardar usuario en cookie (el token ya se guarda automáticamente como cookie HTTP-Only por el backend)
				cookieAuth.saveUser(response.user);

				update((state) => ({
					...state,
					user: response.user,
					isAuthenticated: true,
					isLoading: false
				}));

				return response;
			} catch (error) {
				update((state) => ({ ...state, isLoading: false }));
				throw error;
			}
		},

		logout: async () => {
			try {
				await authService.logout();
			} catch (error) {
				console.error('Logout error:', error);
			} finally {
				// Limpiar cookies de autenticación
				cookieAuth.logout();
				set(initialState);
			}
		},

		checkAuth: async () => {
			update((state) => ({ ...state, isLoading: true }));

			try {
				// Verificar si hay cookies de autenticación válidas
				if (cookieAuth.isAuthenticated()) {
					const user = cookieAuth.getUser();
					if (user) {
						update((state) => ({
							...state,
							user,
							isAuthenticated: true,
							isLoading: false
						}));
						return;
					}
				}

				// Si no hay cookies válidas, limpiar estado
				cookieAuth.logout();
				update((state) => ({ ...state, isLoading: false }));
			} catch (error) {
				console.error('Error checking auth:', error);
				cookieAuth.logout();
				update((state) => ({ ...state, isLoading: false }));
			}
		}
	};
}

export const authStore = createAuthStore();

// Derived stores para facilitar el acceso
export const user = derived(authStore, ($auth) => $auth.user);
export const isAuthenticated = derived(authStore, ($auth) => $auth.isAuthenticated);
export const isLoading = derived(authStore, ($auth) => $auth.isLoading);
