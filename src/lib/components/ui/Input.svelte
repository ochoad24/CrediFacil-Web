<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { browser } from '$app/environment';

	export let value: string = '';
	export let type: string = 'text';
	export let placeholder: string = '';
	export let error: string = '';
	export let label: string = '';
	export let className: string = '';
	export let disabled: boolean = false;
	export let autofocus: boolean = false;
	export let tabindex: number | undefined = undefined;
	export let id: string = '';

	// Generate unique ID if not provided
	const uniqueId = id || `input-${Math.random().toString(36).substring(2, 11)}`;

	// Prevenir hydration mismatch - solo mostrar error después de hidratación
	$: showError = browser && error;

	$: inputClasses = cn(
		'w-full px-3 py-2 border rounded-md bg-surface text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-muted disabled:text-muted-foreground transition-colors',
		showError ? 'border-red-500 focus:ring-red-500' : 'border-border',
		className
	);
</script>

<div class="w-full">
	{#if label}
		<label for={uniqueId} class="block text-sm font-medium text-foreground mb-2">
			{label}
		</label>
	{/if}
	<input
		id={uniqueId}
		bind:value
		{type}
		{placeholder}
		{disabled}
		{...autofocus ? { autofocus: true } : {}}
		tabindex={tabindex}
		class={inputClasses}
		on:input
		on:change
		on:focus
		on:blur
		on:keydown
		{...$$restProps}
	/>
	{#if showError}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>
