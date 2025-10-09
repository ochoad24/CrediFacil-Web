// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Google reCAPTCHA v3 type definitions
	interface Window {
		grecaptcha: {
			execute: (siteKey: string, options: { action: string }) => Promise<string>;
			ready: (callback: () => void) => void;
		};
	}
}

export {};
