<script lang="ts" generics="T extends Record<string, unknown>">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import { cn } from '$lib/utils/cn';
	import type { Column, PaginationInfo, SortDirection } from '$lib/types/datatable';

	// Props
	export let data: T[] = [];
	export let columns: Column<T>[] = [];
	export let loading: boolean = false;
	export let searchable: boolean = true;
	export let searchPlaceholder: string = 'Buscar...';
	export let pagination: PaginationInfo | undefined = undefined;
	export let limitOptions: number[] = [5, 10, 25, 50, 100];
	export let sortKey: string | undefined = undefined;
	export let sortDirection: SortDirection | undefined = undefined;
	export let emptyMessage: string = 'No hay datos disponibles';
	export let className: string = '';
	export let showRowNumbers: boolean = true;

	// Local state
	let searchTerm = '';

	// Event dispatcher
	const dispatch = createEventDispatcher<{
		search: { search: string };
		'search-input': { search: string };
		'page-change': { page: number };
		'limit-change': { limit: number };
		sort: { key: string; direction: SortDirection };
	}>();

	// Functions
	function handleSearchInput(value: string) {
		searchTerm = value;
		// Dispatch search-input event for real-time/debounced search
		dispatch('search-input', { search: searchTerm });
	}

	function handleSearchSubmit() {
		dispatch('search', { search: searchTerm });
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSearchSubmit();
		}
	}

	function handleClearSearch() {
		searchTerm = '';
		dispatch('search', { search: '' });
	}

	function handleSort(key: string) {
		const newDirection: SortDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc';
		dispatch('sort', { key, direction: newDirection });
	}

	function handlePageChange(page: number) {
		dispatch('page-change', { page });
	}

	function handleLimitChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		dispatch('limit-change', { limit: Number(target.value) });
	}

	function renderSortIcon(columnKey: string) {
		if (sortKey !== columnKey) {
			return 'M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4';
		}

		return sortDirection === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7';
	}

	function getSortIconColor(columnKey: string) {
		return sortKey === columnKey
			? 'text-primary-600 dark:text-primary-400'
			: 'text-gray-400 dark:text-gray-400';
	}

	// Reactive statements
	$: paginationPages = pagination
		? calculatePaginationPages(pagination.page, pagination.totalPages)
		: { pages: [], startPage: 1, endPage: 1 };

	function calculatePaginationPages(currentPage: number, totalPages: number) {
		const pages = [];
		const startPage = Math.max(1, currentPage - 2);
		const endPage = Math.min(totalPages, currentPage + 2);

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}
		return { pages, startPage, endPage };
	}
</script>

<div class={cn('bg-surface rounded-xl shadow-sm border border-border', className)}>
	<!-- Search Bar -->
	{#if searchable}
		<div class="p-6 border-b border-border">
			<div class="flex gap-3">
				<div class="relative flex-1">
					<svg
						class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>
					<Input
						type="text"
						placeholder={searchPlaceholder}
						bind:value={searchTerm}
						on:keydown={handleKeyDown}
						className="pl-10"
					/>
				</div>
				<Button
					on:click={handleSearchSubmit}
					variant="primary"
					size="sm"
					className="flex items-center justify-center gap-2 px-3 sm:px-4 min-w-[44px]"
				>
					<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>
					<span class="hidden sm:inline whitespace-nowrap">Buscar</span>
				</Button>
				{#if searchTerm}
					<Button
						on:click={handleClearSearch}
						variant="outline"
						size="sm"
						className="flex items-center justify-center gap-2 px-3 sm:px-4 min-w-[44px]"
						title="Limpiar búsqueda"
					>
						<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
						<span class="hidden sm:inline whitespace-nowrap">Limpiar</span>
					</Button>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Table -->
	<div class="overflow-x-auto">
		<table class="w-full min-w-max">
			<thead class="bg-muted border-b border-border">
				<tr>
					{#if showRowNumbers}
						<th
							class="px-2 sm:px-4 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider w-12 sm:w-16"
						>
							<span class="hidden sm:inline">No.</span>
							<span class="sm:hidden">#</span>
						</th>
					{/if}
					{#each columns as column}
						<th
							class={cn(
								'px-3 sm:px-6 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider',
								column.sortable ? 'cursor-pointer hover:bg-muted/70 select-none' : '',
								column.className || ''
							)}
							on:click={column.sortable ? () => handleSort(column.key) : undefined}
							role={column.sortable ? 'button' : undefined}
							tabindex={column.sortable ? 0 : undefined}
							on:keydown={column.sortable
								? (e) => (e.key === 'Enter' || e.key === ' ') && handleSort(column.key)
								: undefined}
						>
							<div class="flex items-center space-x-1 sm:space-x-2">
								<span class="truncate">{column.title}</span>
								{#if column.sortable}
									<svg
										class={cn('w-3 h-3 sm:w-4 sm:h-4 shrink-0', getSortIconColor(column.key))}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d={renderSortIcon(column.key)}
										/>
									</svg>
								{/if}
							</div>
						</th>
					{/each}
					<th
						class="px-3 sm:px-6 py-2 sm:py-4 text-left text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider"
					>
						Acciones
					</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-border">
				{#if loading}
					<tr>
						<td
							colspan={(showRowNumbers ? 1 : 0) + columns.length + 1}
							class="px-3 sm:px-6 py-8 sm:py-12 text-center"
						>
							<div class="flex items-center justify-center">
								<div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary-600"></div>
								<span class="ml-2 sm:ml-3 text-sm sm:text-base text-muted-foreground">Cargando...</span>
							</div>
						</td>
					</tr>
				{:else if data.length === 0}
					<tr>
						<td
							colspan={(showRowNumbers ? 1 : 0) + columns.length + 1}
							class="px-3 sm:px-6 py-8 sm:py-12 text-center text-sm sm:text-base text-muted-foreground"
						>
							{emptyMessage}
						</td>
					</tr>
				{:else}
					{#each data as item, index (index)}
						{@const rowNumber = pagination
							? (pagination.page - 1) * pagination.limit + index + 1
							: index + 1}
						<tr class="hover:bg-muted/50 transition-colors">
							{#if showRowNumbers}
								<td class="px-2 sm:px-4 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-text-primary">
									{rowNumber}
								</td>
							{/if}
							{#each columns as column}
								<td
									class={cn(
										'px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-text-primary',
										column.className || ''
									)}
								>
									{#if column.render}
										{@html column.render(item[column.key], item)}
									{:else}
										<span class="text-text-primary truncate block max-w-[200px] sm:max-w-none">{item[column.key]}</span>
									{/if}
								</td>
							{/each}
							<td class="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
								<slot name="actions" {item} {index} />
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Pagination -->
	{#if pagination}
		<div class="space-y-3 sm:space-y-4 mt-4 sm:mt-6 px-3 sm:px-6 pb-4 sm:pb-6">
			<!-- Information row -->
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
				<div class="text-xs sm:text-sm text-text-secondary order-2 sm:order-1 text-center sm:text-left">
					Mostrando {(pagination.page - 1) * pagination.limit + 1} a {Math.min(
						pagination.page * pagination.limit,
						pagination.total
					)} de {pagination.total}
				</div>

				<!-- Records per page selector -->
				<div class="flex items-center justify-center sm:justify-start gap-2 order-1 sm:order-2">
					<span class="text-xs sm:text-sm text-text-secondary">Mostrar</span>
					<select
						value={pagination.limit}
						on:change={handleLimitChange}
						class="px-2 py-1 text-xs sm:text-sm border border-border rounded bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[60px]"
					>
						{#each limitOptions as option}
							<option value={option}>
								{option}
							</option>
						{/each}
					</select>
					<span class="text-xs sm:text-sm text-text-secondary hidden sm:inline">por página</span>
				</div>
			</div>

			<!-- Pagination controls -->
			<div class="flex items-center justify-center">
				<!-- Mobile pagination - simplified -->
				<div class="flex sm:hidden items-center justify-between w-full max-w-xs gap-2">
					<Button
						variant="outline"
						size="sm"
						on:click={() => handlePageChange(pagination.page - 1)}
						disabled={pagination.page <= 1}
						className="flex items-center justify-center min-w-[40px] px-2"
					>
						<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15.75 19.5L8.25 12l7.5-7.5"
							/>
						</svg>
					</Button>

					<div class="flex items-center space-x-2">
						<span class="text-xs font-medium text-text-secondary whitespace-nowrap">
							{pagination.page} / {pagination.totalPages}
						</span>
					</div>

					<Button
						variant="outline"
						size="sm"
						on:click={() => handlePageChange(pagination.page + 1)}
						disabled={pagination.page >= pagination.totalPages}
						className="flex items-center justify-center min-w-[40px] px-2"
					>
						<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8.25 4.5l7.5 7.5-7.5 7.5"
							/>
						</svg>
					</Button>
				</div>

				<!-- Desktop pagination - full controls -->
				<div class="hidden sm:flex items-center space-x-1 overflow-x-auto">
					<Button
						variant="outline"
						size="sm"
						on:click={() => handlePageChange(pagination.page - 1)}
						disabled={pagination.page <= 1}
						className="flex items-center whitespace-nowrap"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15.75 19.5L8.25 12l7.5-7.5"
							/>
						</svg>
						<span class="ml-1">Anterior</span>
					</Button>

					{#if paginationPages.startPage > 1}
						<Button
							variant={1 === pagination.page ? 'primary' : 'outline'}
							size="sm"
							on:click={() => handlePageChange(1)}
							className="whitespace-nowrap"
						>
							1
						</Button>
						{#if paginationPages.startPage > 2}
							<span class="text-muted-foreground px-1">...</span>
						{/if}
					{/if}

					{#each paginationPages.pages as pageNum}
						<Button
							variant={pageNum === pagination.page ? 'primary' : 'outline'}
							size="sm"
							on:click={() => handlePageChange(pageNum)}
							className="whitespace-nowrap"
						>
							{pageNum}
						</Button>
					{/each}

					{#if paginationPages.endPage < pagination.totalPages}
						{#if paginationPages.endPage < pagination.totalPages - 1}
							<span class="text-muted-foreground px-1">...</span>
						{/if}
						<Button
							variant={pagination.totalPages === pagination.page ? 'primary' : 'outline'}
							size="sm"
							on:click={() => handlePageChange(pagination.totalPages)}
							className="whitespace-nowrap"
						>
							{pagination.totalPages}
						</Button>
					{/if}

					<Button
						variant="outline"
						size="sm"
						on:click={() => handlePageChange(pagination.page + 1)}
						disabled={pagination.page >= pagination.totalPages}
						className="flex items-center whitespace-nowrap"
					>
						<span class="mr-1">Siguiente</span>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8.25 4.5l7.5 7.5-7.5 7.5"
							/>
						</svg>
					</Button>
				</div>
			</div>
		</div>
	{/if}
</div>
