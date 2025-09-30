<script lang="ts">
	import { cn } from '$lib/utils/cn';

	export let className: string = '';

	$: contentClasses = cn('p-6 text-gray-900', className);
</script>

<div class={contentClasses}>
	<slot />
</div>
