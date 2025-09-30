<script lang="ts">
	import { cn } from '$lib/utils/cn';

	export let variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'warning' | 'destructive' =
		'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let className: string = '';
	export let loading: boolean = false;
	export let disabled: boolean = false;
	export let type: 'button' | 'submit' | 'reset' = 'button';

	const buttonVariants = {
		primary:
			'bg-primary-600 text-button-inverse shadow-md hover:shadow-lg hover:bg-primary-700 focus-visible:ring-primary-500',
		secondary:
			'bg-neutral-600 text-button-inverse hover:bg-neutral-700 focus-visible:ring-neutral-500',
		outline:
			'border border-border bg-surface text-secondary hover:bg-muted focus-visible:ring-primary-500',
		ghost: 'text-secondary hover:bg-muted focus-visible:ring-primary-500',
		warning: 'bg-warning-500 text-button-inverse hover:bg-warning-600 focus-visible:ring-warning-500',
		destructive: 'bg-error-500 text-button-inverse hover:bg-error-600 focus-visible:ring-error-500'
	};

	const sizeVariants = {
		sm: 'h-9 px-3 py-1 text-sm',
		md: 'h-12 px-4 py-2 text-base',
		lg: 'h-14 px-6 py-3 text-lg'
	};

	$: buttonClasses = cn(
		'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
		buttonVariants[variant],
		sizeVariants[size],
		className
	);

	$: isDisabled = disabled || loading;
</script>

<button class={buttonClasses} {type} disabled={isDisabled} on:click {...$$restProps}>
	{#if loading}
		<div class="flex items-center">
			<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
			<slot />
		</div>
	{:else}
		<slot />
	{/if}
</button>
