<!-- Auto-generated List Page for DocumentType -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { PUBLIC_NAME_COMPANY } from '$env/static/public';
	import { documenttypeService } from '$lib/services/documenttypes/documenttypeService';
	import type { DocumentType, DocumentTypeSearchParams } from '$lib/types/documenttype';
	import DataTable from '$lib/components/ui/DataTable.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { confirmation } from '$lib/stores/confirmation';
	import type { Column, PaginationInfo, SortDirection } from '$lib/types/datatable';
	import { authStore } from '$lib/stores/auth.svelte';
	import PermissionGuard from '$lib/components/PermissionGuard.svelte';

	let documenttypes: DocumentType[] = [];
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
	const columns: Column<DocumentType>[] = [
		{
			key: 'code',
			title: 'Código',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
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
			key: 'prefix',
			title: 'Prefijo',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
		{
			key: 'include_year',
			title: 'Incluir año',
			sortable: true,
			render: (_, item) => {
				const isActiveClass = item.include_year
					? 'badge-status-active'
					: 'badge-status-inactive';
				const isActiveText = item.include_year ? 'Sí' : 'No';
				return `<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${isActiveClass}">${isActiveText}</span>`;
			}
		},
		{
			key: 'include_month',
			title: 'Incluir mes',
			sortable: true,
			render: (_, item) => {
				const isActiveClass = item.include_month
					? 'badge-status-active'
					: 'badge-status-inactive';
				const isActiveText = item.include_month ? 'Sí' : 'No';
				return `<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${isActiveClass}">${isActiveText}</span>`;
			}
		},
		{
			key: 'number_length',
			title: 'Longitud del número',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
		{
			key: 'format',
			title: 'Formato',
			sortable: true,
			render: (value) => (value as any) || '-'
		},
		{
			key: 'module',
			title: 'Módulo',
			sortable: true,
			render: (value) => (value as any) || '-'
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
		{
			key: 'createdbyuser',
			title: 'Creado por el usuario',
			sortable: false,
			render: (_, item) => {
				const relation = item.createdbyuser as any;
				if (!relation) return '<span class="text-tertiary">-</span>';
				// Try common display fields in order of preference
				const displayValue = relation.name || relation.title || relation.label || relation.code || relation.id || '-';
				return `<span class="text-secondary">${displayValue}</span>`;
			}
		},
		{
			key: 'updatedbyuser',
			title: 'Actualizado por el usuario',
			sortable: false,
			render: (_, item) => {
				const relation = item.updatedbyuser as any;
				if (!relation) return '<span class="text-tertiary">-</span>';
				// Try common display fields in order of preference
				const displayValue = relation.name || relation.title || relation.label || relation.code || relation.id || '-';
				return `<span class="text-secondary">${displayValue}</span>`;
			}
		},
	];

	async function loadDocumentTypes(
		page: number = 1,
		limit: number = 10,
		search: string = '',
		sortBy?: string,
		sortDir?: SortDirection
	) {
		loading = true;
		error = '';

		try {
			const params: DocumentTypeSearchParams = {
				page,
				limit,
				search: search || undefined,
				sort_by: sortBy || undefined,
				sort_direction: sortDir || 'asc'
			};

			const response = await documenttypeService.getAll(params);
			// Asegurar que siempre sea un array, incluso si la respuesta es null/undefined
			documenttypes = Array.isArray(response.data) ? response.data : [];
			pagination = {
				page: response.pagination.current_page || page,
				limit: response.pagination.limit || limit,
				total: response.pagination.total || 0,
				totalPages: response.pagination.total_pages || 0
			};
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al cargar tipos de documentos';
			console.error('Error loading documenttypes:', err);
			// En caso de error, asegurar que el array esté vacío
			documenttypes = [];
		} finally {
			loading = false;
		}
	}

	async function deleteDocumentType(id: string, name: string) {
		const confirmed = await confirmation.danger(
			`¿Estás seguro de que quieres eliminar "${name}"? Esta acción no se puede deshacer.`,
			'Eliminar Tipos de Documento'
		);

		if (!confirmed) return;

		try {
			await documenttypeService.delete(id);
			await loadDocumentTypes(pagination.page, pagination.limit, searchTerm, sortKey, sortDirection);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al eliminar tipos de documento';
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
		loadDocumentTypes(1, pagination.limit, searchTerm, sortKey, sortDirection);
	}

	function handlePageChange(event: CustomEvent<{ page: number }>) {
		loadDocumentTypes(event.detail.page, pagination.limit, searchTerm, sortKey, sortDirection);
	}

	function handleLimitChange(event: CustomEvent<{ limit: number }>) {
		loadDocumentTypes(1, event.detail.limit, searchTerm, sortKey, sortDirection);
	}

	function handleSort(event: CustomEvent<{ key: string; direction: SortDirection }>) {
		sortKey = event.detail.key;
		sortDirection = event.detail.direction;
		loadDocumentTypes(pagination.page, pagination.limit, searchTerm, sortKey, sortDirection);
	}

	onMount(() => {
		loadDocumentTypes();
	});
</script>

<svelte:head>
  <title>Tipos de Documentos - {PUBLIC_NAME_COMPANY}</title>
</svelte:head>

<div class="p-4 sm:p-6">
	<div class="mb-6">
		<!-- Header responsive: stack en móvil, horizontal en desktop -->
		<!-- Agregamos pr-16 en móvil para dar espacio al botón hamburger del sidebar -->
		<div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 lg:pr-0 pr-16">
			<div class="min-w-0 flex-1">
				<h1 class="text-xl sm:text-2xl font-bold text-primary">Tipos de Documentos</h1>
				<p class="text-sm sm:text-base text-secondary">Gestiona los tipos de documentos del sistema</p>
			</div>
			<PermissionGuard permission="documenttypes.create">
				<Button
					on:click={() => goto('/documenttypes/create')}
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
					<span>Nuevo Tipos de Documento</span>
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
		data={ documenttypes as unknown as Record<string, unknown>[]}
		{loading}
		{pagination}
		{sortKey}
		{sortDirection}
		searchPlaceholder="Buscar tipos de documentos... (presiona Enter)"
		emptyMessage="No se encontraron tipos de documentos. Comienza creando un nuevo tipos de documento."
		on:search={handleSearch}
		on:page-change={handlePageChange}
		on:limit-change={handleLimitChange}
		on:sort={handleSort}
	>
		<svelte:fragment slot="actions" let:item>
			<div class="flex justify-end space-x-1">
				<button
					on:click={() => goto(`/documenttypes/${(item as unknown as DocumentType).id}`)}
					class="btn-icon btn-icon-neutral"
					title="Ver detalles"
					aria-label="Ver detalles del tipos de documento"
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
				{#if authStore.hasPermission('documenttypes.update')}
					<button
						on:click={() => goto(`/documenttypes/${(item as unknown as DocumentType).id}/edit`)}
						class="btn-icon btn-icon-primary"
						title="Editar"
						aria-label="Editar tipos de documento"
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
				{#if authStore.hasPermission('documenttypes.delete')}
					<button
						on:click={() => deleteDocumentType((item as unknown as DocumentType).id, (item as unknown as DocumentType).name)}
						class="btn-icon btn-icon-danger"
						title="Eliminar"
						aria-label="Eliminar tipos de documento"
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
