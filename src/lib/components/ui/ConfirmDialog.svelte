<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Button from './Button.svelte';
	import Card from './Card.svelte';
	import { cn } from '$lib/utils/cn';

	export let isOpen = false;
	export let title = 'Confirmar acción';
	export let message = '¿Estás seguro de que quieres continuar?';
	export let type: 'warning' | 'danger' | 'info' | 'success' = 'warning';
	export let confirmText = 'Confirmar';
	export let cancelText = 'Cancelar';
	export let loading = false;

	const dispatch = createEventDispatcher<{
		confirm: void;
		cancel: void;
		close: void;
	}>();

	const typeConfig = {
		warning: {
			iconColor: 'text-warning-600',
			iconBg: 'bg-warning-100',
			confirmVariant: 'warning' as const,
			icon: 'warning'
		},
		danger: {
			iconColor: 'text-error-600',
			iconBg: 'bg-red-100',
			confirmVariant: 'destructive' as const,
			icon: 'danger'
		},
		info: {
			iconColor: 'text-primary-600',
			iconBg: 'bg-blue-100',
			confirmVariant: 'primary' as const,
			icon: 'info'
		},
		success: {
			iconColor: 'text-success-600',
			iconBg: 'bg-green-100',
			confirmVariant: 'primary' as const,
			icon: 'success'
		}
	};

	$: config = typeConfig[type];

	function handleConfirm() {
		dispatch('confirm');
	}

	function handleCancel() {
		if (!loading) {
			dispatch('cancel');
			dispatch('close');
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget && !loading) {
			dispatch('close');
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape' && !loading) {
			dispatch('close');
		}
	}

	onMount(() => {
		if (!browser) return;

		const cleanup = () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'unset';
		};

		return cleanup;
	});

	$: if (browser) {
		if (isOpen) {
			document.addEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'hidden';
		} else {
			document.removeEventListener('keydown', handleKeyDown);
			document.body.style.overflow = 'unset';
		}
	}
</script>

{#if isOpen}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
		on:click={handleBackdropClick}
		on:keydown={(e) => e.key === 'Escape' && dispatch('close')}
		role="dialog"
		aria-modal="true"
		aria-labelledby="dialog-title"
		aria-describedby="dialog-description"
		tabindex="-1"
	>
		<!-- Dialog Content -->
		<Card className="w-full max-w-md mx-auto shadow-xl border-0 dark:border dark:border-border">
			<div class="p-6">
				<!-- Header -->
				<div class="flex items-start justify-between mb-4">
					<div class="flex items-center space-x-3">
						<div class={cn('flex items-center justify-center w-10 h-10 rounded-full', config.iconBg)}>
							{#if config.icon === 'warning'}
								<svg class={cn('w-6 h-6', config.iconColor)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
								</svg>
							{:else if config.icon === 'danger'}
								<svg class={cn('w-6 h-6', config.iconColor)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
								</svg>
							{:else if config.icon === 'info'}
								<svg class={cn('w-6 h-6', config.iconColor)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
								</svg>
							{:else if config.icon === 'success'}
								<svg class={cn('w-6 h-6', config.iconColor)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
								</svg>
							{/if}
						</div>
						<h3 class="text-lg font-semibold text-primary" id="dialog-title">
							{title}
						</h3>
					</div>
					<Button
						variant="ghost"
						size="sm"
						on:click={handleCancel}
						disabled={loading}
						className="!p-1 !h-auto"
						type="button"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Cerrar diálogo">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</Button>
				</div>

				<!-- Message -->
				{#if message}
					<div class="mb-6">
						<p class="text-secondary leading-relaxed" id="dialog-description">
							{message}
						</p>
					</div>
				{/if}

				<!-- Actions -->
				<div class="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
					<Button
						variant="outline"
						on:click={handleCancel}
						disabled={loading}
						className="w-full sm:w-auto"
					>
						{cancelText}
					</Button>
					<Button
						variant={config.confirmVariant}
						on:click={handleConfirm}
						{loading}
						className="w-full sm:w-auto"
					>
						{confirmText}
					</Button>
				</div>
			</div>
		</Card>
	</div>
{/if}