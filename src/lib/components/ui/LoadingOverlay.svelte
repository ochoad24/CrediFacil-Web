<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { loadingStore } from '$lib/stores/loading';

	// Props para uso directo (mantener compatibilidad)
	export let isVisible: boolean | undefined = undefined;
	export let message: string | undefined = undefined;

	// Si no se pasan props, usar el store global
	$: finalIsVisible = isVisible !== undefined ? isVisible : $loadingStore.isVisible;
	$: finalMessage = message !== undefined ? message : $loadingStore.message;
</script>

{#if finalIsVisible}
	<div
		class={cn(
			'fixed inset-0 z-[9999] bg-gray-900/50 dark:bg-gray-900/80 backdrop-blur-sm',
			'flex items-center justify-center'
		)}
	>
		<div class="bg-background rounded-lg p-8 shadow-2xl max-w-sm w-full mx-4 border border-border">
			<div class="flex flex-col items-center space-y-4">
				<!-- Spinner -->
				<div class="relative">
					<div
						class="w-12 h-12 border-4 border-muted rounded-full animate-spin border-t-primary-600"
					></div>
				</div>

				<!-- Message -->
				<div class="text-center">
					<p class="text-foreground font-medium">{finalMessage}</p>
				</div>
			</div>
		</div>
	</div>
{/if}
