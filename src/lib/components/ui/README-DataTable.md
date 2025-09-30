# DataTable Component

Un componente de tabla de datos completo y reutilizable adaptado para SvelteKit desde React.

## Características

- ✅ **Búsqueda**: Barra de búsqueda con placeholder personalizable
- ✅ **Ordenamiento**: Columnas ordenables con indicadores visuales
- ✅ **Paginación**: Controles de paginación completos (móvil y desktop)
- ✅ **Responsive**: Diseño adaptativo para móviles y desktop
- ✅ **Acciones personalizadas**: Slot para botones de acción por fila
- ✅ **Estados de carga**: Indicador de loading y mensaje vacío
- ✅ **Temas**: Soporte completo para tema claro y oscuro
- ✅ **TypeScript**: Tipado completo con genéricos
- ✅ **Números de fila**: Numeración automática opcional
- ✅ **Límites configurables**: Selector de elementos por página

## Uso Básico

```svelte
<script lang="ts">
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import type { Column, PaginationInfo } from '$lib/types/datatable';

	// Definir el tipo de datos
	interface User extends Record<string, unknown> {
		id: number;
		name: string;
		email: string;
		status: 'active' | 'inactive';
	}

	// Datos
	let users: User[] = [
		{ id: 1, name: 'Juan Pérez', email: 'juan@example.com', status: 'active' },
		{ id: 2, name: 'María García', email: 'maria@example.com', status: 'inactive' }
	];

	// Configuración de columnas
	const columns: Column<User>[] = [
		{ key: 'name', title: 'Nombre', sortable: true },
		{ key: 'email', title: 'Email', sortable: true },
		{
			key: 'status',
			title: 'Estado',
			sortable: true,
			render: (value) => (value === 'active' ? 'Activo' : 'Inactivo')
		}
	];

	// Paginación
	let pagination: PaginationInfo = {
		page: 1,
		limit: 10,
		total: users.length,
		totalPages: Math.ceil(users.length / 10)
	};
</script>

<DataTable
	data={users}
	{columns}
	{pagination}
	on:search={(e) => console.log('Buscar:', e.detail.search)}
	on:page-change={(e) => console.log('Página:', e.detail.page)}
	on:sort={(e) => console.log('Ordenar:', e.detail)}
>
	<svelte:fragment slot="actions" let:item>
		<button on:click={() => editUser(item as User)}> Editar </button>
	</svelte:fragment>
</DataTable>
```

## Props

| Prop                | Tipo              | Defecto                      | Descripción                       |
| ------------------- | ----------------- | ---------------------------- | --------------------------------- |
| `data`              | `T[]`             | `[]`                         | Array de datos a mostrar          |
| `columns`           | `Column<T>[]`     | `[]`                         | Configuración de columnas         |
| `loading`           | `boolean`         | `false`                      | Estado de carga                   |
| `searchable`        | `boolean`         | `true`                       | Mostrar barra de búsqueda         |
| `searchPlaceholder` | `string`          | `'Buscar...'`                | Placeholder del input de búsqueda |
| `pagination`        | `PaginationInfo`  | `undefined`                  | Configuración de paginación       |
| `limitOptions`      | `number[]`        | `[5,10,25,50,100]`           | Opciones de elementos por página  |
| `sortKey`           | `string`          | `undefined`                  | Columna ordenada actualmente      |
| `sortDirection`     | `'asc' \| 'desc'` | `undefined`                  | Dirección del ordenamiento        |
| `emptyMessage`      | `string`          | `'No hay datos disponibles'` | Mensaje cuando no hay datos       |
| `className`         | `string`          | `''`                         | Clases CSS adicionales            |
| `showRowNumbers`    | `boolean`         | `true`                       | Mostrar números de fila           |

## Eventos

| Evento         | Payload                                   | Descripción                                |
| -------------- | ----------------------------------------- | ------------------------------------------ |
| `search`       | `{search: string}`                        | Se dispara al buscar                       |
| `page-change`  | `{page: number}`                          | Se dispara al cambiar página               |
| `limit-change` | `{limit: number}`                         | Se dispara al cambiar elementos por página |
| `sort`         | `{key: string, direction: 'asc'\|'desc'}` | Se dispara al ordenar columnas             |

## Tipos

### Column<T>

```typescript
interface Column<T> {
	key: string; // Clave del campo en los datos
	title: string; // Título mostrado en el header
	sortable?: boolean; // Si la columna es ordenable
	render?: (value: unknown, item: T) => string; // Función personalizada de renderizado
	className?: string; // Clases CSS adicionales
}
```

### PaginationInfo

```typescript
interface PaginationInfo {
	page: number; // Página actual
	limit: number; // Elementos por página
	total: number; // Total de elementos
	totalPages: number; // Total de páginas
}
```

## Slots

### actions

Slot para renderizar botones de acción por fila:

```svelte
<svelte:fragment slot="actions" let:item let:index>
  <div class="flex gap-2">
    <Button on:click={() => edit(item)}>Editar</Button>
    <Button on:click={() => delete(item)}>Eliminar</Button>
  </div>
</svelte:fragment>
```

## Render Personalizado

Puedes personalizar cómo se muestra el contenido de una columna:

```typescript
const columns: Column<User>[] = [
  {
    key: 'status',
    title: 'Estado',
    render: (value) => {
      const status = value as 'active' | 'inactive';
      const colorClass = status === 'active'
        ? 'bg-green-100 text-green-800'
        : 'bg-red-100 text-red-800';
      return \`<span class="px-2 py-1 rounded-full text-xs \${colorClass}">\${status === 'active' ? 'Activo' : 'Inactivo'}</span>\`;
    }
  }
];
```

## Ejemplo Completo

Ver `DataTableExample.svelte` para un ejemplo completo con todas las funcionalidades.
