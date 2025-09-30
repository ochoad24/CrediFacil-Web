<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import type { Toast } from '$lib/stores/toast';

	export let toast: Toast;
	export let onRemove: (id: string) => void;

	// Toast type styles with theme variables
	const typeStyles = {
		success: {
			bg: 'bg-surface/95 backdrop-blur-sm border border-green-500/30 shadow-lg',
			text: 'text-foreground',
			icon: 'text-green-600 dark:text-green-400',
			accent: 'bg-green-500/10 dark:bg-green-400/10'
		},
		error: {
			bg: 'bg-surface/95 backdrop-blur-sm border border-red-500/30 shadow-lg',
			text: 'text-foreground',
			icon: 'text-red-600 dark:text-red-400',
			accent: 'bg-red-500/10 dark:bg-red-400/10'
		},
		warning: {
			bg: 'bg-surface/95 backdrop-blur-sm border border-yellow-500/30 shadow-lg',
			text: 'text-foreground',
			icon: 'text-yellow-600 dark:text-yellow-400',
			accent: 'bg-yellow-500/10 dark:bg-yellow-400/10'
		},
		info: {
			bg: 'bg-surface/95 backdrop-blur-sm border border-blue-500/30 shadow-lg',
			text: 'text-foreground',
			icon: 'text-blue-600 dark:text-blue-400',
			accent: 'bg-blue-500/10 dark:bg-blue-400/10'
		}
	};

	// Icons for each toast type
	const typeIcons = {
		success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
		warning:
			'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z',
		info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
	};

	$: styles = typeStyles[toast.type];
	$: iconPath = typeIcons[toast.type];

	function handleRemove() {
		onRemove(toast.id);
	}
</script>

<div
	class={cn(
		'relative flex items-start gap-3 p-4 rounded-xl border-l-4 overflow-hidden',
		'max-w-md min-w-[320px] transition-all duration-300 hover:scale-[1.02]',
		styles.bg
	)}
	transition:fly={{ x: 300, duration: 300 }}
>
	<!-- Accent background -->
	<div class={cn('absolute inset-0 rounded-xl', styles.accent)}></div>

	<!-- Content wrapper -->
	<div class="relative flex items-start gap-3 w-full">
		<!-- Icon -->
		<div class="flex-shrink-0 mt-0.5">
			<div class={cn('w-8 h-8 rounded-full flex items-center justify-center', styles.accent)}>
				<svg
					class={cn('w-5 h-5', styles.icon)}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={iconPath} />
				</svg>
			</div>
		</div>

		<!-- Message -->
		<div class="flex-1 min-w-0">
			<p class={cn('text-sm font-medium leading-relaxed break-words', styles.text)}>
				{toast.message}
			</p>
		</div>

		<!-- Close button -->
		{#if toast.dismissible}
			<button
				type="button"
				class={cn(
					'flex-shrink-0 p-1.5 rounded-full transition-all duration-200',
					'hover:bg-border/50 active:scale-95',
					styles.icon
				)}
				on:click={handleRemove}
				aria-label="Cerrar notificación"
				title="Cerrar"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		{/if}
	</div>

	<!-- Progress bar (optional visual indicator) -->
	{#if toast.duration && toast.duration > 0}
		<div class="absolute bottom-0 left-0 right-0 h-1 bg-border/30 rounded-b-xl overflow-hidden">
			<div
				class={cn(
					'h-full transition-all linear',
					styles.icon.replace('text-', 'bg-'),
					'opacity-80'
				)}
				style="animation: toast-progress {toast.duration}ms linear forwards;"
			></div>
		</div>
	{/if}
</div>

<style>
	@keyframes toast-progress {
		from {
			width: 100%;
		}
		to {
			width: 0%;
		}
	}
</style>
