<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { authStore, user } from '$lib/stores/auth';
	import { cn } from '$lib/utils/cn';
	import { browser } from '$app/environment';
	import { themeStore } from '$lib/stores/cookies';
	import {
		House,
		Users,
		CreditCard,
		ChartArea,
		ChevronLeft,
		ChevronRight,
		LogOut,
		Sun,
		Moon,
		Monitor,
		Layers
	} from '@lucide/svelte';
	import type { SvelteComponent } from 'svelte';

	// Props
	export let className: string = '';

	// State
	let isCollapsed = false;
	let isMobileMenuOpen = false;
	let isMobile = false;
	let currentThemeValue = 'auto';

	// Check if mobile on mount and handle events
	onMount(() => {
		if (browser) {
			const checkMobile = () => {
				isMobile = window.innerWidth < 1024;
				if (isMobile) {
					isCollapsed = true;
					isMobileMenuOpen = false;
				}
			};

			// Initial check
			checkMobile();

			// Handle window resize
			const handleResize = () => {
				const wasMobile = isMobile;
				isMobile = window.innerWidth < 1024;

				if (isMobile && !wasMobile) {
					// Just became mobile
					isCollapsed = true;
					isMobileMenuOpen = false;
				} else if (!isMobile && wasMobile) {
					// Just became desktop
					isMobileMenuOpen = false;
					isCollapsed = false;
				}
			};

			// Handle mobile sidebar toggle event
			const handleMobileSidebarToggle = () => {
				if (isMobile) {
					toggleCollapsed();
				}
			};

			window.addEventListener('resize', handleResize);
			document.addEventListener('toggle-mobile-sidebar', handleMobileSidebarToggle);

			return () => {
				window.removeEventListener('resize', handleResize);
				document.removeEventListener('toggle-mobile-sidebar', handleMobileSidebarToggle);
			};
		}
	});

	// Theme management
	onMount(() => {
		if (browser) {
			// Subscribe to theme changes and update local state
			const unsubscribe = themeStore.subscribe((theme) => {
				currentThemeValue = theme || 'auto';
			});

			return unsubscribe;
		}
	});

	// Menu items configuration
	interface MenuItem {
		key: string;
		href: string;
		icon: any;
		label: string;
		badge?: string;
		permissions?: string | string[];
	}

	const menuItems: MenuItem[] = [{
			key: 'home',
			href: '/',
			icon: House,
			label: 'Inicio'
		},
		{
			key: 'users',
			href: '/users',
			icon: Users,
			label: 'Usuarios'
		},
		{
			key: 'credits',
			href: '/credits',
			icon: CreditCard,
			label: 'Créditos'
		},
		{
			key: 'clients',
			href: '/clients',
			icon: Users, // Using Users icon for clients as well
			label: 'Clientes'
		},
		{
			key: 'reports',
			href: '/reports',
			icon: ChartArea,
			label: 'Reportes'
		},
		{
			key: 'roles',
			href: '/roles',
			icon: Layers,
			label: 'Roles'
		},
		{
			key: 'companytypes',
			href: '/companytypes',
			icon: Layers,
			label: 'Tipo de empresas'
		},
];

	// Reactive statements
	$: currentPath = $page.url.pathname;
	$: sidebarWidth = isCollapsed ? '80px' : '280px';
	$: showOverlay = isMobile && isMobileMenuOpen;

	// Reactive para forzar actualización de elementos activos
	$: activeItems = menuItems.map((item) => ({
		...item,
		active: isActive(item.href, currentPath) // Pasar currentPath explícitamente
	}));

	// Functions
	function toggleCollapsed() {
		if (isMobile) {
			isMobileMenuOpen = !isMobileMenuOpen;
			isCollapsed = !isMobileMenuOpen;
			// Handle body scroll
			if (browser) {
				document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
			}
		} else {
			isCollapsed = !isCollapsed;
		}
	}

	function closeMobileMenu() {
		if (isMobile) {
			isMobileMenuOpen = false;
			isCollapsed = true;
			// Re-enable body scroll
			if (browser) {
				document.body.style.overflow = '';
			}
		}
	}

	// Theme functions
	function toggleTheme() {
		const themes = ['light', 'dark', 'auto'] as const;
		const currentIndex = themes.indexOf(currentThemeValue as any);
		const nextIndex = (currentIndex + 1) % themes.length;
		const nextTheme = themes[nextIndex];
		console.log(
			`🎨 Cambiando tema: ${getThemeLabel(currentThemeValue)} → ${getThemeLabel(nextTheme)}`
		);
		themeStore.set(nextTheme);
	}

	function getThemeIconComponent(theme: string): any {
		switch (theme) {
			case 'light':
				return Sun;
			case 'dark':
				return Moon;
			case 'auto':
			default:
				return Monitor;
		}
	}

	// Get theme label
	function getThemeLabel(theme: string): string {
		switch (theme) {
			case 'light':
				return 'Claro';
			case 'dark':
				return 'Oscuro';
			case 'auto':
				return 'Auto';
			default:
				return 'Auto';
		}
	}

	// Handle body scroll when mobile menu is open
	$: if (browser) {
		if (isMobile && isMobileMenuOpen) {
			// Prevent body scroll when mobile menu is open
			document.body.style.overflow = 'hidden';
		} else {
			// Re-enable body scroll
			document.body.style.overflow = '';
		}
	}

	function isActive(href: string, path: string): boolean {
		if (href === '/') {
			// Para la ruta raíz, debe coincidir exactamente
			return path === '/';
		}

		// Para otras rutas, verificar coincidencias más específicas
		const pathSegments = path.split('/').filter((segment) => segment !== '');
		const hrefSegments = href.split('/').filter((segment) => segment !== '');

		// Si href es más larga que la ruta actual, no puede ser activa
		if (hrefSegments.length > pathSegments.length) {
			return false;
		}

		// Verificar que todos los segmentos de href coincidan con los de currentPath
		return hrefSegments.every((segment, index) => pathSegments[index] === segment);
	}

	async function handleLogout() {
		try {
			await authStore.logout();
			goto('/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}
</script>

<div
	class={cn(
		'fixed left-0 top-0 h-full border-r shadow-xl flex flex-col transition-all duration-300 ease-in-out',
		'bg-surface border-border',
		'min-w-[80px] max-w-[320px]',
		isMobile ? 'z-[50]' : 'z-40',
		isMobile && !isMobileMenuOpen ? '-translate-x-full' : 'translate-x-0',
		className
	)}
	style="width: {sidebarWidth}"
>
	<!-- Header -->
	<div class="flex items-center justify-between p-4 border-b border-border">
		{#if !isCollapsed}
			<div class="flex items-center space-x-3" in:fly={{ opacity: 0, duration: 200 }} out:fly={{ opacity: 0, duration: 150 }}>
				<div
					class="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-md"
				>
					<span class="text-xl font-bold text-white">C</span>
				</div>
				<div>
					<h2 class="text-lg font-bold text-foreground">CrediFacil</h2>
					<p class="text-xs text-muted-foreground">Financial Platform</p>
				</div>
			</div>
		{/if}

		<button on:click={toggleCollapsed} class="p-1.5 rounded-xl transition-colors hover:bg-muted">
			{#if isCollapsed}
				<ChevronRight class="w-5 h-5 text-muted-foreground" />
			{:else}
				<ChevronLeft class="w-5 h-5 text-muted-foreground" />
			{/if}
		</button>
	</div>

	<!-- User Info -->
	<div class="p-4 border-b border-border">
		<div class="flex items-center space-x-3">
			<div
				class="h-10 w-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center"
			>
				<span class="text-sm font-medium text-white">
					{$user?.name?.charAt(0).toUpperCase() || 'U'}
				</span>
			</div>
			{#if !isCollapsed}
				<div class="flex-1 min-w-0" in:fly={{ opacity: 0, x: -10, duration: 200 }} out:fly={{ opacity: 0, x: -10, duration: 150 }}>
					<p class="text-sm font-medium truncate text-foreground">
						{$user?.name || 'Usuario'}
					</p>
					<p class="text-xs truncate text-muted-foreground">
						{$user?.username || 'user'}
					</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 p-4 space-y-1">
		{#each activeItems as item (item.key)}
			<a
				href={item.href}
				on:click={closeMobileMenu}
				class={cn(
					'flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
					item.active
						? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary-500/25 dark:from-primary-600 dark:to-primary-700 dark:shadow-primary-600/20'
						: 'hover:bg-muted',
					isCollapsed && 'justify-center'
				)}
			>
				<svelte:component
					this={item.icon}
					class={cn(
						'w-5 h-5 transition-all duration-300 flex-shrink-0',
						item.active
							? 'text-white drop-shadow-sm'
							: 'text-muted-foreground group-hover:text-primary-600 group-hover:scale-110 dark:group-hover:text-primary-400'
					)}
					stroke-width="1.5"
				/>

				{#if !isCollapsed}
					<div
						class="flex items-center justify-between flex-1"
						in:fly={{ opacity: 0, x: -10, duration: 200 }}
						out:fly={{ opacity: 0, x: -10, duration: 150 }}
					>
						<span
							class={cn(
								'text-sm font-medium transition-colors duration-300',
								item.active
									? 'text-white font-semibold drop-shadow-sm'
									: 'text-foreground group-hover:text-primary-700 dark:group-hover:text-primary-300'
							)}
						>
							{item.label}
						</span>
						{#if item.badge}
							<span
								class="px-2 py-1 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-md font-medium"
							>
								{item.badge}
							</span>
						{/if}
					</div>
				{/if}
			</a>
		{/each}
	</nav>

	<!-- Footer with Theme Toggle and Logout -->
	<div class="p-4 border-t border-border space-y-3">
		<!-- Theme Toggle -->
		<div class={cn('flex items-center', isCollapsed ? 'justify-center' : 'space-x-3')}>
			{#if !isCollapsed}
				<div class="flex items-center space-x-2" in:fly={{ opacity: 0, duration: 200 }} out:fly={{ opacity: 0, duration: 150 }}>
					<span class="text-sm font-medium text-foreground">Tema:</span>
					<span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
						{getThemeLabel(currentThemeValue)}
					</span>
				</div>
			{/if}
			<button
				class="p-1.5 rounded-lg transition-colors hover:bg-muted flex-shrink-0"
				aria-label="Cambiar tema: {getThemeLabel(currentThemeValue)}"
				title="Cambiar tema: {getThemeLabel(currentThemeValue)}"
				on:click={toggleTheme}
			>
				<svelte:component
					this={getThemeIconComponent(currentThemeValue)}
					class="w-5 h-5 text-muted-foreground"
					stroke-width="2"
				/>
			</button>
		</div>

		<!-- Logout Button -->
		<button
			on:click={handleLogout}
			class={cn(
				'flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl transition-all duration-300 group relative',
				'border border-transparent',
				'text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:border-red-200/50 hover:shadow-md hover:text-red-700',
				'dark:hover:from-red-950/50 dark:hover:to-red-900/50 dark:hover:border-red-800/30 dark:hover:shadow-red-900/10 dark:hover:text-red-300',
				'transform hover:scale-[1.02] active:scale-[0.98]',
				isCollapsed && 'justify-center'
			)}
		>
			<LogOut
				class="w-5 h-5 transition-all duration-300 group-hover:scale-110 flex-shrink-0"
				stroke-width="1.5"
			/>
			{#if !isCollapsed}
				<span
					class="text-sm font-medium transition-colors duration-300"
					in:fly={{ opacity: 0, x: -10, duration: 200 }}
					out:fly={{ opacity: 0, x: -10, duration: 150 }}
				>
					Cerrar Sesión
				</span>
			{/if}
		</button>

		<!-- App Version -->
		{#if !isCollapsed}
			<div
				class="text-xs text-muted-foreground text-center"
				in:fly={{ opacity: 0, duration: 200 }}
				out:fly={{ opacity: 0, duration: 150 }}
			>
				CrediFacil v1.0.0
			</div>
		{/if}
	</div>
</div>

<!-- Mobile Overlay -->
{#if showOverlay}
	<div
		class="fixed inset-0 bg-black/60 z-[45] backdrop-blur-sm"
		on:click={closeMobileMenu}
		on:keydown={(e) => e.key === 'Escape' && closeMobileMenu()}
		aria-hidden="true"
		role="button"
		tabindex="0"
		in:fly={{ opacity: 0, duration: 300 }}
		out:fly={{ opacity: 0, duration: 200 }}
	></div>
{/if}
