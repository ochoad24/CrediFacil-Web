import { writable } from 'svelte/store';

interface LoadingState {
	isVisible: boolean;
	message: string;
}

const initialState: LoadingState = {
	isVisible: false,
	message: 'Cargando...'
};

function createLoadingStore() {
	const { subscribe, set, update } = writable<LoadingState>(initialState);

	return {
		subscribe,

		// Mostrar loading overlay
		show: (message: string = 'Cargando...') => {
			set({
				isVisible: true,
				message
			});
		},

		// Ocultar loading overlay
		hide: () => {
			set(initialState);
		},

		// Actualizar solo el mensaje sin cambiar la visibilidad
		updateMessage: (message: string) => {
			update((state) => ({ ...state, message }));
		}
	};
}

export const loadingStore = createLoadingStore();
