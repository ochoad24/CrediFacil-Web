import { writable } from 'svelte/store';

export interface Toast {
	id: string;
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
	duration?: number; // Auto-calculated based on message length and type if not provided
	dismissible?: boolean;
}

export interface ToastStore {
	toasts: Toast[];
}

function createToastStore() {
	const { subscribe, update } = writable<ToastStore>({ toasts: [] });

	function calculateDuration(message: string, type?: Toast['type']): number {
		// Word count for better reading time calculation
		const words = message.trim().split(/\s+/).length;

		// Average reading speed: 200 words per minute (3.33 words per second)
		// Add buffer time for processing and reaction
		const readingTime = (words / 3.33) * 1000; // Convert to milliseconds

		// Base duration varies by message type (errors need more time)
		const baseDuration = type === 'error' ? 4000 : type === 'warning' ? 3500 : 3000;

		// Character-based calculation as fallback for very short/long texts
		const charBasedDuration = message.length * 60; // 60ms per character

		// Use the longer of reading time or character-based time
		let calculatedDuration = Math.max(readingTime, charBasedDuration);

		// Add base duration for minimum visibility
		calculatedDuration += baseDuration;

		// Reasonable bounds: 2.5 seconds minimum, 12 seconds maximum
		return Math.min(Math.max(calculatedDuration, 2500), 12000);
	}

	function addToast(toast: Omit<Toast, 'id' | 'duration'> & { duration?: number }) {
		const id = crypto.randomUUID();
		const duration = toast.duration ?? calculateDuration(toast.message, toast.type);

		const newToast: Toast = {
			...toast,
			id,
			duration,
			dismissible: toast.dismissible ?? true
		};

		update((store) => ({
			toasts: [...store.toasts, newToast]
		}));

		// Auto-remove toast after duration
		if (duration > 0) {
			setTimeout(() => {
				removeToast(id);
			}, duration);
		}

		return id;
	}

	function removeToast(id: string) {
		update((store) => ({
			toasts: store.toasts.filter((toast) => toast.id !== id)
		}));
	}

	function clearAll() {
		update(() => ({ toasts: [] }));
	}

	return {
		subscribe,
		addToast,
		removeToast,
		clearAll,
		// Utility to preview calculated duration (useful for debugging)
		calculateDuration: (message: string, type?: Toast['type']) => calculateDuration(message, type),
		// Utility methods for common toast types
		success: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) =>
			addToast({ message, type: 'success', ...options }),
		error: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) =>
			addToast({ message, type: 'error', ...options }),
		warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) =>
			addToast({ message, type: 'warning', ...options }),
		info: (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) =>
			addToast({ message, type: 'info', ...options })
	};
}

export const toastStore = createToastStore();
