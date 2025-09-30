# Select Component - Guía de Uso

El componente Select mejorado soporta tanto búsqueda interna como externa con funcionalidades avanzadas.

## Características

- ✅ Búsqueda interna (filtrado local)
- ✅ Búsqueda externa (con API)
- ✅ Debounce automático
- ✅ Estados de carga
- ✅ Selección simple y múltiple
- ✅ Botón de limpiar
- ✅ Manejo de errores con toast
- ✅ Soporte para temas dark/light
- ✅ Accesibilidad completa

## Uso Básico

### Selección Simple (Búsqueda Interna)

```svelte
<script>
	import { Select, selectHelpers } from '$lib/components/ui';

	const countries = [
		{ value: 'mx', label: 'México' },
		{ value: 'us', label: 'Estados Unidos' },
		{ value: 'ca', label: 'Canadá' }
	];

	let selectedCountry = '';
</script>

<Select
	label="País"
	placeholder="Selecciona un país"
	searchable
	clearable
	items={countries}
	getValue={selectHelpers.simple.getValue}
	getLabel={selectHelpers.simple.getLabel}
	bind:value={selectedCountry}
/>
```

### Selección Múltiple

```svelte
<script>
	let selectedCountries = [];
</script>

<Select
	label="Países disponibles"
	placeholder="Selecciona varios países"
	multiple
	searchable
	clearable
	items={countries}
	getValue={selectHelpers.simple.getValue}
	getLabel={selectHelpers.simple.getLabel}
	bind:value={selectedCountries}
/>
```

## Búsqueda Externa

### Con RoleService (Ejemplo Completo)

```svelte
<script>
	import { Select, selectHelpers, createRoleSearchFunction } from '$lib/components/ui';
	import { roleService } from '$lib/services/roles/roleService';

	// Crear función de búsqueda externa para roles
	const roleSearchFunction = createRoleSearchFunction(roleService);

	let selectedRole = '';
</script>

<Select
	label="Buscar Roles"
	placeholder="Escribe para buscar roles..."
	searchable
	clearable
	externalSearch={roleSearchFunction}
	getValue={selectHelpers.role.getValue}
	getLabel={selectHelpers.role.getLabel}
	getDisabled={selectHelpers.role.getDisabled}
	bind:value={selectedRole}
	minSearchLength={2}
	searchDebounceMs={300}
	on:change={(e) => console.log('Role seleccionado:', e.detail)}
/>
```

### Búsqueda Externa Personalizada

```svelte
<script>
	import { Select } from '$lib/components/ui';
	import { userService } from '$lib/services/users/userService';

	// Función de búsqueda personalizada
	async function searchUsers(query, params = {}) {
		try {
			const response = await userService.searchUsers(query, params);
			return {
				data: response.data,
				pagination: response.pagination
			};
		} catch (error) {
			throw error; // El componente manejará el error con toast
		}
	}

	let selectedUsers = [];
</script>

<Select
	label="Buscar Usuarios"
	placeholder="Busca usuarios por nombre o email..."
	multiple
	searchable
	clearable
	externalSearch={searchUsers}
	getValue={(user) => user.id}
	getLabel={(user) => `${user.firstName} ${user.lastName} (${user.email})`}
	getDisabled={(user) => !user.active}
	bind:value={selectedUsers}
	minSearchLength={3}
	searchDebounceMs={500}
	searchParams={{
		limit: 15,
		sortBy: 'firstName',
		sortDirection: 'asc'
	}}
	loadingText="Buscando usuarios..."
	emptyText="No se encontraron usuarios"
/>
```

## Props Disponibles

### Props Básicas

- `value`: Valor seleccionado (any)
- `multiple`: Permitir selección múltiple (boolean)
- `searchable`: Habilitar búsqueda (boolean)
- `clearable`: Mostrar botón de limpiar (boolean)
- `disabled`: Deshabilitar componente (boolean)
- `label`: Etiqueta del campo (string)
- `placeholder`: Texto de placeholder (string)
- `error`: Mensaje de error (string)
- `className`: Clases CSS adicionales (string)
- `size`: Tamaño del componente ('sm' | 'md' | 'lg')

### Props de Datos

- `items`: Array de elementos para búsqueda interna (SelectItem[])
- `getValue`: Función para obtener valor del item ((item) => any)
- `getLabel`: Función para obtener etiqueta del item ((item) => string)
- `getDisabled`: Función para verificar si item está deshabilitado ((item) => boolean)

### Props de Búsqueda Externa

- `externalSearch`: Función de búsqueda externa (Function)
- `searchDebounceMs`: Tiempo de debounce en milisegundos (number, default: 300)
- `minSearchLength`: Longitud mínima para búsqueda (number, default: 2)
- `searchParams`: Parámetros adicionales para búsqueda (object)
- `loadingText`: Texto durante carga (string, default: 'Buscando...')
- `emptyText`: Texto cuando no hay resultados (string, default: 'No hay resultados')

## Eventos

```svelte
<Select
  {/* props */}
  on:change={(e) => {
    // e.detail.value: valor seleccionado
    // e.detail.item: item(s) seleccionado(s)
  }}
  on:select={(e) => {
    // e.detail.item: item seleccionado
  }}
  on:deselect={(e) => {
    // e.detail.item: item deseleccionado (solo en múltiple)
  }}
  on:clear={() => {
    // Disparado cuando se limpia la selección
  }}
  on:search={(e) => {
    // e.detail.term: término de búsqueda
  }}
/>
```

## Helpers Incluidos

### selectHelpers

- `selectHelpers.simple`: Para objetos con `value` y `label`
- `selectHelpers.role`: Para objetos Role con `id` y `name`
- `selectHelpers.user`: Para objetos User con `id`, `firstName`, `lastName`, `email`

### createRoleSearchFunction

Función helper que crea automáticamente una función de búsqueda externa para el roleService:

```javascript
const roleSearchFunction = createRoleSearchFunction(roleService);
```

## Notas de Implementación

1. **Detección Automática**: Si se proporciona `externalSearch`, el componente automáticamente usa búsqueda externa
2. **Manejo de Errores**: Los errores de API se muestran automáticamente usando el sistema de toast
3. **Performance**: El debounce evita llamadas excesivas a la API
4. **Accesibilidad**: Incluye soporte completo para lectores de pantalla y navegación por teclado
5. **Estados de Carga**: Muestra spinners y mensajes apropiados durante las búsquedas
6. **Cleanup**: Se limpia automáticamente al destruir el componente
