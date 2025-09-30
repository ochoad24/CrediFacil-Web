<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Input, Card, CardContent, ThemeToggle } from '$lib/components/ui';
	import { goto } from '$app/navigation';
	import { withLoading } from '$lib/utils/loading';
	import { loadingStore } from '$lib/stores/loading';
	import { redirectIfAuthenticated } from '$lib/utils/auth-guard';
	import { toast } from '$lib/utils/toast';

	let form = {
		username: '',
		password: ''
	};

	let errors = {
		username: '',
		password: ''
	};

	let showPassword = false;
	let isLoading = false;

	// Redirigir si ya está autenticado (el tema se inicializa en el layout)
	onMount(() => {
		redirectIfAuthenticated();
	});

	// Validación simple
	function validateForm(): boolean {
		errors = { username: '', password: '' };
		let isValid = true;

		if (!form.username) {
			errors.username = 'El usuario es requerido';
			isValid = false;
		} else if (form.username.length < 3) {
			errors.username = 'El usuario debe tener al menos 3 caracteres';
			isValid = false;
		}

		if (!form.password) {
			errors.password = 'La contraseña es requerida';
			isValid = false;
		} else if (form.password.length < 6) {
			errors.password = 'La contraseña debe tener al menos 6 caracteres';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validateForm()) return;

		isLoading = true;

		try {
			await withLoading(
				async () => {
					const { authStore } = await import('$lib/stores/auth');

					const response = await authStore.login({
						username: form.username,
						password: form.password
					});

					// Mostrar toast de bienvenida personalizado
					const userName = response?.user?.name || form.username;
					toast.success(`¡Bienvenido de vuelta, ${userName}! Has iniciado sesión exitosamente.`);

					// Redirigir a la URL solicitada o al dashboard
					const urlParams = new URLSearchParams(window.location.search);
					const returnUrl = urlParams.get('returnUrl') || '/';

					// Pequeño delay para que se vea el toast antes de redirigir
					setTimeout(() => {
						goto(returnUrl);
					}, 500);
				},
				'Iniciando sesión...',
				'Redirigiendo...'
			);
		} catch (error) {
			console.error('Login failed:', error);

			// Mostrar toast de error y también mantener errores en campos
			let errorMessage = 'Error de conexión. Intenta nuevamente.';

			if (error && typeof error === 'object' && 'message' in error) {
				errorMessage = error.message as string;

				// Si es error de credenciales, mostrar en el campo de contraseña
				if (errorMessage.toLowerCase().includes('credencial')) {
					errors.password = errorMessage;
					toast.error('Credenciales incorrectas. Por favor verifica tu usuario y contraseña.');
				} else {
					errors.username = errorMessage;
					toast.error('Error al iniciar sesión. ' + errorMessage);
				}
			} else {
				errors.username = errorMessage;
				toast.error('Error de conexión. No se pudo establecer comunicación con el servidor.');
			}
		} finally {
			isLoading = false;
		}
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<svelte:head>
	<title>Iniciar Sesión - CrediFacil</title>
</svelte:head>

<div
	class="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8 transition-colors"
>
	<!-- Theme Toggle - Position Fixed -->
	<div class="fixed top-4 right-4 z-50">
		<ThemeToggle />
	</div>

	<div class="max-w-md w-full space-y-8">
		<!-- Header -->
		<div class="text-center">
			<div
				class="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-xl"
			>
				<span class="text-3xl font-bold text-white">C</span>
			</div>
			<h1 class="mt-8 text-4xl font-bold text-foreground transition-colors">
				Bienvenido de vuelta
			</h1>
			<p class="mt-3 text-base text-muted-foreground transition-colors">
				Inicia sesión en tu cuenta
			</p>
		</div>

		<!-- Form Card -->
		<Card
			className="bg-surface/90 backdrop-blur-sm shadow-2xl border border-border transition-colors"
		>
			<CardContent className="p-8 space-y-6">
				<form on:submit={handleSubmit} class="space-y-6">
					<!-- Username Field -->
					<Input
						bind:value={form.username}
						type="text"
						label="Usuario"
						placeholder="Ingresa tu usuario"
						error={errors.username}
					/>

					<!-- Password Field -->
					<div class="relative">
						<Input
							bind:value={form.password}
							type={showPassword ? 'text' : 'password'}
							label="Contraseña"
							placeholder="Ingresa tu contraseña"
							className="pr-12"
							error={errors.password}
						/>
						<button
							type="button"
							class="absolute top-8 right-0 pr-3 h-10 flex items-center hover:bg-muted rounded-r-lg transition-colors"
							on:click={togglePasswordVisibility}
							title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
						>
							{#if showPassword}
								<svg
									class="h-5 w-5 text-muted-foreground hover:text-primary-600 transition-colors"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
									/>
								</svg>
							{:else}
								<svg
									class="h-5 w-5 text-muted-foreground hover:text-primary-600 transition-colors"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
									/>
								</svg>
							{/if}
						</button>
					</div>

					<!-- Submit Button -->
					<Button
						type="submit"
						variant="primary"
						size="lg"
						disabled={isLoading || $loadingStore.isVisible}
						loading={isLoading || $loadingStore.isVisible}
						className="w-full rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
					>
						{isLoading || $loadingStore.isVisible ? 'Iniciando sesión...' : 'Iniciar Sesión'}
					</Button>
				</form>
			</CardContent>
		</Card>
	</div>
</div>
