<script lang="ts">
	import { toastStore } from '$lib/stores/toast';
	import Toast from './Toast.svelte';

	$: toasts = $toastStore.toasts;

	function handleRemove(id: string) {
		toastStore.removeToast(id);
	}
</script>

<!-- Toast Container - Fixed positioning -->
{#if toasts.length > 0}
	<div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full">
		{#each toasts as toast (toast.id)}
			<div class="pointer-events-auto transform transition-all duration-300">
				<Toast {toast} onRemove={handleRemove} />
			</div>
		{/each}
	</div>
{/if}
