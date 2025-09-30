<script lang="ts">
	import { cn } from '$lib/utils/cn';

	export let variant:
		| 'default'
		| 'secondary'
		| 'destructive'
		| 'outline'
		| 'success'
		| 'warning'
		| 'info'
		| 'success-soft'
		| 'warning-soft'
		| 'info-soft' = 'default';
	export let className: string = '';

	const badgeVariants = {
		default: 'border-transparent bg-primary-500 text-white hover:bg-primary-600',
		secondary: 'border-transparent bg-secondary-400 text-white hover:bg-secondary-500',
		destructive: 'border-transparent bg-error-500 text-white hover:bg-error-600',
		outline: 'text-neutral-800 border-neutral-300',
		success: 'border-transparent bg-success-500 text-white hover:bg-success-600',
		warning: 'border-transparent bg-warning-500 text-white hover:bg-warning-600',
		info: 'border-transparent bg-primary-400 text-white hover:bg-primary-500',
		'success-soft': 'border-transparent bg-success-100 text-success-800 hover:bg-success-200',
		'warning-soft': 'border-transparent bg-warning-100 text-warning-800 hover:bg-warning-200',
		'info-soft': 'border-transparent bg-primary-100 text-primary-800 hover:bg-primary-200'
	};

	$: badgeClasses = cn(
		'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-focus-primary focus:ring-offset-2',
		badgeVariants[variant],
		className
	);
</script>

<div class={badgeClasses}>
	<slot />
</div>
