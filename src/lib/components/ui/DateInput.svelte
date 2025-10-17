<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import flatpickr from 'flatpickr';
	import type { Instance } from 'flatpickr/dist/types/instance';
	import 'flatpickr/dist/flatpickr.min.css';

	export let value: string = ''; // ISO 8601 format string for binding
	export let mode: 'date' | 'datetime' = 'date'; // date or datetime mode
	export let placeholder: string = mode === 'date' ? 'DD/MM/YYYY' : 'DD/MM/YYYY HH:MM';
	export let error: string = '';
	export let label: string = '';
	export let className: string = '';
	export let disabled: boolean = false;
	export let id: string = '';

	// Generate unique ID if not provided
	const uniqueId = id || `dateinput-${Math.random().toString(36).substring(2, 11)}`;

	// Prevenir hydration mismatch - solo mostrar error después de hidratación
	$: showError = browser && error;

	let inputElement: HTMLInputElement;
	let flatpickrInstance: Instance | undefined;

	// Función para convertir de hora local Guatemala (GMT-6) a UTC ISO 8601
	function convertToUTC(localDateStr: string): string {
		if (!localDateStr) return '';

		// Parse the date string assuming Guatemala timezone (GMT-6)
		// Flatpickr nos da la fecha en formato local del usuario
		const localDate = new Date(localDateStr);

		// Ajustar a Guatemala timezone si es necesario
		// Guatemala está en GMT-6, así que agregamos 6 horas para convertir a UTC
		const guatemalaOffset = 6 * 60; // 6 horas en minutos
		const localOffset = localDate.getTimezoneOffset(); // offset del navegador en minutos
		const totalOffset = guatemalaOffset + localOffset;

		localDate.setMinutes(localDate.getMinutes() + totalOffset);

		// Retornar en formato ISO 8601
		return localDate.toISOString();
	}

	// Función para convertir de UTC ISO 8601 a hora local Guatemala
	function convertFromUTC(utcISOStr: string): Date | undefined {
		if (!utcISOStr) return undefined;

		const utcDate = new Date(utcISOStr);
		if (isNaN(utcDate.getTime())) return undefined;

		// Convertir de UTC a Guatemala (GMT-6)
		const guatemalaOffset = 6 * 60; // 6 horas en minutos
		const localOffset = utcDate.getTimezoneOffset();
		const totalOffset = guatemalaOffset + localOffset;

		utcDate.setMinutes(utcDate.getMinutes() - totalOffset);

		return utcDate;
	}

	$: inputClasses = cn(
		'w-full px-3 py-2 border rounded-md bg-surface text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-muted disabled:text-muted-foreground transition-colors',
		showError ? 'border-red-500 focus:ring-red-500' : 'border-border',
		className
	);

	onMount(() => {
		if (!browser || !inputElement) return;

		const options: flatpickr.Options.Options = {
			dateFormat: mode === 'date' ? 'd/m/Y' : 'd/m/Y H:i',
			enableTime: mode === 'datetime',
			time_24hr: true,
			allowInput: true,
			locale: {
				firstDayOfWeek: 0, // Domingo
				weekdays: {
					shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
					longhand: [
						'Domingo',
						'Lunes',
						'Martes',
						'Miércoles',
						'Jueves',
						'Viernes',
						'Sábado'
					]
				},
				months: {
					shorthand: [
						'Ene',
						'Feb',
						'Mar',
						'Abr',
						'May',
						'Jun',
						'Jul',
						'Ago',
						'Sep',
						'Oct',
						'Nov',
						'Dic'
					],
					longhand: [
						'Enero',
						'Febrero',
						'Marzo',
						'Abril',
						'Mayo',
						'Junio',
						'Julio',
						'Agosto',
						'Septiembre',
						'Octubre',
						'Noviembre',
						'Diciembre'
					]
				}
			},
			defaultDate: value ? convertFromUTC(value) : undefined,
			onChange: (selectedDates: Date[]) => {
				if (selectedDates.length > 0) {
					const selectedDate = selectedDates[0];
					// Convert to ISO 8601 UTC format
					value = convertToUTC(selectedDate.toISOString());
				} else {
					value = '';
				}
			}
		};

		flatpickrInstance = flatpickr(inputElement, options);
	});

	onDestroy(() => {
		if (flatpickrInstance) {
			flatpickrInstance.destroy();
		}
	});

	// Watch for external value changes
	$: if (flatpickrInstance && browser) {
		const currentDate = convertFromUTC(value);
		if (currentDate) {
			flatpickrInstance.setDate(currentDate, false);
		} else {
			flatpickrInstance.clear();
		}
	}
</script>

<div class="w-full">
	{#if label}
		<label for={uniqueId} class="block text-sm font-medium text-foreground mb-2">
			{label}
		</label>
	{/if}
	<input
		id={uniqueId}
		bind:this={inputElement}
		type="text"
		{placeholder}
		{disabled}
		class={inputClasses}
		on:focus
		on:blur
		{...$$restProps}
	/>
	{#if showError}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>

<style>
	/* Flatpickr theme customization for light mode */
	:global(.flatpickr-calendar) {
		background-color: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 0.5rem;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	:global(.flatpickr-months) {
		background-color: var(--color-primary-600);
		border-radius: 0.5rem 0.5rem 0 0;
	}

	:global(.flatpickr-current-month .flatpickr-monthDropdown-months) {
		background-color: var(--color-primary-600);
		color: white;
		font-weight: 600;
	}

	:global(.flatpickr-current-month .numInputWrapper input) {
		color: white;
		font-weight: 600;
	}

	:global(.flatpickr-weekdays) {
		background-color: var(--color-muted);
		padding: 0.5rem 0;
	}

	:global(.flatpickr-weekday) {
		color: var(--color-text-secondary);
		font-weight: 600;
	}

	:global(.flatpickr-day) {
		color: var(--color-text-primary);
		border-radius: 0.375rem;
	}

	:global(.flatpickr-day:hover) {
		background-color: var(--color-muted);
		border-color: var(--color-border);
	}

	:global(.flatpickr-day.selected) {
		background-color: var(--color-primary-600);
		border-color: var(--color-primary-600);
		color: white;
	}

	:global(.flatpickr-day.today) {
		border-color: var(--color-primary-500);
		color: var(--color-primary-600);
		font-weight: 600;
	}

	:global(.flatpickr-day.today:hover) {
		background-color: var(--color-primary-100);
		border-color: var(--color-primary-500);
	}

	:global(.flatpickr-day.disabled) {
		color: var(--color-text-disabled);
	}

	:global(.flatpickr-time) {
		border-top: 1px solid var(--color-border);
	}

	:global(.flatpickr-time input) {
		color: var(--color-text-primary);
	}

	:global(.flatpickr-time .numInputWrapper:hover),
	:global(.flatpickr-time input:focus) {
		background-color: var(--color-muted);
	}

	/* Dark mode adjustments */
	:global(.dark .flatpickr-months) {
		background-color: var(--color-primary-700);
	}

	:global(.dark .flatpickr-current-month .flatpickr-monthDropdown-months) {
		background-color: var(--color-primary-700);
	}

	/* Dark mode weekdays - usar un fondo más claro y texto más visible */
	:global(.dark .flatpickr-weekdays) {
		background-color: rgba(55, 65, 81, 0.5); /* gray-700 con transparencia */
	}

	:global(.dark .flatpickr-weekday) {
		color: var(--color-text-primary); /* Cambiar a texto primario para mejor visibilidad */
		font-weight: 600;
	}

	:global(.dark .flatpickr-day.selected) {
		background-color: var(--color-primary-500);
		border-color: var(--color-primary-500);
	}

	:global(.dark .flatpickr-day.today) {
		border-color: var(--color-primary-400);
		color: var(--color-primary-400);
	}

	:global(.dark .flatpickr-day.today:hover) {
		background-color: rgba(59, 130, 246, 0.2);
		border-color: var(--color-primary-400);
	}

	/* Mejorar contraste de días del mes en dark mode */
	:global(.dark .flatpickr-day) {
		color: var(--color-text-primary);
	}

	:global(.dark .flatpickr-day:hover) {
		background-color: rgba(55, 65, 81, 0.5); /* gray-700 con transparencia */
	}

	/* Dark mode - shadow más sutil */
	:global(.dark .flatpickr-calendar) {
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.5),
			0 4px 6px -2px rgba(0, 0, 0, 0.3);
	}

	/* Arrow buttons */
	:global(.flatpickr-months .flatpickr-prev-month),
	:global(.flatpickr-months .flatpickr-next-month) {
		fill: white;
	}

	:global(.flatpickr-months .flatpickr-prev-month:hover),
	:global(.flatpickr-months .flatpickr-next-month:hover) {
		background-color: rgba(255, 255, 255, 0.1);
	}
</style>
