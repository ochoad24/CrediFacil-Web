import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { cookies, type CookieTypes } from '$lib/utils/cookies';

/**
 * Store reactivo para manejar cookies importantes
 */

// Theme store
function createThemeStore() {
	const { subscribe, set } = writable<CookieTypes['theme']>('auto');

	return {
		subscribe,
		set: (theme: CookieTypes['theme']) => {
			set(theme);
			if (browser) {
				cookies.setTyped('theme', theme);
				// Apply theme to document
				applyTheme(theme);
			}
		},
		init: () => {
			if (browser) {
				const savedTheme = cookies.getTyped('theme') || 'auto';
				set(savedTheme);
				// Ensure DOM is ready before applying theme
				if (document.readyState === 'loading') {
					document.addEventListener('DOMContentLoaded', () => applyTheme(savedTheme));
				} else {
					applyTheme(savedTheme);
				}
			}
		}
	};
}

// User preferences store
function createUserPreferencesStore() {
	const defaultPreferences: CookieTypes['user_preferences'] = {
		notifications: true,
		theme: 'auto',
		language: 'es',
		currency: 'COP'
	};

	const { subscribe, set, update } = writable<CookieTypes['user_preferences']>(defaultPreferences);

	return {
		subscribe,
		set: (preferences: CookieTypes['user_preferences']) => {
			set(preferences);
			if (browser) {
				cookies.setTyped('user_preferences', preferences);
			}
		},
		update: (
			updater: (prefs: CookieTypes['user_preferences']) => CookieTypes['user_preferences']
		) => {
			update((prefs) => {
				const newPrefs = updater(prefs);
				if (browser) {
					cookies.setTyped('user_preferences', newPrefs);
				}
				return newPrefs;
			});
		},
		updatePartial: (partialPreferences: Partial<CookieTypes['user_preferences']>) => {
			update((prefs) => {
				const newPrefs = { ...prefs, ...partialPreferences };
				if (browser) {
					cookies.setTyped('user_preferences', newPrefs);
				}
				return newPrefs;
			});
		},
		init: () => {
			if (browser) {
				const savedPrefs = cookies.getTyped('user_preferences');
				if (savedPrefs) {
					set({ ...defaultPreferences, ...savedPrefs });
				}
			}
		},
		reset: () => {
			set(defaultPreferences);
			if (browser) {
				cookies.remove('user_preferences');
			}
		}
	};
}

// Language store
function createLanguageStore() {
	const { subscribe, set } = writable<string>('es');

	return {
		subscribe,
		set: (language: string) => {
			set(language);
			if (browser) {
				cookies.setTyped('language', language);
			}
		},
		init: () => {
			if (browser) {
				const savedLanguage = cookies.getTyped('language') || 'es';
				set(savedLanguage);
			}
		}
	};
}

// Apply theme to document
function applyTheme(theme: CookieTypes['theme']) {
	if (!browser) return;

	const root = document.documentElement;

	// Always remove the dark class first
	root.classList.remove('dark');

	if (theme === 'auto') {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (prefersDark) {
			root.classList.add('dark');
		}
	} else if (theme === 'dark') {
		root.classList.add('dark');
	}
}

// Create store instances
export const themeStore = createThemeStore();
export const userPreferencesStore = createUserPreferencesStore();
export const languageStore = createLanguageStore();

// Derived stores for easy access
export const currentTheme = derived(themeStore, ($theme) => $theme);
export const currentLanguage = derived(languageStore, ($language) => $language);

// Helper functions for cookie-based authentication
export const cookieAuth = {
	/**
	 * Save user data to cookie after login
	 */
	saveUser: (user: CookieTypes['auth_user']) => {
		if (browser) {
			try {
				// Método 1: Intentar con cookies
				const cookieValue = JSON.stringify(user);
				const expires = new Date();
				expires.setDate(expires.getDate() + 7); // 7 días

				document.cookie = `auth_user=${encodeURIComponent(cookieValue)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

				// Método 2: Respaldo con localStorage (más confiable)
				localStorage.setItem('auth_user', JSON.stringify(user));
			} catch (error) {
				console.error('Error saving auth_user:', error);
			}
		}
	},

	/**
	 * Get current user from cookie or localStorage
	 */
	getUser: (): CookieTypes['auth_user'] | null => {
		if (!browser) return null;

		// Intentar primero con cookies
		const cookieUser = cookies.getTyped('auth_user');
		if (cookieUser) return cookieUser;

		// Si no hay cookie, intentar con localStorage
		try {
			const localUser = localStorage.getItem('auth_user');
			return localUser ? JSON.parse(localUser) : null;
		} catch {
			return null;
		}
	},

	/**
	 * Check if user is authenticated (has valid auth cookie or localStorage)
	 */
	isAuthenticated: (): boolean => {
		if (!browser) return false;

		// Verificar si hay usuario (cookie o localStorage)
		const user = cookieAuth.getUser();
		return !!user;
	},

	/**
	 * Clear authentication cookies and localStorage
	 */
	logout: () => {
		if (browser) {
			cookies.remove('auth_token');
			cookies.remove('auth_user');
			cookies.remove('session_id');

			// También limpiar localStorage
			localStorage.removeItem('auth_user');
		}
	},

	/**
	 * Set remember me preference
	 */
	setRememberMe: (remember: boolean) => {
		if (browser) {
			cookies.setTyped('remember_me', remember);
		}
	},

	/**
	 * Get remember me preference
	 */
	getRememberMe: (): boolean => {
		if (!browser) return false;
		return cookies.getTyped('remember_me') || false;
	}
};

// Initialize stores when module loads (client-side only)
if (browser) {
	themeStore.init();
	userPreferencesStore.init();
	languageStore.init();

	// Listen for system theme changes when using auto theme
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
		themeStore.subscribe((theme) => {
			if (theme === 'auto') {
				applyTheme('auto');
			}
		})();
	});
}
