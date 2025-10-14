<!-- Auto-generated List Page for Company -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_NAME_COMPANY } from '$env/static/public';
	import { companyService } from '$lib/services/companies/companyService';
	import type { Company, CompanySearchParams } from '$lib/types/company';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { confirmation } from '$lib/stores/confirmation';
	import type { Column, PaginationInfo, SortDirection } from '$lib/types/datatable';
	import { authStore } from '$lib/stores/auth.svelte';
	import PermissionGuard from '$lib/components/PermissionGuard.svelte';

	let companies: Company[] = [];
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
	const columns: Column<Company>[] = [
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
			key: 'legal_name',
			title: 'Nombre legal',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
		{
			key: 'tax_id',
			title: 'Identificación fiscal',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
		{
			key: 'address',
			title: 'DIRECCIÓN',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
		{
			key: 'phone',
			title: 'Teléfono',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
		{
			key: 'email',
			title: 'Correo electrónico',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
		{
			key: 'website',
			title: 'Sitio web',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
		{
			key: 'is_active',
			title: 'Está activo',
			sortable: true,
			render: (_, item) => {
				const isActiveClass = item.is_active
					? 'badge-status-active'
					: 'badge-status-inactive';
				const isActiveText = item.is_active ? 'Sí' : 'No';
				return `<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${isActiveClass}">${isActiveText}</span>`;
			}
		},
		{
			key: 'established_date',
			title: 'Fecha de establecimiento',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
		{
			key: 'notes',
			title: 'Notas',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
		{
			key: 'document_type_code',
			title: 'Código de tipo de documento',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
		{
			key: 'document_type',
			title: 'Tipo de documento',
			sortable: false,
			render: (_, item) => {
				const relation = item.document_type as any;
				if (!relation) return '<span class="text-tertiary">-</span>';
				// Try common display fields in order of preference
				const displayValue = relation.name || relation.title || relation.label || relation.code || relation.id || '-';
				return `<span class="text-secondary">${displayValue}</span>`;
			}
		},
		{
			key: 'document_number',
			title: 'Número de documento',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
		{
			key: 'created_by',
			title: 'Creado por',
			sortable: false,
			render: (_, item) => {
				const relation = item.created_by as any;
				if (!relation) return '<span class="text-tertiary">-</span>';
				// Try common display fields in order of preference
				const displayValue = relation.name || relation.title || relation.label || relation.code || relation.id || '-';
				return `<span class="text-secondary">${displayValue}</span>`;
			}
		},
		{
			key: 'updated_by',
			title: 'Actualizado por',
			sortable: false,
			render: (_, item) => {
				const relation = item.updated_by as any;
				if (!relation) return '<span class="text-tertiary">-</span>';
				// Try common display fields in order of preference
				const displayValue = relation.name || relation.title || relation.label || relation.code || relation.id || '-';
				return `<span class="text-secondary">${displayValue}</span>`;
			}
		},
	];

	async function loadCompanies(
		page: number = 1,
		limit: number = 10,
		search: string = '',
		sortBy?: string,
		sortDir?: SortDirection
	) {
		loading = true;
		error = '';

		try {
			const params: CompanySearchParams = {
				page,
				limit,
				search: search || undefined,
				sort_by: sortBy || undefined,
				sort_direction: sortDir || 'asc'
			};

			const response = await companyService.getAll(params);
			// Asegurar que siempre sea un array, incluso si la respuesta es null/undefined
			companies = Array.isArray(response.data) ? response.data : [];
			pagination = {
				page: response.pagination.current_page || page,
				limit: response.pagination.limit || limit,
				total: response.pagination.total || 0,
				totalPages: response.pagination.total_pages || 0
			};
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al cargar compañías';
			console.error('Error loading companies:', err);
			// En caso de error, asegurar que el array esté vacío
			companies = [];
		} finally {
			loading = false;
		}
	}

	async function deleteCompany(id: string, name: string) {
		const confirmed = await confirmation.danger(
			`¿Estás seguro de que quieres eliminar "${name}"? Esta acción no se puede deshacer.`,
			'Eliminar Compañía'
		);

		if (!confirmed) return;

		try {
			await companyService.delete(id);
			await loadCompanies(pagination.page, pagination.limit, searchTerm, sortKey, sortDirection);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al eliminar compañía';
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
		loadCompanies(1, pagination.limit, searchTerm, sortKey, sortDirection);
	}

	function handlePageChange(event: CustomEvent<{ page: number }>) {
		loadCompanies(event.detail.page, pagination.limit, searchTerm, sortKey, sortDirection);
	}

	function handleLimitChange(event: CustomEvent<{ limit: number }>) {
		loadCompanies(1, event.detail.limit, searchTerm, sortKey, sortDirection);
	}

	function handleSort(event: CustomEvent<{ key: string; direction: SortDirection }>) {
		sortKey = event.detail.key;
		sortDirection = event.detail.direction;
		loadCompanies(pagination.page, pagination.limit, searchTerm, sortKey, sortDirection);
	}

	onMount(() => {
		loadCompanies();
	});
</script>

<svelte:head>
  <title>Compañías - {PUBLIC_NAME_COMPANY}</title>
</svelte:head>

<div class="p-4 sm:p-6">
	<div class="mb-6">
		<!-- Header responsive: stack en móvil, horizontal en desktop -->
		<!-- Agregamos pr-16 en móvil para dar espacio al botón hamburger del sidebar -->
		<div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 lg:pr-0 pr-16">
			<div class="min-w-0 flex-1">
				<h1 class="text-xl sm:text-2xl font-bold text-primary">Compañías</h1>
				<p class="text-sm sm:text-base text-secondary">Gestiona los compañías del sistema</p>
			</div>
			<PermissionGuard permission="companies.create">
				<Button
					on:click={() => goto('/companies/create')}
					variant="primary"
					size="md"
					className="flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
				>
					<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"
						></path>
					</svg>
					<span>Nuevo Compañía</span>
				</Button>
			</PermissionGuard>
		</div>
	</div>

  {#if error}
    <div class="error-container px-4 py-3 rounded mb-4 border">
      {error}
    </div>
  {/if}

  <DataTable
		columns={columns as unknown as Column<Record<string, unknown>>[]}
		data={ companies as unknown as Record<string, unknown>[]}
		{loading}
		{pagination}
		{sortKey}
		{sortDirection}
		searchPlaceholder="Buscar compañías... (presiona Enter)"
		emptyMessage="No se encontraron compañías. Comienza creando un nuevo compañía."
		on:search={handleSearch}
		on:page-change={handlePageChange}
		on:limit-change={handleLimitChange}
		on:sort={handleSort}
	>
		<svelte:fragment slot="actions" let:item>
			<div class="flex justify-end space-x-1">
				<button
					on:click={() => goto(`/companies/${(item as unknown as Company).id}`)}
					class="btn-icon btn-icon-neutral"
					title="Ver detalles"
					aria-label="Ver detalles del compañía"
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
				{#if authStore.hasPermission('companies.update')}
					<button
						on:click={() => goto(`/companies/${(item as unknown as Company).id}/edit`)}
						class="btn-icon btn-icon-primary"
						title="Editar"
						aria-label="Editar compañía"
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
				{/if}
				{#if authStore.hasPermission('companies.delete')}
					<button
						on:click={() => deleteCompany((item as unknown as Company).id, (item as unknown as Company).name)}
						class="btn-icon btn-icon-danger"
						title="Eliminar"
						aria-label="Eliminar compañía"
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
				{/if}
			</div>
		</svelte:fragment>
	</DataTable>
</div>
