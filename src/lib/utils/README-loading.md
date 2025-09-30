# Sistema de Loading Global

Este sistema proporciona un overlay de carga global que se puede usar desde cualquier página de la aplicación.

## Características

- **Overlay global**: Se muestra sobre toda la aplicación con un z-index alto
- **Mensajes personalizables**: Puedes cambiar el mensaje durante la operación
- **Bloqueo de interacción**: Previene que el usuario interactúe con la aplicación mientras carga
- **Fácil de usar**: Funciones utilitarias simples

## Uso Básico

### Importar las utilidades

```typescript
import { showLoading, hideLoading, updateLoadingMessage, withLoading } from '$lib/utils/loading';
```

### Opción 1: Control manual

```typescript
// Mostrar loading
showLoading('Guardando datos...');

try {
	// Tu operación async
	await saveData();

	// Opcionalmente cambiar el mensaje
	updateLoadingMessage('Datos guardados correctamente');
	await new Promise((resolve) => setTimeout(resolve, 1000)); // Pausa para mostrar mensaje
} finally {
	// Ocultar loading
	hideLoading();
}
```

### Opción 2: Uso con withLoading (Recomendado)

```typescript
try {
	await withLoading(
		async () => {
			// Tu operación async
			await saveData();
		},
		'Guardando datos...',
		'Datos guardados correctamente'
	);
} catch (error) {
	// Manejar errores
	console.error(error);
}
```

## Ejemplos de Uso

### En un formulario

```typescript
async function handleSubmit() {
	try {
		await withLoading(
			async () => {
				await api.createUser(formData);
				goto('/users');
			},
			'Creando usuario...',
			'Usuario creado exitosamente'
		);
	} catch (error) {
		// Mostrar error al usuario
		alert(error.message);
	}
}
```

### En una operación de eliminación

```typescript
async function deleteItem(id: string) {
	try {
		await withLoading(async () => {
			await api.deleteItem(id);
			// Actualizar lista local
			items = items.filter((item) => item.id !== id);
		}, 'Eliminando elemento...');
	} catch (error) {
		console.error('Error al eliminar:', error);
	}
}
```

### Para operaciones de carga de datos

```typescript
import { onMount } from 'svelte';

onMount(async () => {
	await withLoading(async () => {
		const data = await api.getData();
		processData(data);
	}, 'Cargando datos...');
});
```

## Uso Directo del Store (Avanzado)

Si necesitas más control, puedes usar el store directamente:

```typescript
import { loadingStore } from '$lib/stores/loading';

// Mostrar
loadingStore.show('Mensaje personalizado');

// Actualizar mensaje
loadingStore.updateMessage('Nuevo mensaje');

// Ocultar
loadingStore.hide();

// Escuchar cambios
$: console.log('Loading state:', $loadingStore);
```

## Notas Importantes

1. **Un solo loading a la vez**: El sistema está diseñado para mostrar un solo loading overlay global
2. **Manejo de errores**: Siempre usa try/catch para asegurar que el loading se oculte
3. **Mensajes de éxito**: Son opcionales, pero mejoran la UX
4. **Componente automático**: El `LoadingOverlay` ya está incluido en el layout principal

## Personalización

El componente `LoadingOverlay` se puede personalizar editando:

- `/src/lib/components/ui/LoadingOverlay.svelte`

## Compatibilidad

El componente mantiene compatibilidad con el uso directo via props:

```svelte
<LoadingOverlay isVisible={localLoading} message="Mensaje local" />
```
