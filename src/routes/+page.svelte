<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { user } from '$lib/stores/auth';
	import Card from '$lib/components/ui/Card.svelte';
	import CardContent from '$lib/components/ui/CardContent.svelte';
	import CardHeader from '$lib/components/ui/CardHeader.svelte';
	import { cn } from '$lib/utils/cn';

	// State for current time
	let currentTime = '';
	let currentDate = '';

	// Update time every minute
	onMount(() => {
		const updateTime = () => {
			const now = new Date();
			currentTime = now.toLocaleTimeString('es-ES', {
				hour: '2-digit',
				minute: '2-digit'
			});
			currentDate = now.toLocaleDateString('es-ES', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		};

		updateTime();
		const interval = setInterval(updateTime, 60000);
		return () => clearInterval(interval);
	});

	// Functions
	const getGreeting = () => {
		const currentHour = new Date().getHours();
		if (currentHour < 12) return 'Buenos días';
		if (currentHour < 18) return 'Buenas tardes';
		return 'Buenas noches';
	};

	// Stats configuration
	const stats = [
		{
			icon: 'users',
			title: 'Plataforma Integral',
			description: 'Sistema completo de gestión financiera con todas las herramientas necesarias',
			color: 'blue'
		},
		{
			icon: 'chart-bar',
			title: 'Gestión Financiera',
			description: 'Herramientas avanzadas para el manejo y seguimiento de créditos',
			color: 'green'
		},
		{
			icon: 'user-group',
			title: 'Seguridad Avanzada',
			description: 'Protección de datos con los más altos estándares de seguridad',
			color: 'purple'
		}
	];

	// Icon paths
	function getIconSVG(iconName: string): string {
		const icons: Record<string, string> = {
			users:
				'<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />',
			'chart-bar':
				'<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />',
			'user-group':
				'<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />',
			sparkles:
				'<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />',
			heart:
				'<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />'
		};
		return icons[iconName] || icons.users;
	}
</script>

<svelte:head>
	<title>Inicio - CrediFacil</title>
</svelte:head>

<div class="space-y-4 sm:space-y-6 lg:space-y-8" in:fly={{ y: 20, duration: 500 }}>
	<!-- Hero Section -->
	<Card className="relative overflow-hidden">
		<div
			class="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-600 to-primary-800 opacity-90"
		></div>
		<div class="relative p-4 sm:p-6 md:p-8 lg:p-12 text-white">
			<div
				class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6"
				in:fly={{ x: -20, delay: 200, duration: 500 }}
			>
				<svg
					class="w-6 h-6 sm:w-8 sm:h-8 text-primary-200 flex-shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					{@html getIconSVG('sparkles')}
				</svg>
				<div class="flex-1 min-w-0">
					<h1 class="text-2xl sm:text-3xl md:text-4xl font-bold break-words">
						{getGreeting()}, {$user?.name || 'Usuario'}!
					</h1>
					<p class="text-primary-100 text-base sm:text-lg mt-1 sm:mt-2">
						Bienvenido a tu plataforma de gestión financiera
					</p>
				</div>
			</div>

			<div
				class="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/20"
				in:fly={{ x: -20, delay: 400, duration: 500 }}
			>
				<div class="flex items-start space-x-3 mb-3">
					<svg
						class="w-5 h-5 sm:w-6 sm:h-6 text-red-300 flex-shrink-0 mt-0.5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						{@html getIconSVG('heart')}
					</svg>
					<h2 class="text-lg sm:text-xl font-semibold">Bienvenido al Sistema</h2>
				</div>
				<p class="text-primary-50 leading-relaxed text-sm sm:text-base">
					CrediFacil es tu plataforma integral para la gestión de créditos y servicios financieros.
					Aquí encontrarás todas las herramientas necesarias para administrar de manera eficiente
					tus operaciones crediticias.
				</p>
			</div>
		</div>
	</Card>

	<!-- Stats Cards -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
		{#each stats as stat, index (stat.title)}
			<div in:fly={{ y: 20, delay: 600 + index * 100, duration: 500 }}>
				<Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200 h-full">
					<div class="flex items-start space-x-3 sm:space-x-4">
						<div
							class={cn(
								'p-2 sm:p-3 rounded-lg flex-shrink-0',
								stat.color === 'blue' ? 'bg-blue-100 text-blue-600' : '',
								stat.color === 'green' ? 'bg-green-100 text-green-600' : '',
								stat.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''
							)}
						>
							<svg
								class="w-5 h-5 sm:w-6 sm:h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{@html getIconSVG(stat.icon)}
							</svg>
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="font-semibold text-foreground mb-1 text-sm sm:text-base break-words">
								{stat.title}
							</h3>
							<p class="text-muted-foreground text-xs sm:text-sm leading-relaxed">
								{stat.description}
							</p>
						</div>
					</div>
				</Card>
			</div>
		{/each}
	</div>

	<!-- System Info -->
	<Card className="p-4 sm:p-6">
		<div in:fly={{ y: 20, delay: 800, duration: 500 }}>
			<h2 class="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">
				Información del Sistema
			</h2>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
				<div>
					<h3 class="font-medium text-foreground mb-2 text-sm sm:text-base">
						Información del Usuario
					</h3>
					<div class="space-y-2 text-xs sm:text-sm">
						<div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
							<span class="text-muted-foreground font-medium sm:font-normal">Nombre:</span>
							<span class="text-foreground font-medium break-words">
								{$user?.name || 'No disponible'}
							</span>
						</div>
						<div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
							<span class="text-muted-foreground font-medium sm:font-normal">Usuario:</span>
							<span class="text-foreground font-medium break-all">
								{$user?.username || 'No disponible'}
							</span>
						</div>
					</div>
				</div>
				<div>
					<h3 class="font-medium text-foreground mb-2 text-sm sm:text-base">Datos del Sistema</h3>
					<div class="space-y-2 text-xs sm:text-sm">
						<div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
							<span class="text-muted-foreground font-medium sm:font-normal">Fecha actual:</span>
							<span class="text-foreground font-medium break-words">
								{currentDate}
							</span>
						</div>
						<div class="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
							<span class="text-muted-foreground font-medium sm:font-normal">Hora actual:</span>
							<span class="text-foreground font-medium">
								{currentTime}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Card>
</div>
