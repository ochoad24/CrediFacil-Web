import { browser } from '$app/environment';
import { authService } from '$lib/services/auth/authService';
import { cookieAuth } from '$lib/stores/cookies';

interface LoginUser {
	id: string;
	username: string;
	name: string;
}

interface AuthState {
	user: LoginUser | null;
	permissions: string[];
	isLoading: boolean;
	isAuthenticated: boolean;
}

const initialState: AuthState = {
	user: null,
	permissions: [],
	isLoading: false,
	isAuthenticated: false
};

// Cargar estado inicial desde localStorage
function loadFromStorage(): AuthState {
	if (!browser) return initialState;

	try {
		// Cargar usuario desde cookies/localStorage
		const user = cookieAuth.getUser();

		// Cargar permisos desde localStorage
		const storedPermissions = localStorage.getItem('auth_permissions');
		const permissions = storedPermissions ? JSON.parse(storedPermissions) : [];

		if (user) {
			return {
				user,
				permissions,
				isLoading: false,
				isAuthenticated: true
			};
		}
	} catch (e) {
		console.error('Error loading auth from storage:', e);
	}

	return initialState;
}

class AuthStore {
	state = $state<AuthState>(loadFromStorage());

	constructor() {
		// Inicializar estado desde storage
		if (browser) {
			const stored = loadFromStorage();
			this.state = stored;
		}
	}

	async login(credentials: { username: string; password: string; recaptcha_token?: string }) {
		this.state.isLoading = true;

		try {
			const response = await authService.login(credentials);

			if (!response || !response.user) {
				throw new Error('Respuesta de login inválida');
			}

			// Guardar usuario en cookies/localStorage
			cookieAuth.saveUser(response.user);

			// Guardar permisos en localStorage
			if (browser && response.permissions) {
				localStorage.setItem('auth_permissions', JSON.stringify(response.permissions));
			}

			this.state = {
				user: response.user,
				permissions: response.permissions || [],
				isAuthenticated: true,
				isLoading: false
			};

			return response;
		} catch (error) {
			this.state.isLoading = false;
			throw error;
		}
	}

	async logout() {
		try {
			await authService.logout();
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			// Limpiar cookies y localStorage
			cookieAuth.logout();
			if (browser) {
				localStorage.removeItem('auth_permissions');
			}
			this.state = initialState;
		}
	}

	async checkAuth() {
		this.state.isLoading = true;

		try {
			// Verificar si hay cookies de autenticación válidas
			if (cookieAuth.isAuthenticated()) {
				const user = cookieAuth.getUser();
				const storedPermissions = browser ? localStorage.getItem('auth_permissions') : null;
				const permissions = storedPermissions ? JSON.parse(storedPermissions) : [];

				if (user) {
					this.state = {
						user,
						permissions,
						isAuthenticated: true,
						isLoading: false
					};
					return;
				}
			}

			// Si no hay cookies válidas, limpiar estado
			cookieAuth.logout();
			if (browser) {
				localStorage.removeItem('auth_permissions');
			}
			this.state = { ...initialState, isLoading: false };
		} catch (error) {
			console.error('Error checking auth:', error);
			cookieAuth.logout();
			if (browser) {
				localStorage.removeItem('auth_permissions');
			}
			this.state = { ...initialState, isLoading: false };
		}
	}

	updatePermissions(permissions: string[]) {
		this.state = {
			...this.state,
			permissions
		};
		if (browser) {
			localStorage.setItem('auth_permissions', JSON.stringify(permissions));
		}
	}

	// Verificar si el usuario tiene un permiso específico
	hasPermission(permission: string): boolean {
		return this.state.permissions.includes(permission);
	}

	// Verificar si el usuario tiene al menos uno de los permisos
	hasAnyPermission(permissions: string[]): boolean {
		return permissions.some((p) => this.state.permissions.includes(p));
	}

	// Verificar si el usuario tiene todos los permisos
	hasAllPermissions(permissions: string[]): boolean {
		return permissions.every((p) => this.state.permissions.includes(p));
	}

	// Refrescar permisos desde el servidor
	async refreshPermissions(): Promise<void> {
		try {
			const permissions = await authService.getPermissions();
			this.updatePermissions(permissions);
		} catch (error) {
			console.error('Error refreshing permissions:', error);
			throw error;
		}
	}
}

export const authStore = new AuthStore();

// Derived getters para compatibilidad y facilidad de uso
export const user = {
	get current() {
		return authStore.state.user;
	}
};

export const isAuthenticated = {
	get current() {
		return authStore.state.isAuthenticated;
	}
};

export const isLoading = {
	get current() {
		return authStore.state.isLoading;
	}
};

export const permissions = {
	get current() {
		return authStore.state.permissions;
	}
};
