import { browser } from '$app/environment';

export interface CookieOptions {
	expires?: Date | number; // Date object or days from now
	maxAge?: number; // seconds
	path?: string;
	domain?: string;
	secure?: boolean;
	httpOnly?: boolean; // Note: Can't be set from client-side JavaScript
	sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Utility class for handling cookies in SvelteKit applications
 */
class CookieManager {
	/**
	 * Set a cookie
	 * @param name Cookie name
	 * @param value Cookie value
	 * @param options Cookie options
	 */
	set(name: string, value: string, options: CookieOptions = {}): void {
		if (!browser) return;

		const { expires, maxAge, path = '/', domain, secure, sameSite = 'lax' } = options;

		let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

		if (expires) {
			const expiresDate =
				typeof expires === 'number'
					? new Date(Date.now() + expires * 24 * 60 * 60 * 1000) // days to milliseconds
					: expires;
			cookieString += `; expires=${expiresDate.toUTCString()}`;
		}

		if (maxAge !== undefined) {
			cookieString += `; max-age=${maxAge}`;
		}

		if (path) {
			cookieString += `; path=${path}`;
		}

		if (domain) {
			cookieString += `; domain=${domain}`;
		}

		if (secure) {
			cookieString += `; secure`;
		}

		if (sameSite) {
			cookieString += `; samesite=${sameSite}`;
		}

		document.cookie = cookieString;
	}

	/**
	 * Get a cookie value
	 * @param name Cookie name
	 * @returns Cookie value or null if not found
	 */
	get(name: string): string | null {
		if (!browser) return null;

		const nameEQ = encodeURIComponent(name) + '=';
		const cookies = document.cookie.split(';');

		for (let cookie of cookies) {
			cookie = cookie.trim();
			if (cookie.indexOf(nameEQ) === 0) {
				return decodeURIComponent(cookie.substring(nameEQ.length));
			}
		}

		return null;
	}

	/**
	 * Get a cookie value and parse as JSON
	 * @param name Cookie name
	 * @returns Parsed JSON object or null
	 */
	getJSON<T = any>(name: string): T | null {
		const value = this.get(name);
		if (!value) return null;

		try {
			return JSON.parse(value) as T;
		} catch (error) {
			console.warn(`Failed to parse cookie "${name}" as JSON:`, error);
			return null;
		}
	}

	/**
	 * Set a cookie with JSON value
	 * @param name Cookie name
	 * @param value Object to stringify
	 * @param options Cookie options
	 */
	setJSON(name: string, value: any, options: CookieOptions = {}): void {
		try {
			this.set(name, JSON.stringify(value), options);
		} catch (error) {
			console.error(`Failed to stringify value for cookie "${name}":`, error);
		}
	}

	/**
	 * Remove a cookie
	 * @param name Cookie name
	 * @param options Path and domain should match the cookie being removed
	 */
	remove(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
		this.set(name, '', {
			...options,
			expires: new Date(0)
		});
	}

	/**
	 * Check if a cookie exists
	 * @param name Cookie name
	 * @returns True if cookie exists
	 */
	exists(name: string): boolean {
		return this.get(name) !== null;
	}

	/**
	 * Get all cookies as an object
	 * @returns Object with cookie names as keys
	 */
	getAll(): Record<string, string> {
		if (!browser) return {};

		const cookies: Record<string, string> = {};
		const cookieArray = document.cookie.split(';');

		for (let cookie of cookieArray) {
			cookie = cookie.trim();
			if (cookie) {
				const [name, value] = cookie.split('=');
				if (name && value) {
					cookies[decodeURIComponent(name)] = decodeURIComponent(value);
				}
			}
		}

		return cookies;
	}

	/**
	 * Clear all cookies (only those accessible from current path/domain)
	 * @param options Options for removal (path, domain)
	 */
	clearAll(options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
		const cookies = this.getAll();
		for (const name in cookies) {
			this.remove(name, options);
		}
	}

	/**
	 * Get cookie with automatic type inference for known cookie names
	 */
	getTyped<T extends keyof CookieTypes>(name: T): CookieTypes[T] | null {
		const value = this.get(name);
		if (!value) return null;

		// Handle special cases for typed cookies
		switch (name) {
			case 'user_preferences':
			case 'auth_user':
				return this.getJSON(name);
			case 'theme':
			case 'language':
			case 'auth_token':
			default:
				return value as CookieTypes[T];
		}
	}

	/**
	 * Set cookie with automatic type handling for known cookie names
	 */
	setTyped<T extends keyof CookieTypes>(
		name: T,
		value: CookieTypes[T],
		options: CookieOptions = {}
	): void {
		// Set default options for specific cookie types
		const defaultOptions: Record<string, CookieOptions> = {
			auth_token: {
				secure: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			},
			auth_user: {
				maxAge: 60 * 60 * 24 * 7, // 7 days - same as auth_token
				sameSite: 'lax',
				secure: false // Allow HTTP for development
			},
			user_preferences: {
				maxAge: 60 * 60 * 24 * 365, // 1 year
				sameSite: 'lax'
			},
			theme: {
				maxAge: 60 * 60 * 24 * 365, // 1 year
				sameSite: 'lax'
			},
			language: {
				maxAge: 60 * 60 * 24 * 365, // 1 year
				sameSite: 'lax'
			}
		};

		const finalOptions = { ...defaultOptions[name as string], ...options };

		if (typeof value === 'object') {
			this.setJSON(name, value, finalOptions);
		} else {
			this.set(name, String(value), finalOptions);
		}
	}
}

// Define types for known cookies in your application
export interface CookieTypes {
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

// Create singleton instance
export const cookies = new CookieManager();

// Export individual functions for convenience
export const {
	get: getCookie,
	set: setCookie,
	remove: removeCookie,
	exists: cookieExists,
	getAll: getAllCookies,
	clearAll: clearAllCookies,
	getJSON: getCookieJSON,
	setJSON: setCookieJSON,
	getTyped: getTypedCookie,
	setTyped: setTypedCookie
} = cookies;
