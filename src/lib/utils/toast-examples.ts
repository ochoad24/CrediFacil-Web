// Ejemplos de uso del sistema de toast
import { toast } from '$lib/utils/toast';

// Ejemplos de diferentes tipos de toast
export function showExampleToasts() {
	// Toast de éxito
	toast.success('¡Operación completada exitosamente!');

	// Toast de error con texto largo (se mostrará por más tiempo automáticamente)
	toast.error(
		'Ha ocurrido un error inesperado al procesar la solicitud. Por favor, verifica los datos e intenta nuevamente.'
	);

	// Toast de advertencia con duración personalizada
	toast.warning('Esta acción no se puede deshacer', { duration: 5000 });

	// Toast de información que no se puede cerrar manualmente
	toast.info('Procesando información...', { dismissible: false });

	// Toast con duración infinita (debe cerrarse manualmente)
	toast.error('Error crítico del sistema', { duration: 0 });
}

// Ejemplos de uso en diferentes contextos
export function handleFormSubmit() {
	try {
		// Simular envío de formulario
		toast.success('Formulario enviado correctamente');
	} catch (error) {
		toast.error('Error al enviar el formulario: ' + (error as Error).message);
	}
}

export function handleApiCall() {
	toast.info('Cargando datos...');

	// Simular llamada a API
	setTimeout(() => {
		toast.success('Datos cargados exitosamente');
	}, 2000);
}
