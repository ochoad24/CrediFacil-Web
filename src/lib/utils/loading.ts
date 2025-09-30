import { loadingStore } from '$lib/stores/loading';

/**
 * Utilities para manejar el loading overlay global de manera más conveniente
 */

/**
 * Muestra el loading overlay con un mensaje personalizado
 */
export function showLoading(message: string = 'Cargando...') {
	loadingStore.show(message);
}

/**
 * Oculta el loading overlay
 */
export function hideLoading() {
	loadingStore.hide();
}

/**
 * Actualiza el mensaje del loading overlay sin cambiar la visibilidad
 */
export function updateLoadingMessage(message: string) {
	loadingStore.updateMessage(message);
}

/**
 * Ejecuta una función async mostrando el loading overlay
 * @param asyncFn - Función async a ejecutar
 * @param message - Mensaje a mostrar durante la carga
 * @param successMessage - Mensaje opcional a mostrar al completarse exitosamente
 * @returns Promise que resuelve con el resultado de la función
 */
export async function withLoading<T>(
	asyncFn: () => Promise<T>,
	message: string = 'Cargando...',
	successMessage?: string
): Promise<T> {
	try {
		showLoading(message);
		const result = await asyncFn();

		if (successMessage) {
			updateLoadingMessage(successMessage);
			// Pequeña pausa para mostrar el mensaje de éxito
			await new Promise((resolve) => setTimeout(resolve, 500));
		}

		return result;
	} finally {
		hideLoading();
	}
}
