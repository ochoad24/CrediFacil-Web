<script lang="ts">
	import { fileService } from '$lib/services/files/fileService';
	import FileItem from './FileItem.svelte';
	import FileViewer from './FileViewer.svelte';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import Select from './Select.svelte';
	import { cn } from '$lib/utils/cn';
	import type { File, FileListParams } from '$lib/types/file';

	export let bucketName: string | null = null;
	export let showSearch: boolean = true;
	export let showPagination: boolean = true;
	export let initialLimit: number = 10;
	export let onDelete: ((file: File) => Promise<void>) | null = null;
	export let className: string = '';

	let files: File[] = [];
	let loading = false;
	let currentPage = 1;
	let totalPages = 1;
	let total = 0;
	let limit = initialLimit;
	let search = '';
	let sortBy: 'original_name' | 'bucket_name' | 'file_size' | 'created_at' | 'updated_at' =
		'created_at';
	let sortDirection: 'asc' | 'desc' = 'desc';

	// File Viewer Modal
	let viewerOpen = false;
	let selectedFile: File | null = null;

	const loadFiles = async () => {
		loading = true;
		try {
			const params: FileListParams = {
				page: currentPage,
				limit,
				search,
				sort_by: sortBy,
				sort_direction: sortDirection
			};

			const response = await fileService.getAllFiles(params);
			files = response.data;
			currentPage = response.pagination.current_page;
			totalPages = response.pagination.total_pages;
			total = response.pagination.total;
		} catch (error) {
			console.error('Error loading files:', error);
			files = [];
		} finally {
			loading = false;
		}
	};

	const handleSearch = () => {
		currentPage = 1;
		loadFiles();
	};

	const handlePageChange = (page: number) => {
		currentPage = page;
		loadFiles();
	};

	const handleSortChange = () => {
		currentPage = 1;
		loadFiles();
	};

	const handleViewFile = (file: File) => {
		selectedFile = file;
		viewerOpen = true;
	};

	const handleCloseViewer = () => {
		viewerOpen = false;
		selectedFile = null;
	};

	const handleDeleteFile = async (file: File) => {
		if (!confirm(`¿Estás seguro de eliminar "${file.original_name}"?`)) {
			return;
		}

		try {
			if (onDelete) {
				await onDelete(file);
			} else {
				await fileService.deleteFile(file.id);
			}

			// Reload files after deletion
			await loadFiles();
		} catch (error) {
			console.error('Error deleting file:', error);
			alert(
				`Error al eliminar el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`
			);
		}
	};

	// Filter files by bucket if specified
	$: filteredFiles = bucketName
		? files.filter((file) => file.bucket_name === bucketName)
		: files;

	// Load files on mount
	$: if (typeof window !== 'undefined') {
		loadFiles();
	}

	// Select options
	const sortByOptions = [
		{ value: 'created_at', label: 'Fecha' },
		{ value: 'original_name', label: 'Nombre' },
		{ value: 'file_size', label: 'Tamaño' },
		{ value: 'bucket_name', label: 'Bucket' }
	];

	const sortDirectionOptions = [
		{ value: 'desc', label: 'Desc ↓' },
		{ value: 'asc', label: 'Asc ↑' }
	];
</script>

<div class={cn('file-list', className)}>
	<!-- Search and Filters -->
	{#if showSearch}
		<div class="mb-4 flex flex-col sm:flex-row gap-3">
			<div class="flex-1">
				<Input
					type="text"
					placeholder="Buscar archivos..."
					bind:value={search}
					on:input={handleSearch}
					className="w-full"
				/>
			</div>

			<div class="flex gap-2">
				<Select
					bind:value={sortBy}
					items={sortByOptions}
					on:change={handleSortChange}
					className="w-40"
				/>

				<Select
					bind:value={sortDirection}
					items={sortDirectionOptions}
					on:change={handleSortChange}
					className="w-32"
				/>
			</div>
		</div>
	{/if}

	<!-- Files List -->
	<div class="space-y-3">
		{#if loading}
			<div class="flex items-center justify-center py-12">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
			</div>
		{:else if filteredFiles.length === 0}
			<div class="text-center py-12">
				<div class="text-5xl mb-4">📁</div>
				<p class="text-lg text-secondary">No se encontraron archivos</p>
				{#if search}
					<p class="text-sm text-muted mt-2">Intenta con otro término de búsqueda</p>
				{/if}
			</div>
		{:else}
			{#each filteredFiles as file (file.id)}
				<FileItem
					{file}
					onView={handleViewFile}
					onDelete={handleDeleteFile}
				/>
			{/each}
		{/if}
	</div>

	<!-- Pagination -->
	{#if showPagination && totalPages > 1}
		<div class="mt-6 flex items-center justify-between">
			<div class="text-sm text-muted">
				Mostrando {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, total)} de {total}
				{total === 1 ? 'archivo' : 'archivos'}
			</div>

			<div class="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={currentPage === 1}
					on:click={() => handlePageChange(currentPage - 1)}
				>
					← Anterior
				</Button>

				<div class="flex items-center gap-2">
					{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
						{#if page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)}
							<Button
								variant={page === currentPage ? 'primary' : 'outline'}
								size="sm"
								on:click={() => handlePageChange(page)}
							>
								{page}
							</Button>
						{:else if page === currentPage - 2 || page === currentPage + 2}
							<span class="text-muted">...</span>
						{/if}
					{/each}
				</div>

				<Button
					variant="outline"
					size="sm"
					disabled={currentPage === totalPages}
					on:click={() => handlePageChange(currentPage + 1)}
				>
					Siguiente →
				</Button>
			</div>
		</div>
	{/if}
</div>

<!-- File Viewer Modal -->
<FileViewer file={selectedFile} open={viewerOpen} onClose={handleCloseViewer} />

<style>
	.file-list {
		width: 100%;
	}
</style>
