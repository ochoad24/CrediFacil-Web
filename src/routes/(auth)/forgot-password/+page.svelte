<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_NAME_COMPANY } from '$env/static/public';
	import { Button, Input, Card, CardContent, ThemeToggle } from '$lib/components/ui';
	import { goto } from '$app/navigation';
	import { redirectIfAuthenticated } from '$lib/utils/auth-guard';
	import { toast } from '$lib/utils/toast';

	let form = {
		email_or_username: ''
	};

	let errors = {
		email_or_username: ''
	};

	let isLoading = false;
	let emailSent = false;

	// Redirigir si ya está autenticado
	onMount(() => {
		redirectIfAuthenticated();
	});

	// Validación
	function validateForm(): boolean {
		errors = { email_or_username: '' };
		let isValid = true;

		if (!form.email_or_username) {
			errors.email_or_username = 'El email o usuario es requerido';
			isValid = false;
		} else if (form.email_or_username.length < 3) {
			errors.email_or_username = 'Debe tener al menos 3 caracteres';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validateForm()) return;

		isLoading = true;

		try {
			const response = await fetch('/api/v1/auth/forgot-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email_or_username: form.email_or_username })
			});

			const data = await response.json();

			if (response.ok) {
				emailSent = true;
				toast.success('Email enviado. Revisa tu bandeja de entrada.');
			} else {
				toast.error(data.error || 'Error al procesar la solicitud');
				errors.email_or_username = data.error || 'Error al procesar la solicitud';
			}
		} catch (error) {
			console.error('Forgot password failed:', error);
			toast.error('Error de conexión. No se pudo establecer comunicación con el servidor.');
			errors.email_or_username = 'Error de conexión. Intenta nuevamente.';
		} finally {
			isLoading = false;
		}
	}

	function goToLogin() {
		goto('/login');
	}
</script>

<svelte:head>
	<title>Recuperar Contraseña - {PUBLIC_NAME_COMPANY}</title>
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
				<span class="text-3xl font-bold text-white">BB</span>
			</div>
			<h1 class="mt-8 text-4xl font-bold text-foreground transition-colors">
				{#if emailSent}
					Revisa tu correo
				{:else}
					¿Olvidaste tu contraseña?
				{/if}
			</h1>
			<p class="mt-3 text-base text-muted-foreground transition-colors">
				{#if emailSent}
					Te hemos enviado instrucciones para recuperar tu contraseña
				{:else}
					Ingresa tu email o usuario y te enviaremos instrucciones
				{/if}
			</p>
		</div>

		<!-- Form Card -->
		<Card
			className="bg-surface/90 backdrop-blur-sm shadow-2xl border border-border transition-colors"
		>
			<CardContent className="p-8 space-y-6">
				{#if emailSent}
					<!-- Success Message -->
					<div class="text-center space-y-4">
						<div
							class="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
						>
							<svg
								class="w-8 h-8 text-green-600 dark:text-green-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<p class="text-secondary">
							Si el usuario existe, recibirás un correo con un enlace para restablecer tu
							contraseña.
						</p>
						<p class="text-sm text-tertiary">El enlace es válido por 15 minutos.</p>
						<Button
							type="button"
							variant="primary"
							size="lg"
							on:click={goToLogin}
							className="w-full rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
						>
							Volver al inicio de sesión
						</Button>
					</div>
				{:else}
					<!-- Request Form -->
					<form on:submit={handleSubmit} class="space-y-6">
						<!-- Email or Username Field -->
						<Input
							bind:value={form.email_or_username}
							type="text"
							label="Email o Usuario"
							placeholder="Ingresa tu email o usuario"
							error={errors.email_or_username}
							disabled={isLoading}
						/>

						<!-- Submit Button -->
						<Button
							type="submit"
							variant="primary"
							size="lg"
							disabled={isLoading}
							loading={isLoading}
							className="w-full rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
						>
							{isLoading ? 'Enviando...' : 'Enviar instrucciones'}
						</Button>

						<!-- Back to Login -->
						<div class="text-center">
							<button
								type="button"
								on:click={goToLogin}
								class="text-sm text-primary hover:text-primary-600 transition-colors"
							>
								← Volver al inicio de sesión
							</button>
						</div>
					</form>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
