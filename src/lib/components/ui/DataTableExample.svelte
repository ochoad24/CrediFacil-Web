<script lang="ts">
	import DataTable from './DataTable.svelte';
	import Button from './Button.svelte';
	import type { Column, PaginationInfo } from '$lib/types/datatable';

	// Example data type
	interface User extends Record<string, unknown> {
		id: number;
		name: string;
		email: string;
		role: string;
		status: 'active' | 'inactive';
		createdAt: string;
	}

	// Example data
	let users: User[] = [
		{
			id: 1,
			name: 'Juan Pérez',
			email: 'juan@example.com',
			role: 'Admin',
			status: 'active',
			createdAt: '2024-01-15'
		},
		{
			id: 2,
			name: 'María García',
			email: 'maria@example.com',
			role: 'User',
			status: 'active',
			createdAt: '2024-02-20'
		},
		{
			id: 3,
			name: 'Carlos López',
			email: 'carlos@example.com',
			role: 'User',
			status: 'inactive',
			createdAt: '2024-03-10'
		}
	];

	// Column configuration
	const columns: Column<User>[] = [
		{
			key: 'name',
			title: 'Nombre',
			sortable: true
		},
		{
			key: 'email',
			title: 'Correo Electrónico',
			sortable: true
		},
		{
			key: 'role',
			title: 'Rol',
			sortable: true
		},
		{
			key: 'status',
			title: 'Estado',
			sortable: true,
			render: (value) => {
				const status = value as 'active' | 'inactive';
				const statusColor =
					status === 'active'
						? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
						: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
				const statusText = status === 'active' ? 'Activo' : 'Inactivo';
				return `<span class="px-2 py-1 text-xs font-medium rounded-full ${statusColor}">${statusText}</span>`;
			}
		},
		{
			key: 'createdAt',
			title: 'Fecha de Creación',
			sortable: true
		}
	];

	// Pagination state
	let pagination: PaginationInfo = {
		page: 1,
		limit: 10,
		total: users.length,
		totalPages: Math.ceil(users.length / 10)
	};

	// State
	let loading = false;
	let sortKey = '';
	let sortDirection: 'asc' | 'desc' = 'asc';

	// Handlers
	function handleSearch(event: CustomEvent<{ search: string }>) {
		console.log('Search:', event.detail.search);
		// Implement search logic here
	}

	function handlePageChange(event: CustomEvent<{ page: number }>) {
		pagination.page = event.detail.page;
		console.log('Page change:', event.detail.page);
		// Implement page change logic here
	}

	function handleLimitChange(event: CustomEvent<{ limit: number }>) {
		pagination.limit = event.detail.limit;
		pagination.totalPages = Math.ceil(pagination.total / pagination.limit);
		pagination.page = 1;
		console.log('Limit change:', event.detail.limit);
		// Implement limit change logic here
	}

	function handleSort(event: CustomEvent<{ key: string; direction: 'asc' | 'desc' }>) {
		sortKey = event.detail.key;
		sortDirection = event.detail.direction;
		console.log('Sort:', event.detail);
		// Implement sort logic here
	}

	function handleEdit(user: User) {
		console.log('Edit user:', user);
		// Implement edit logic here
	}

	function handleDelete(user: User) {
		console.log('Delete user:', user);
		// Implement delete logic here
	}
</script>

<div class="p-6">
	<h2 class="text-2xl font-bold text-foreground mb-6">Ejemplo de DataTable</h2>

	<DataTable
		data={users}
		{columns}
		{loading}
		{pagination}
		{sortKey}
		{sortDirection}
		searchPlaceholder="Buscar usuarios..."
		emptyMessage="No se encontraron usuarios"
		on:search={handleSearch}
		on:page-change={handlePageChange}
		on:limit-change={handleLimitChange}
		on:sort={handleSort}
	>
		<svelte:fragment slot="actions" let:item>
			<div class="flex items-center space-x-2">
				<Button
					variant="outline"
					size="sm"
					on:click={() => handleEdit(item as User)}
					className="text-primary-600 hover:text-primary-700"
				>
					Editar
				</Button>
				<Button
					variant="outline"
					size="sm"
					on:click={() => handleDelete(item as User)}
					className="text-red-600 hover:text-red-700"
				>
					Eliminar
				</Button>
			</div>
		</svelte:fragment>
	</DataTable>
</div>
