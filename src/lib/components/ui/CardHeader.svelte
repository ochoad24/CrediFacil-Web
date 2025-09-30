<script lang="ts">
	import { cn } from '$lib/utils/cn';

	export let className: string = '';

	$: headerClasses = cn('p-card-md pb-0', className);
</script>

<div class={headerClasses}>
	<slot />
</div>
