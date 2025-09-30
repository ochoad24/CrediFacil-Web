<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { browser } from '$app/environment';

	export let value: string = '';
	export let placeholder: string = '';
	export let error: string = '';
	export let label: string = '';
	export let className: string = '';
	export let disabled: boolean = false;
	export let autofocus: boolean = false;
	export let tabindex: number | undefined = undefined;
	export let rows: number = 4;
	export let resize: 'none' | 'both' | 'horizontal' | 'vertical' = 'vertical';
	export let required: boolean = false;
	export let id: string = '';

	// Prevenir hydration mismatch - solo mostrar error después de hidratación
	$: showError = browser && error;

	$: textareaClasses = cn(
		'w-full px-3 py-2 border rounded-md bg-surface text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-muted disabled:text-muted-foreground transition-colors',
		showError ? 'border-red-500 focus:ring-red-500' : 'border-border',
		resize === 'none' ? 'resize-none' : resize === 'both' ? 'resize' : resize === 'horizontal' ? 'resize-x' : 'resize-y',
		className
	);
</script>

<div class="w-full">
	{#if label}
		<label class="block text-sm font-medium text-foreground mb-2">
			{label}
		</label>
	{/if}
	<textarea
		bind:value
		{placeholder}
		{disabled}
		{autofocus}
		{required}
		{id}
		tabindex={tabindex}
		{rows}
		class={textareaClasses}
		on:input
		on:change
		on:focus
		on:blur
		{...$$restProps}
	></textarea>
	{#if showError}
		<p class="mt-1 text-sm text-red-600">{error}</p>
	{/if}
</div>
