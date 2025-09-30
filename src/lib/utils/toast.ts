import { toastStore } from '$lib/stores/toast';

// Global toast utility functions
export const toast = {
	/**
	 * Show a success toast
	 * @param message - Message to display
	 * @param options - Optional configuration
	 */
	success: (message: string, options?: { duration?: number; dismissible?: boolean }) => {
		return toastStore.success(message, options);
	},

	/**
	 * Show an error toast
	 * @param message - Message to display
	 * @param options - Optional configuration
	 */
	error: (message: string, options?: { duration?: number; dismissible?: boolean }) => {
		return toastStore.error(message, options);
	},

	/**
	 * Show a warning toast
	 * @param message - Message to display
	 * @param options - Optional configuration
	 */
	warning: (message: string, options?: { duration?: number; dismissible?: boolean }) => {
		return toastStore.warning(message, options);
	},

	/**
	 * Show an info toast
	 * @param message - Message to display
	 * @param options - Optional configuration
	 */
	info: (message: string, options?: { duration?: number; dismissible?: boolean }) => {
		return toastStore.info(message, options);
	},

	/**
	 * Remove a specific toast by ID
	 * @param id - Toast ID to remove
	 */
	remove: (id: string) => {
		return toastStore.removeToast(id);
	},

	/**
	 * Clear all toasts
	 */
	clear: () => {
		return toastStore.clearAll();
	}
};

// Type for the toast utility
export type ToastUtility = {
	success: (message: string, options?: { duration?: number; dismissible?: boolean }) => string;
	error: (message: string, options?: { duration?: number; dismissible?: boolean }) => string;
	warning: (message: string, options?: { duration?: number; dismissible?: boolean }) => string;
	info: (message: string, options?: { duration?: number; dismissible?: boolean }) => string;
	remove: (id: string) => void;
	clear: () => void;
};

// Make it available globally (optional)
if (typeof globalThis !== 'undefined') {
	globalThis.toast = toast;
}

// Type declaration for global usage (optional)
declare global {
	var toast: ToastUtility;
}
