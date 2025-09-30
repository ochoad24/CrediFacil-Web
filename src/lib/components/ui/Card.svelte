<script lang="ts">
	import { cn } from '$lib/utils/cn';

	export let className: string = '';

	$: cardClasses = cn('bg-surface rounded-lg shadow-md border border-border', className);
</script>

<div class={cardClasses}>
	<slot />
</div>
