<!-- Auto-generated List Page for Role -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_NAME_COMPANY } from '$env/static/public';
	import { goto } from '$app/navigation';
	import { roleService } from '$lib/services/roles/roleService';
	import type { Role, RoleSearchParams } from '$lib/types/role';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { confirmation } from '$lib/stores/confirmation';
	import type { Column, PaginationInfo, SortDirection } from '$lib/types/datatable';

	let roles: Role[] = [];
	let pagination: PaginationInfo = {
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0
	};
	let loading = false;
	let error = '';
	let searchTerm = '';
	let sortKey: string | undefined = undefined;
	let sortDirection: SortDirection | undefined = undefined;

	// Configuración de columnas para el DataTable
	const columns: Column<Role>[] = [
		{
			key: 'name',
			title: 'Nombre',
			sortable: true,
			render: (_, item) => `
				<div class="flex items-center">
					<div class="flex-shrink-0 h-10 w-10">
						<div class="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-inverse font-medium">
							${item.name.charAt(0).toUpperCase()}
						</div>
					</div>
					<div class="ml-4">
						<div class="text-sm font-medium text-primary">${item.name}</div>
					</div>
				</div>
			`
		},
		{
			key: 'description',
			title: 'Descripción',
			sortable: true,
			render: (value) => {
				const desc = value as string;
				if (!desc) return '<span class="text-tertiary">-</span>';
				// Truncar si es muy largo
				const truncated = desc.length > 80 ? desc.substring(0, 80) + '...' : desc;
				return `<span class="text-secondary" title="${desc}">${truncated}</span>`;
			}
		},
		{
			key: 'status',
			title: 'Estado',
			sortable: true,
			render: (_, item) => {
				const statusClass = getStatusBadgeClass(item.status);
				const statusText = getStatusText(item.status);
				return `<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass}">${statusText}</span>`;
			}
		},
	];

	async function loadRoles(
		page: number = 1,
		limit: number = 10,
		search: string = '',
		sortBy?: string,
		sortDir?: SortDirection
	) {
		loading = true;
		error = '';

		try {
			const params: RoleSearchParams = {
				page,
				limit,
				search: search || undefined,
				sort_by: sortBy || undefined,
				sort_direction: sortDir || 'asc'
			};

			const response = await roleService.getAll(params);
			roles = response.data;
			pagination = {
				page: response.pagination.current_page,
				limit: response.pagination.limit,
				total: response.pagination.total,
				totalPages: response.pagination.total_pages
			};
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al cargar roles';
			console.error('Error loading roles:', err);
		} finally {
			loading = false;
		}
	}

	async function deleteRole(id: string, name: string) {
		const confirmed = await confirmation.danger(
			`¿Estás seguro de que quieres eliminar "${name}"? Esta acción no se puede deshacer.`,
			'Eliminar Role'
		);

		if (!confirmed) return;

		try {
			await roleService.delete(id);
			await loadRoles(pagination.page, pagination.limit, searchTerm, sortKey, sortDirection);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al eliminar role';
		}
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'short',
			day: '2-digit'
		});
	}

	function getStatusBadgeClass(status: string): string {
		switch (status.toUpperCase()) {
			case 'ACTIVE':
				return 'badge-status-active';
			case 'INACTIVE':
				return 'badge-status-inactive';
			case 'SUSPENDED':
				return 'badge-status-suspended';
			default:
				return 'badge-status-default';
		}
	}

	function getStatusText(status: string): string {
		switch (status.toUpperCase()) {
			case 'ACTIVE':
				return 'Activo';
			case 'INACTIVE':
				return 'Inactivo';
			case 'SUSPENDED':
				return 'Suspendido';
			default:
				return status;
		}
	}

	function handleSearch(event: CustomEvent<{ search: string }>) {
		searchTerm = event.detail.search;
		loadRoles(1, pagination.limit, searchTerm, sortKey, sortDirection);
	}

	function handlePageChange(event: CustomEvent<{ page: number }>) {
		loadRoles(event.detail.page, pagination.limit, searchTerm, sortKey, sortDirection);
	}

	function handleLimitChange(event: CustomEvent<{ limit: number }>) {
		loadRoles(1, event.detail.limit, searchTerm, sortKey, sortDirection);
	}

	function handleSort(event: CustomEvent<{ key: string; direction: SortDirection }>) {
		sortKey = event.detail.key;
		sortDirection = event.detail.direction;
		loadRoles(pagination.page, pagination.limit, searchTerm, sortKey, sortDirection);
	}

	onMount(() => {
		loadRoles();
	});
</script>

<svelte:head>
  <title>Roles - {PUBLIC_NAME_COMPANY}</title>
</svelte:head>

<div class="p-6">
	<div class="mb-6">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-2xl font-bold text-primary">Roles</h1>
				<p class="text-secondary">Gestiona los roles del sistema</p>
			</div>
			<Button
				on:click={() => goto('/roles/create')}
				variant="primary"
				size="md"
				className="flex items-center gap-2"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"
					></path>
				</svg>
				Nuevo Role
			</Button>
		</div>
	</div>

  {#if error}
    <div class="error-container px-4 py-3 rounded mb-4 border">
      {error}
    </div>
  {/if}

  <DataTable
		columns={columns as unknown as Column<Record<string, unknown>>[]}
		data={ roles as unknown as Record<string, unknown>[]}
		{loading}
		{pagination}
		{sortKey}
		{sortDirection}
		searchPlaceholder="Buscar roles... (presiona Enter)"
		emptyMessage="No se encontraron roles. Comienza creando un nuevo role."
		on:search={handleSearch}
		on:page-change={handlePageChange}
		on:limit-change={handleLimitChange}
		on:sort={handleSort}
	>
		<svelte:fragment slot="actions" let:item>
			<div class="flex justify-end space-x-1">
				<button
					on:click={() => goto(`/roles/${(item as unknown as Role).id}`)}
					class="btn-icon btn-icon-neutral"
					title="Ver detalles"
					aria-label="Ver detalles del role"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						></path>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						></path>
					</svg>
				</button>
				<button
					on:click={() => goto(`/roles/${(item as unknown as Role).id}/edit`)}
					class="btn-icon btn-icon-primary"
					title="Editar"
					aria-label="Editar role"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						></path>
					</svg>
				</button>
				<button
					on:click={() => deleteRole((item as unknown as Role).id, (item as unknown as Role).name)}
					class="btn-icon btn-icon-danger"
					title="Eliminar"
					aria-label="Eliminar role"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						></path>
					</svg>
				</button>
			</div>
		</svelte:fragment>
	</DataTable>
</div>
