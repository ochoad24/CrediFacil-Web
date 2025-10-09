<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_NAME_COMPANY } from '$env/static/public';
	import { Button, Input, Card, CardContent, ThemeToggle } from '$lib/components/ui';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { redirectIfAuthenticated } from '$lib/utils/auth-guard';
	import { toast } from '$lib/utils/toast';
	import { authService } from '$lib/services/auth/authService';

	let form = {
		password: '',
		confirmPassword: ''
	};

	let errors = {
		password: '',
		confirmPassword: ''
	};

	let showPassword = false;
	let showConfirmPassword = false;
	let isLoading = false;
	let resetSuccessful = false;
	let token = '';

	// Redirigir si ya está autenticado y obtener token de la URL
	onMount(() => {
		redirectIfAuthenticated();

		// Obtener token de la URL
		token = $page.url.searchParams.get('token') || '';

		if (!token) {
			toast.error('Token de recuperación no encontrado');
			setTimeout(() => goto('/forgot-password'), 2000);
		}
	});

	// Validación de políticas de contraseña
	function validatePassword(password: string): string[] {
		const errors: string[] = [];

		if (password.length < 8) {
			errors.push('Mínimo 8 caracteres');
		}
		if (!/[A-Z]/.test(password)) {
			errors.push('Al menos una mayúscula');
		}
		if (!/[a-z]/.test(password)) {
			errors.push('Al menos una minúscula');
		}
		if (!/[0-9]/.test(password)) {
			errors.push('Al menos un número');
		}
		if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
			errors.push('Al menos un carácter especial (!@#$%^&*...)');
		}

		return errors;
	}

	// Validación del formulario
	function validateForm(): boolean {
		errors = { password: '', confirmPassword: '' };
		let isValid = true;

		if (!form.password) {
			errors.password = 'La contraseña es requerida';
			isValid = false;
		} else {
			const passwordErrors = validatePassword(form.password);
			if (passwordErrors.length > 0) {
				errors.password = passwordErrors.join(', ');
				isValid = false;
			}
		}

		if (!form.confirmPassword) {
			errors.confirmPassword = 'Confirma tu contraseña';
			isValid = false;
		} else if (form.password !== form.confirmPassword) {
			errors.confirmPassword = 'Las contraseñas no coinciden';
			isValid = false;
		}

		return isValid;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validateForm()) return;

		isLoading = true;

		try {
			await authService.resetPassword(token, form.password);
			resetSuccessful = true;
			toast.success('Contraseña actualizada exitosamente');
			setTimeout(() => goto('/login'), 3000);
		} catch (error) {
			console.error('Reset password failed:', error);

			let errorMessage = 'Error de conexión. Intenta nuevamente.';

			if (error && typeof error === 'object' && 'message' in error) {
				errorMessage = error.message as string;
			}

			toast.error(errorMessage);
			errors.password = errorMessage;
		} finally {
			isLoading = false;
		}
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	function toggleConfirmPasswordVisibility() {
		showConfirmPassword = !showConfirmPassword;
	}

	function goToLogin() {
		goto('/login');
	}
</script>

<svelte:head>
	<title>Restablecer Contraseña - {PUBLIC_NAME_COMPANY}</title>
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
				{#if resetSuccessful}
					¡Contraseña actualizada!
				{:else}
					Restablecer contraseña
				{/if}
			</h1>
			<p class="mt-3 text-base text-muted-foreground transition-colors">
				{#if resetSuccessful}
					Ya puedes iniciar sesión con tu nueva contraseña
				{:else}
					Ingresa tu nueva contraseña
				{/if}
			</p>
		</div>

		<!-- Form Card -->
		<Card
			className="bg-surface/90 backdrop-blur-sm shadow-2xl border border-border transition-colors"
		>
			<CardContent className="p-8 space-y-6">
				{#if resetSuccessful}
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
							Tu contraseña ha sido actualizada exitosamente. Redirigiendo al inicio de sesión...
						</p>
						<Button
							type="button"
							variant="primary"
							size="lg"
							on:click={goToLogin}
							className="w-full rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
						>
							Ir al inicio de sesión
						</Button>
					</div>
				{:else}
					<!-- Reset Form -->
					<form on:submit={handleSubmit} class="space-y-6">
						<!-- Password Field -->
						<div class="relative">
							<Input
								bind:value={form.password}
								type={showPassword ? 'text' : 'password'}
								label="Nueva Contraseña"
								placeholder="Ingresa tu nueva contraseña"
								className="pr-12"
								error={errors.password}
								disabled={isLoading}
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

						<!-- Confirm Password Field -->
						<div class="relative">
							<Input
								bind:value={form.confirmPassword}
								type={showConfirmPassword ? 'text' : 'password'}
								label="Confirmar Contraseña"
								placeholder="Confirma tu nueva contraseña"
								className="pr-12"
								error={errors.confirmPassword}
								disabled={isLoading}
							/>
							<button
								type="button"
								class="absolute top-8 right-0 pr-3 h-10 flex items-center hover:bg-muted rounded-r-lg transition-colors"
								on:click={toggleConfirmPasswordVisibility}
								title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
							>
								{#if showConfirmPassword}
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

						<!-- Password Requirements -->
						<div class="bg-muted/50 rounded-lg p-4 space-y-2">
							<p class="text-sm font-medium text-secondary">La contraseña debe contener:</p>
							<ul class="text-xs text-tertiary space-y-1 list-disc list-inside">
								<li>Mínimo 8 caracteres</li>
								<li>Al menos una letra mayúscula</li>
								<li>Al menos una letra minúscula</li>
								<li>Al menos un número</li>
								<li>Al menos un carácter especial (!@#$%^&*...)</li>
							</ul>
						</div>

						<!-- Submit Button -->
						<Button
							type="submit"
							variant="primary"
							size="lg"
							disabled={isLoading}
							loading={isLoading}
							className="w-full rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
						>
							{isLoading ? 'Actualizando...' : 'Restablecer contraseña'}
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
