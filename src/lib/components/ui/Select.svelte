<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { browser } from '$app/environment';
	import { createEventDispatcher, tick, onDestroy, onMount } from 'svelte';
	import { toast } from '$lib/utils/toast';

	type SelectItem = Record<string, any>;

	export let value: any = undefined;
	export let multiple: boolean = false;
	export let searchable: boolean = false;
	export let clearable: boolean = false;
	export let disabled: boolean = false;
	export let error: string = '';
	export let label: string = '';
	export let placeholder: string = 'Selecciona una opción';
	export let emptyText: string = 'No hay resultados';
	export let loadingText: string = 'Buscando...';
	export let className: string = '';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let tabindex: number | undefined = undefined;

	// Generic item handling
	export let items: SelectItem[] = [];
	export let getValue: (item: SelectItem) => any = (item) => (item as any).value;
	export let getLabel: (item: SelectItem) => string = (item) => (item as any).label;
	export let getDisabled: (item: SelectItem) => boolean = (item) => (item as any).disabled || false;

	// External search functionality
	export let externalSearch:
		| ((query: string, params?: any) => Promise<{ data: SelectItem[]; pagination?: any }>)
		| undefined = undefined;
	export let searchDebounceMs: number = 300;
	export let minSearchLength: number = 2;
	export let searchParams: {
		page?: number;
		limit?: number;
		sortBy?: string;
		sortDirection?: 'asc' | 'desc';
	} = {
		page: 1,
		limit: 20,
		sortBy: '',
		sortDirection: 'asc'
	};

	// Internal state
	let isOpen = false;
	let searchTerm = '';
	let searchInput: HTMLInputElement;
	let container: HTMLDivElement;
	let dropdownRef: HTMLDivElement;
	let uniqueId = `select-${Math.random().toString(36).substring(2, 9)}`;

	// External search state
	let isLoading = false;
	let externalItems: SelectItem[] = [];
	let debounceTimer: NodeJS.Timeout;
	let hasSearched = false;
	let preselectedItem: SelectItem | null = null;

	// Keyboard navigation state
	let focusedIndex = -1;

	const dispatch = createEventDispatcher<{
		change: { value: any; item: SelectItem | SelectItem[] | null };
		select: { item: SelectItem };
		deselect: { item: SelectItem };
		clear: void;
		search: { term: string };
	}>();

	// Determine if we're using external search
	$: isExternalSearch = !!externalSearch;
	$: currentItems = isExternalSearch ? externalItems : items;

	// Computed properties
	$: filteredItems = isExternalSearch
		? externalItems // External search items are already filtered
		: items.filter((item) => {
				if (!searchable || !searchTerm) return true;
				return getLabel(item).toLowerCase().includes(searchTerm.toLowerCase());
			});

	$: selectedItems =
		multiple && Array.isArray(value)
			? currentItems.filter((item) => value.includes(getValue(item)))
			: value !== undefined
				? currentItems.find((item) => getValue(item) === value) || preselectedItem
				: null;

	$: displayText =
		multiple && Array.isArray(selectedItems)
			? selectedItems.length > 0
				? `${selectedItems.length} seleccionado${selectedItems.length > 1 ? 's' : ''}`
				: placeholder
			: selectedItems
				? getLabel(selectedItems)
				: placeholder;

	$: showError = browser && error;

	// Size variants
	const sizeVariants = {
		sm: 'h-8 px-2 py-1 text-sm',
		md: 'h-10 px-3 py-2 text-base',
		lg: 'h-12 px-4 py-3 text-lg'
	};

	// Classes
	$: selectClasses = cn(
		'relative w-full border rounded-md bg-surface text-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-muted disabled:text-disabled disabled:cursor-not-allowed transition-all duration-200',
		showError ? 'border-error focus:ring-error' : 'border-border',
		sizeVariants[size],
		className
	);

	$: dropdownClasses = cn(
		'absolute z-50 w-full mt-1 bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-auto',
		'dark:bg-surface dark:border-border'
	);

	// Manual search trigger (for external search with button)
	function triggerManualSearch() {
		if (isExternalSearch && searchTerm) {
			performExternalSearch(searchTerm);
		}
	}

	// Event handlers
	function toggle() {
		if (disabled) return;

		const wasOpen = isOpen;
		isOpen = !wasOpen;

		if (isOpen && searchable) {
			tick().then(() => {
				searchInput?.focus();
				// Si es búsqueda externa y no hay búsqueda previa, hacer una búsqueda inicial vacía para mostrar algunas opciones
				if (isExternalSearch && !hasSearched && !searchTerm) {
					performExternalSearch('');
				}
			});
		} else if (!isOpen) {
			// Limpiar el foco cuando se cierra
			resetFocus();
		}
	}

	// Función específica para abrir y enfocar directamente el input de búsqueda
	function openAndFocus() {
		if (disabled) return;

		if (!isOpen) {
			isOpen = true;
			if (searchable) {
				tick().then(() => {
					searchInput?.focus();
					// Si es búsqueda externa y no hay búsqueda previa, hacer una búsqueda inicial vacía
					if (isExternalSearch && !hasSearched && !searchTerm) {
						performExternalSearch('');
					}
				});
			}
		} else if (searchable && searchInput) {
			// Si ya está abierto, solo enfocar el input
			tick().then(() => {
				searchInput?.focus();
			});
		}
	}

	// Función para abrir automáticamente al recibir focus (solo si no es por click)
	function handleFocus(event: FocusEvent) {
		if (disabled) return;

		// No abrir automáticamente en focus para evitar conflictos con click
		// El usuario debe hacer click explícito para abrir
	}

	// Navigation functions
	function navigateUp() {
		if (filteredItems.length === 0) return;

		let newIndex = focusedIndex;
		do {
			newIndex--;
			if (newIndex < 0) {
				newIndex = filteredItems.length - 1;
			}
		} while (newIndex !== focusedIndex && getDisabled(filteredItems[newIndex]));

		if (!getDisabled(filteredItems[newIndex])) {
			focusedIndex = newIndex;
			scrollToFocusedItem();
		}
	}

	function navigateDown() {
		if (filteredItems.length === 0) return;

		let newIndex = focusedIndex;
		do {
			newIndex++;
			if (newIndex >= filteredItems.length) {
				newIndex = 0;
			}
		} while (newIndex !== focusedIndex && getDisabled(filteredItems[newIndex]));

		if (!getDisabled(filteredItems[newIndex])) {
			focusedIndex = newIndex;
			scrollToFocusedItem();
		}
	}

	function selectFocusedItem() {
		if (focusedIndex >= 0 && focusedIndex < filteredItems.length) {
			const item = filteredItems[focusedIndex];
			if (!getDisabled(item)) {
				selectItem(item);
			}
		}
	}

	function scrollToFocusedItem() {
		if (focusedIndex >= 0) {
			tick().then(() => {
				const focusedElement = container.querySelector(`[data-option-index="${focusedIndex}"]`);
				if (focusedElement) {
					focusedElement.scrollIntoView({ block: 'nearest' });
				}
			});
		}
	}

	function resetFocus() {
		focusedIndex = -1;
	}

	function selectItem(item: SelectItem) {
		const itemValue = getValue(item);

		if (multiple) {
			const currentValues = Array.isArray(value) ? [...value] : [];
			const index = currentValues.indexOf(itemValue);

			if (index === -1) {
				currentValues.push(itemValue);
				dispatch('select', { item });
			} else {
				currentValues.splice(index, 1);
				dispatch('deselect', { item });
			}

			value = currentValues;
			dispatch('change', { value, item: items.filter((i) => currentValues.includes(getValue(i))) });
		} else {
			value = itemValue;
			isOpen = false;
			dispatch('select', { item });
			dispatch('change', { value, item });
		}
	}

	function clear() {
		value = multiple ? [] : undefined;
		searchTerm = '';
		isOpen = false;

		// Reset external search state
		if (isExternalSearch) {
			externalItems = [];
			hasSearched = false;
			isLoading = false;
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
		}

		dispatch('clear');
		dispatch('change', { value, item: null });
	}

	// External search function
	async function performExternalSearch(query: string) {
		if (!externalSearch) return;

		// Para búsquedas vacías (carga inicial), permitir la búsqueda para mostrar opciones por defecto
		if (!query) {
			if (query === '' && !hasSearched) {
				// Búsqueda inicial vacía para mostrar algunos resultados
				isLoading = true;
				hasSearched = true;

				try {
					const response = await externalSearch('', { ...searchParams, limit: 10 });
					externalItems = response.data || [];
				} catch (error) {
					console.error('Error in initial search:', error);
					// No mostrar toast en búsqueda inicial, solo log
					externalItems = [];
				} finally {
					isLoading = false;
				}
			} else {
				externalItems = [];
				hasSearched = false;
			}
			return;
		}

		// Para búsquedas con texto, validar longitud mínima
		if (query.length < minSearchLength) {
			return;
		}

		isLoading = true;
		hasSearched = true;

		try {
			const response = await externalSearch(query, searchParams);
			externalItems = response.data || [];
		} catch (error) {
			console.error('Error in external search:', error);
			toast.error('Error al realizar la búsqueda. Por favor, inténtalo de nuevo.');
			externalItems = [];
		} finally {
			isLoading = false;
		}
	}

	// Debounced search function
	function debouncedExternalSearch(query: string) {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		debounceTimer = setTimeout(() => {
			performExternalSearch(query);
		}, searchDebounceMs);
	}

	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		searchTerm = target.value;
		dispatch('search', { term: searchTerm });

		// Trigger external search if configured
		if (isExternalSearch) {
			debouncedExternalSearch(searchTerm);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (disabled) return;

		switch (event.key) {
			case 'Enter':
			case ' ':
				event.preventDefault();
				if (!isOpen) {
					if (searchable) {
						openAndFocus();
					} else {
						toggle();
					}
				} else {
					// Si hay un item enfocado, seleccionarlo
					if (focusedIndex >= 0) {
						selectFocusedItem();
					} else if (!searchable) {
						// Si no hay búsqueda y no hay item enfocado, cerrar
						isOpen = false;
					}
				}
				break;
			case 'Escape':
				if (isOpen) {
					event.preventDefault();
					isOpen = false;
					resetFocus();
				}
				break;
			case 'ArrowDown':
				event.preventDefault();
				if (!isOpen) {
					if (searchable) {
						openAndFocus();
					} else {
						toggle();
					}
				} else {
					navigateDown();
				}
				break;
			case 'ArrowUp':
				event.preventDefault();
				if (!isOpen) {
					if (searchable) {
						openAndFocus();
					} else {
						toggle();
					}
				} else {
					navigateUp();
				}
				break;
			// Permitir empezar a escribir directamente para abrir y buscar
			default:
				if (
					!isOpen &&
					searchable &&
					event.key.length === 1 &&
					!event.ctrlKey &&
					!event.metaKey &&
					!event.altKey
				) {
					event.preventDefault();
					isOpen = true;
					searchTerm = event.key;
					tick().then(() => {
						searchInput?.focus();
						if (isExternalSearch) {
							debouncedExternalSearch(searchTerm);
						}
					});
				}
				break;
		}
	}

	// Click outside to close - usando un enfoque más confiable
	function handleClickOutside(event: MouseEvent) {
		if (container && !container.contains(event.target as Node)) {
			if (isOpen) {
				isOpen = false;
				resetFocus();
			}
		}
	}

	// Load preselected item for external search
	async function loadPreselectedItem() {
		if (!isExternalSearch || !externalSearch || !value || value === '') return;

		try {
			// Intentar cargar una búsqueda inicial para encontrar el item
			const response = await externalSearch('', { ...searchParams, limit: 100 });
			const foundItem = response.data?.find((item) => getValue(item) === value);

			if (foundItem) {
				preselectedItem = foundItem;
				// También agregar a externalItems para que esté disponible
				externalItems = [foundItem];
			} else {
				// Si no se encuentra en la búsqueda inicial, intentar buscar con un query más específico
				// Esto puede requerir una API que soporte búsqueda por ID
				console.warn('Preselected item not found in initial search');
			}
		} catch (error) {
			console.error('Error loading preselected item:', error);
		}
	}

	onMount(() => {
		loadPreselectedItem();

		// Agregar listener para clicks fuera del componente
		if (browser) {
			document.addEventListener('click', handleClickOutside);
		}
	});

	// También cargar cuando cambie el valor
	$: if (value !== undefined && value !== null && value !== '') {
		loadPreselectedItem();
	}

	// Reset focus when dropdown closes or items change
	$: if (!isOpen) {
		resetFocus();
	}

	// Reset focus when filtered items change
	$: if (filteredItems) {
		resetFocus();
	}

	// Initialize focus to first available item when dropdown opens
	$: if (isOpen && filteredItems.length > 0 && focusedIndex === -1) {
		// Find first non-disabled item
		const firstAvailableIndex = filteredItems.findIndex(item => !getDisabled(item));
		if (firstAvailableIndex !== -1) {
			focusedIndex = firstAvailableIndex;
		}
	}

	// Cleanup on component destroy
	onDestroy(() => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		if (browser) {
			document.removeEventListener('click', handleClickOutside);
		}
	});
</script>


<div class="w-full" bind:this={container}>
	{#if label}
		<label for={uniqueId} class="block text-sm font-medium text-primary mb-2">
			{label}
		</label>
	{/if}

	<div class="relative">
		<div
			id={uniqueId}
			class={selectClasses}
			tabindex={disabled ? -1 : (tabindex ?? 0)}
			role="combobox"
			aria-expanded={isOpen}
			aria-haspopup="listbox"
			aria-controls="{uniqueId}-listbox"
			on:click={(e) => {
				// Prevenir la propagación del evento para evitar que se cierre inmediatamente
				e.stopPropagation();

				if (disabled) return;

				if (searchable) {
					openAndFocus();
				} else {
					toggle();
				}
			}}
			on:focus={handleFocus}
			on:keydown={handleKeydown}
		>
			<div class="flex items-center justify-between">
				<div class="flex-1 truncate">
					{#if searchable && isOpen}
						<div class="flex items-center w-full">
							<input
								bind:this={searchInput}
								bind:value={searchTerm}
								class="flex-1 bg-transparent border-none outline-none"
								placeholder={isExternalSearch && minSearchLength > 1
									? `Escribe al menos ${minSearchLength} caracteres para buscar...`
									: placeholder}
								on:input={handleSearch}
								on:click|stopPropagation
							/>

							{#if isExternalSearch}
								<div class="flex items-center ml-2">
									{#if isLoading}
										<div
											class="animate-spin rounded-full h-4 w-4 border-2 border-muted border-t-primary-600"
										></div>
									{:else if searchTerm.length >= minSearchLength}
										<button
											type="button"
											class="text-tertiary hover:text-primary transition-colors"
											aria-label="Buscar"
											on:click|stopPropagation={triggerManualSearch}
										>
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
												/>
											</svg>
										</button>
									{/if}
								</div>
							{/if}
						</div>
					{:else}
						<div class="flex items-center">
							{#if searchable && !selectedItems}
								<svg
									class="w-4 h-4 text-tertiary mr-2 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							{/if}
							<span
								class={cn(
									'block truncate',
									!selectedItems ||
										(multiple && Array.isArray(selectedItems) && selectedItems.length === 0)
										? 'text-tertiary'
										: 'text-primary'
								)}
							>
								{displayText}
							</span>
						</div>
					{/if}
				</div>

				<div class="flex items-center space-x-1 ml-2">
					{#if clearable && ((multiple && Array.isArray(selectedItems) && selectedItems.length > 0) || (!multiple && selectedItems))}
						<button
							type="button"
							class="text-tertiary hover:text-primary transition-colors"
							aria-label="Limpiar selección"
							on:click|stopPropagation={clear}
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					{/if}

					<svg
						class={cn(
							'w-4 h-4 text-tertiary transition-transform duration-200',
							isOpen ? 'rotate-180' : ''
						)}
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</div>
			</div>
		</div>

		{#if isOpen}
			<div bind:this={dropdownRef} id="{uniqueId}-listbox" class={dropdownClasses} role="listbox">
				{#if isLoading}
					<div class="px-3 py-4 text-secondary text-center">
						<div class="flex items-center justify-center space-x-2">
							<div
								class="animate-spin rounded-full h-4 w-4 border-2 border-muted border-t-primary-600"
							></div>
							<span>{loadingText}</span>
						</div>
					</div>
				{:else if isExternalSearch && !hasSearched && searchTerm.length < minSearchLength}
					<div class="px-3 py-2 text-tertiary text-center">
						{#if searchTerm.length === 0}
							<div class="space-y-1">
								<p>💡 Puedes empezar escribiendo directamente</p>
								<p class="text-xs">
									{minSearchLength > 1
										? `Mínimo ${minSearchLength} caracteres para buscar`
										: 'Escribe para buscar'}
								</p>
							</div>
						{:else}
							{minSearchLength > 1
								? `Escribe al menos ${minSearchLength} caracteres para buscar`
								: 'Escribe para buscar'}
						{/if}
					</div>
				{:else if filteredItems.length === 0}
					<div class="px-3 py-2 text-tertiary text-center">
						{isExternalSearch && hasSearched ? 'No se encontraron resultados' : emptyText}
					</div>
				{:else}
					{#each filteredItems as item, index (getValue(item))}
						{@const itemValue = getValue(item)}
						{@const itemDisabled = getDisabled(item)}
						{@const isSelected = multiple
							? Array.isArray(value) && value.includes(itemValue)
							: value === itemValue}
						{@const isFocused = !itemDisabled && index === focusedIndex}

						<div
							class={cn(
								'px-3 py-2 cursor-pointer flex items-center justify-between transition-colors',
								isSelected
									? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
									: 'text-primary',
								isFocused
									? 'bg-primary-100 dark:bg-primary-800/30'
									: 'hover:bg-muted',
								itemDisabled ? 'opacity-50 cursor-not-allowed text-disabled' : ''
							)}
							role="option"
							tabindex={itemDisabled ? -1 : 0}
							aria-selected={isSelected}
							data-option-index={index}
							on:click={() => !itemDisabled && selectItem(item)}
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									if (!itemDisabled) selectItem(item);
								}
							}}
						>
							<span class="truncate">{getLabel(item)}</span>
							{#if isSelected}
								<svg class="w-4 h-4 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clip-rule="evenodd"
									/>
								</svg>
							{/if}
						</div>
					{/each}
				{/if}
			</div>
		{/if}
	</div>

	{#if showError}
		<p class="mt-1 text-sm text-error">{error}</p>
	{/if}
</div>
