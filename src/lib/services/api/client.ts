import { browser } from '$app/environment';

interface ApiResponse<T> {
	data: T;
	message?: string;
	success: boolean;
}

interface ApiError {
	message: string;
	status: number;
	errors?: Record<string, string[]>;
}

class ApiClient {
	private baseUrl: string;
	private isRefreshing = false;
	private refreshPromise: Promise<void> | null = null;

	constructor(baseUrl?: string) {
		// En producción usa VITE_API_URL, en desarrollo usa el proxy /api
		this.baseUrl = baseUrl || import.meta.env.VITE_API_URL || '/api';
	}

	private async refreshToken(): Promise<void> {
		if (this.isRefreshing) {
			// Si ya estamos refrescando, esperar a que termine
			return this.refreshPromise!;
		}

		this.isRefreshing = true;
		this.refreshPromise = this.performRefresh();

		try {
			await this.refreshPromise;
		} finally {
			this.isRefreshing = false;
			this.refreshPromise = null;
		}
	}

	private async performRefresh(): Promise<void> {
		try {
			const response = await fetch(`${this.baseUrl}/v1/auth/refresh`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const data = await response.json().catch(() => ({ error: 'Failed to refresh token' }));

				// Si el refresh falla por problemas de autenticación, limpiar todo y redirigir
				console.warn('Refresh token failed:', data.error || data.message);
				this.clearAuthAndRedirect();

				throw new Error(data.error || data.message || 'Failed to refresh token');
			}
		} catch (error) {
			// Si hay cualquier error en el refresh, limpiar sesión
			console.warn('Refresh token error:', error);
			this.clearAuthAndRedirect();
			throw error;
		}
	}

	private clearAuthAndRedirect(): void {
		if (browser) {
			// Limpiar todas las cookies de autenticación
			document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
			document.cookie = 'auth_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

			// Limpiar localStorage si hay datos de auth
			localStorage.removeItem('auth_user');
			localStorage.removeItem('auth_token');

			// Redirigir al login
			window.location.href = '/login';
		}
	}

	private shouldForceLogout(endpoint: string, statusCode: number): boolean {
		// No forzar logout en las rutas de autenticación
		if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
			return false;
		}

		// Forzar logout para cualquier 401 fuera de las rutas de auth
		return statusCode === 401;
	}

	private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
		const url = `${this.baseUrl}${endpoint}`;

		const config: RequestInit = {
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			},
			credentials: 'include', // Include cookies in requests (auth_token and refresh_token)
			...options
		};

		try {
			const response = await fetch(url, config);
			const data = await response.json();

			// Verificar si necesitamos forzar logout PRIMERO antes de intentar refresh
			if (response.status === 401 && this.shouldForceLogout(endpoint, response.status)) {
				console.warn(
					'Forcing logout due to 401 Unauthorized:',
					data.error || data.message || 'No specific error message'
				);
				this.clearAuthAndRedirect();
				throw {
					message: data.error || data.message || 'Sesión expirada',
					status: response.status,
					errors: data.details || data.errors  // Mapear details del API a errors
				} as ApiError;
			}

			// Si llegamos aquí con un 401, debe ser en login/register, así que no hacer refresh
			if (!response.ok) {
				throw {
					message: data.error || data.message || 'Error de conexión',
					status: response.status,
					errors: data.details || data.errors  // Mapear details del API a errors
				} as ApiError;
			}

			return data;
		} catch (error) {
			if (error instanceof TypeError) {
				throw {
					message: 'Network error - please check your connection',
					status: 0
				} as ApiError;
			}
			throw error;
		}
	}

	async get<T>(endpoint: string): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { method: 'GET' });
	}

	async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined
		});
	}

	async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined
		});
	}

	async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, {
			method: 'PATCH',
			body: data ? JSON.stringify(data) : undefined
		});
	}

	async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
		return this.request<T>(endpoint, { method: 'DELETE' });
	}
}

export const apiClient = new ApiClient();
export type { ApiResponse, ApiError };
