<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import LoadingOverlay from '$lib/components/ui/LoadingOverlay.svelte';
	import ToastContainer from '$lib/components/ui/ToastContainer.svelte';
	import GlobalConfirmDialog from '$lib/components/ui/GlobalConfirmDialog.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import { authStore, isAuthenticated } from '$lib/stores/auth';
	import { requireAuth, isPublicRoute } from '$lib/utils/auth-guard';
	import { loadingStore } from '$lib/stores/loading';
	import { themeStore } from '$lib/stores/cookies';
	import { browser } from '$app/environment';

	let { children } = $props();
	let isAuthInitialized = $state(false);
	let isMobile = $state(false);

	// Handle responsive behavior
	$effect(() => {
		if (browser) {
			isMobile = window.innerWidth < 1024;
			const handleResize = () => {
				isMobile = window.innerWidth < 1024;
			};
			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
		}
	});

	// Derived state to determine if sidebar should be shown
	const shouldShowSidebar = $derived($isAuthenticated && !isPublicRoute($page.url.pathname));

	// Initialize authentication, theme, and route protection
	onMount(async () => {
		// Initialize theme system first (should be fast)
		themeStore.init();

		// Mostrar loading durante la verificación de auth
		loadingStore.show('Verificando autenticación...');

		try {
			// Dar más tiempo para que las cookies estén disponibles
			await new Promise((resolve) => setTimeout(resolve, 200));

			// Siempre verificar el estado de autenticación primero
			await authStore.checkAuth();

			// Delay adicional para asegurar que el store esté actualizado
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Aplicar protección de rutas solo en el cliente
			const currentPath = $page.url.pathname;
			if (!isPublicRoute(currentPath)) {
				await requireAuth();
			}

			// Marcar como inicializado
			isAuthInitialized = true;
		} catch (error) {
			console.error('Error during auth initialization:', error);
			isAuthInitialized = true;
		} finally {
			// Ocultar loading
			loadingStore.hide();
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isAuthInitialized}
	{#if shouldShowSidebar}
		<!-- Layout with Sidebar for authenticated pages -->
		<div class="flex h-screen bg-background relative">
			<Sidebar />
			<main
				class="flex-1 min-w-0 overflow-auto transition-all duration-300"
				class:lg:ml-80={!isMobile}
			>
				<!-- Mobile Menu Toggle Button (Fixed Position) -->
				<button
					class="lg:hidden fixed top-4 right-4 z-50 p-3 bg-surface border border-border rounded-xl shadow-lg hover:bg-muted transition-all duration-200 backdrop-blur-sm"
					aria-label="Abrir menú"
					onclick={() => document.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
				>
					<svg
						class="w-6 h-6 text-text-secondary"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
				<div class="p-3 sm:p-4 md:p-6 lg:p-8 relative z-10">
					{@render children?.()}
				</div>
			</main>
		</div>
	{:else}
		<!-- Layout without Sidebar for public pages (login, register, etc.) -->
		<div class="min-h-screen bg-background">
			{@render children?.()}
		</div>
	{/if}
{:else}
	<!-- Mostrar un fallback mínimo mientras se inicializa -->
	<div class="min-h-screen bg-background"></div>
{/if}

<!-- Global Loading Overlay -->
<LoadingOverlay />

<!-- Global Toast Container -->
<ToastContainer />

<!-- Global Confirmation Dialog -->
<GlobalConfirmDialog />
