import { writable } from 'svelte/store';

export type ConfirmationType = 'warning' | 'danger' | 'info' | 'success';

export interface ConfirmationOptions {
	title?: string;
	message?: string;
	type?: ConfirmationType;
	confirmText?: string;
	cancelText?: string;
}

interface ConfirmationState {
	isOpen: boolean;
	title: string;
	message: string;
	type: ConfirmationType;
	confirmText: string;
	cancelText: string;
	loading: boolean;
	onConfirm?: () => void | Promise<void>;
	onCancel?: () => void;
}

const defaultState: ConfirmationState = {
	isOpen: false,
	title: 'Confirmar acción',
	message: '¿Estás seguro de que quieres continuar?',
	type: 'warning',
	confirmText: 'Confirmar',
	cancelText: 'Cancelar',
	loading: false
};

function createConfirmationStore() {
	const { subscribe, set, update } = writable<ConfirmationState>(defaultState);

	return {
		subscribe,

		/**
		 * Shows a confirmation dialog
		 * @param options - Configuration options for the dialog
		 * @returns Promise that resolves to true if confirmed, false if cancelled
		 */
		confirm: (options: ConfirmationOptions = {}): Promise<boolean> => {
			return new Promise((resolve) => {
				update(state => ({
					...state,
					isOpen: true,
					title: options.title || 'Confirmar acción',
					message: options.message || '¿Estás seguro de que quieres continuar?',
					type: options.type || 'warning',
					confirmText: options.confirmText || 'Confirmar',
					cancelText: options.cancelText || 'Cancelar',
					loading: false,
					onConfirm: async () => {
						resolve(true);
						confirmationStore.close();
					},
					onCancel: () => {
						resolve(false);
						confirmationStore.close();
					}
				}));
			});
		},

		/**
		 * Shows a confirmation dialog with custom handlers
		 * @param options - Configuration options for the dialog
		 * @param onConfirm - Custom confirm handler
		 * @param onCancel - Optional custom cancel handler
		 */
		show: (
			options: ConfirmationOptions = {},
			onConfirm: () => void | Promise<void>,
			onCancel?: () => void
		) => {
			update(state => ({
				...state,
				isOpen: true,
				title: options.title || 'Confirmar acción',
				message: options.message || '¿Estás seguro de que quieres continuar?',
				type: options.type || 'warning',
				confirmText: options.confirmText || 'Confirmar',
				cancelText: options.cancelText || 'Cancelar',
				loading: false,
				onConfirm,
				onCancel
			}));
		},

		/**
		 * Sets the loading state
		 */
		setLoading: (loading: boolean) => {
			update(state => ({ ...state, loading }));
		},

		/**
		 * Closes the dialog
		 */
		close: () => {
			set(defaultState);
		},

		/**
		 * Handles the confirm action
		 */
		handleConfirm: async () => {
			update(state => ({ ...state, loading: true }));

			const currentState = get(confirmationStore);
			if (currentState.onConfirm) {
				try {
					await currentState.onConfirm();
				} catch (error) {
					console.error('Error in confirmation handler:', error);
					update(state => ({ ...state, loading: false }));
				}
			}
		},

		/**
		 * Handles the cancel action
		 */
		handleCancel: () => {
			const currentState = get(confirmationStore);
			if (currentState.onCancel) {
				currentState.onCancel();
			}
			confirmationStore.close();
		}
	};
}

// Helper function to get current store value
function get<T>(store: { subscribe: (fn: (value: T) => void) => () => void }): T {
	let value: T;
	const unsubscribe = store.subscribe(v => value = v);
	unsubscribe();
	return value!;
}

export const confirmationStore = createConfirmationStore();

// Convenience functions for common confirmation types
export const confirmation = {
	/**
	 * Shows a warning confirmation dialog
	 */
	warning: (message: string, title = 'Advertencia'): Promise<boolean> => {
		return confirmationStore.confirm({
			title,
			message,
			type: 'warning',
			confirmText: 'Continuar',
			cancelText: 'Cancelar'
		});
	},

	/**
	 * Shows a danger confirmation dialog
	 */
	danger: (message: string, title = 'Acción peligrosa'): Promise<boolean> => {
		return confirmationStore.confirm({
			title,
			message,
			type: 'danger',
			confirmText: 'Eliminar',
			cancelText: 'Cancelar'
		});
	},

	/**
	 * Shows an info confirmation dialog
	 */
	info: (message: string, title = 'Información'): Promise<boolean> => {
		return confirmationStore.confirm({
			title,
			message,
			type: 'info',
			confirmText: 'Aceptar',
			cancelText: 'Cancelar'
		});
	},

	/**
	 * Shows a success confirmation dialog
	 */
	success: (message: string, title = 'Éxito'): Promise<boolean> => {
		return confirmationStore.confirm({
			title,
			message,
			type: 'success',
			confirmText: 'Continuar',
			cancelText: 'Cerrar'
		});
	}
};