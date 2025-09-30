<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { userService, type UpdateUserRequest, type User } from '$lib/services/users/userService';
	import { roleService } from '$lib/services/roles/roleService';
	import {
		Input,
		Button,
		Select,
		createRoleSearchFunction,
		selectHelpers
	} from '$lib/components/ui';
	import { loadingStore } from '$lib/stores/loading';
	import { toast } from '$lib/utils/toast';

	let userId: string;
	let currentUser: User | null = null;
	let form: UpdateUserRequest = {
		name: '',
		username: '',
		phone: '',
		role_id: '',
		status: ''
	};

	let loading = false;
	let loadingUser = true;
	let error = '';
	let validationErrors: Record<string, string> = {};
	let success = false;

	// Crear función de búsqueda externa para roles
	const roleSearchFunction = createRoleSearchFunction(roleService);


	const statusOptions = [
		{ value: 'ACTIVE', label: 'Activo' },
		{ value: 'INACTIVE', label: 'Inactivo' },
		{ value: 'SUSPENDED', label: 'Suspendido' }
	];

	async function loadUser() {
		loadingUser = true;
		error = '';

		try {
			const response = await userService.getUserById(userId);
			currentUser = response.data;

			// Llenar el formulario con los datos actuales
			form = {
				name: currentUser.name,
				username: currentUser.username,
				phone: currentUser.phone,
				role_id: currentUser.role_id,
				status: currentUser.status
			};
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al cargar el usuario';
		} finally {
			loadingUser = false;
		}
	}


	function validateForm(): boolean {
		validationErrors = {};

		if (!form.name?.trim()) {
			validationErrors.name = 'El nombre es requerido';
		} else if (form.name.trim().length < 2) {
			validationErrors.name = 'El nombre debe tener al menos 2 caracteres';
		}

		if (!form.username?.trim()) {
			validationErrors.username = 'El nombre de usuario es requerido';
		} else if (form.username.trim().length < 3) {
			validationErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
		} else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
			validationErrors.username =
				'El nombre de usuario solo puede contener letras, números y guiones bajos';
		}

		if (!form.phone?.trim()) {
			validationErrors.phone = 'El teléfono es requerido';
		} else if (!/^\+?[\d\s-()]+$/.test(form.phone)) {
			validationErrors.phone = 'Formato de teléfono inválido';
		}

		if (form.password && form.password.length < 6) {
			validationErrors.password = 'La contraseña debe tener al menos 6 caracteres';
		}

		if (!form.role_id) {
			validationErrors.role_id = 'Debe seleccionar un rol';
		}

		if (!form.status) {
			validationErrors.status = 'Debe seleccionar un estado';
		}

		return Object.keys(validationErrors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) {
			toast.warning('Por favor, corrige los errores en el formulario antes de continuar.');
			return;
		}

		// Mostrar overlay de carga global
		loadingStore.show('Actualizando usuario...');
		loading = true;
		error = '';
		success = false;

		try {
			// Crear objeto solo con campos que han cambiado
			const updateData: UpdateUserRequest = {};

			if (form.name !== currentUser?.name) updateData.name = form.name;
			if (form.username !== currentUser?.username) updateData.username = form.username;
			if (form.phone !== currentUser?.phone) updateData.phone = form.phone;
			if (form.role_id !== currentUser?.role_id) updateData.role_id = form.role_id;
			if (form.status !== currentUser?.status) updateData.status = form.status;
			if (form.password) updateData.password = form.password;

			// Solo actualizar si hay cambios
			if (Object.keys(updateData).length === 0) {
				toast.warning('No hay cambios para guardar');
				return;
			}

			await userService.updateUser(userId, updateData);

			// Marcar como exitoso
			success = true;

			// Mostrar toast de éxito
			toast.success('Usuario actualizado exitosamente');

			// Redirección inmediata
			await goto('/users');
		} catch (err) {
			console.error('Error updating user:', err);

			// Determinar el mensaje de error apropiado
			let errorMessage = 'Error al actualizar el usuario';
			let isValidationError = false;

			if (err instanceof Error) {
				errorMessage = err.message;
			} else if (typeof err === 'object' && err !== null) {
				// Manejar respuestas de error del API
				const errorObj = err as any;

				// Verificar si es un error de validación con detalles específicos
				if (errorObj.errors && Array.isArray(errorObj.errors)) {
					isValidationError = true;
					const validationMessages = errorObj.errors
						.map((detail: any) => `${detail.field}: ${detail.message}`)
						.join(', ');
					errorMessage = `${errorObj.message || 'Error de validación'} - ${validationMessages}`;
				} else if (errorObj.details && Array.isArray(errorObj.details)) {
					isValidationError = true;
					const validationMessages = errorObj.details
						.map((detail: any) => `${detail.field}: ${detail.message}`)
						.join(', ');
					errorMessage = `${errorObj.error || errorObj.message || 'Error de validación'} - ${validationMessages}`;
				} else if (errorObj.message) {
					errorMessage = errorObj.message;
				} else if (errorObj.error) {
					errorMessage = errorObj.error;
				} else if (errorObj.detail) {
					errorMessage = errorObj.detail;
				}
			} else if (typeof err === 'string') {
				errorMessage = err;
			}

			// Verificar si es un error de validación del servidor
			if (
				isValidationError ||
				errorMessage.toLowerCase().includes('validation') ||
				errorMessage.toLowerCase().includes('invalid') ||
				errorMessage.toLowerCase().includes('required')
			) {
				toast.warning(errorMessage);
			} else if (
				errorMessage.toLowerCase().includes('exists') ||
				errorMessage.toLowerCase().includes('duplicate')
			) {
				toast.error(`El usuario ya existe: ${errorMessage}`);
			} else {
				toast.error(`Error al actualizar usuario: ${errorMessage}`);
			}

			// También mantener el error local para el UI
			error = errorMessage;
		} finally {
			// Ocultar overlay de carga
			loadingStore.hide();
			loading = false;
		}
	}

	function handleCancel() {
		goto('/users');
	}

	// Función para limpiar errores de validación al escribir
	function clearFieldError(fieldName: string) {
		if (validationErrors[fieldName]) {
			delete validationErrors[fieldName];
			validationErrors = { ...validationErrors };
		}
	}

	// Función para manejar el cambio de rol
	function handleRoleChange(event: CustomEvent) {
		form.role_id = event.detail.value;
		clearFieldError('role_id');
	}

	// Función para manejar el cambio de estado
	function handleStatusChange(event: any) {
		form.status = event.target.value;
		clearFieldError('status');
	}

	$: {
		const id = $page.params.id;
		if (id && typeof id === 'string') {
			userId = id;
			loadUser();
		}
	}
</script>

<svelte:head>
	<title>Editar Usuario - CrediFacil</title>
</svelte:head>

<div class="p-6 bg-page min-h-screen">
	<div class="mb-6">
		<div class="flex items-center space-x-4">
			<Button variant="ghost" size="sm" on:click={handleCancel} title="Volver">
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					></path>
				</svg>
			</Button>
			<div>
				<h1 class="text-2xl font-bold text-primary">Editar Usuario</h1>
				<p class="text-secondary">
					{#if currentUser}
						Editando información de {currentUser.name}
					{:else}
						Cargando información del usuario...
					{/if}
				</p>
			</div>
		</div>
	</div>

	{#if loadingUser}
		<div class="text-center py-8">
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
			<p class="mt-2 text-secondary">Cargando usuario...</p>
		</div>
	{:else if error && !currentUser}
		<div class="error-container border px-4 py-3 rounded">
			{error}
		</div>
	{:else}
		<div class="max-w-2xl">
			{#if error}
				<div class="error-container border px-4 py-3 rounded mb-6">
					{error}
				</div>
			{/if}

			{#if success}
				<div class="success-container border px-4 py-3 rounded mb-6 flex items-center">
					<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
					</svg>
					Usuario actualizado exitosamente. Redirigiendo...
				</div>
			{/if}

			<form on:submit|preventDefault={handleSubmit} class="space-y-6" class:hidden={success}>
				<div class="bg-surface shadow-sm rounded-lg p-6 border border-border">
					<h2 class="text-lg font-medium text-primary mb-4">Información Personal</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Input
							label="Nombre Completo *"
							bind:value={form.name}
							placeholder="Ingresa el nombre completo"
							error={validationErrors.name}
							autofocus={true}
							tabindex={1}
							on:input={() => clearFieldError('name')}
						/>

						<Input
							label="Nombre de Usuario *"
							bind:value={form.username}
							placeholder="Ingresa el nombre de usuario"
							error={validationErrors.username}
							tabindex={2}
							on:input={() => clearFieldError('username')}
						/>

						<Input
							label="Teléfono *"
							type="tel"
							bind:value={form.phone}
							placeholder="Ingresa el número de teléfono"
							error={validationErrors.phone}
							tabindex={3}
							on:input={() => clearFieldError('phone')}
						/>

						<Input
							label="Nueva Contraseña (opcional)"
							type="password"
							bind:value={form.password}
							placeholder="Dejar vacío para mantener la actual"
							error={validationErrors.password}
							tabindex={4}
							on:input={() => clearFieldError('password')}
						/>
					</div>
				</div>


				<div class="bg-surface shadow-sm rounded-lg p-6 border border-border">
					<h2 class="text-lg font-medium text-primary mb-4">Configuración del Usuario</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<Select
								label="Rol *"
								placeholder="Haz click aquí para buscar roles..."
								searchable
								clearable
								externalSearch={roleSearchFunction}
								getValue={(item) => item.id}
								getLabel={(item) => item.name}
								getDisabled={(item) => item.disabled || false}
								value={form.role_id}
								on:change={handleRoleChange}
								error={validationErrors.role_id}
								minSearchLength={2}
								searchDebounceMs={300}
								loadingText="Buscando roles..."
								emptyText="No se encontraron roles"
								tabindex={5}
								searchParams={{
									page: 1,
									limit: 20,
									sortBy: 'name',
									sortDirection: 'asc'
								}}
							/>
						</div>

						<div>
							<label for="status" class="block text-sm font-medium text-foreground mb-2">Estado *</label>
							<select
								id="status"
								bind:value={form.status}
								on:change={handleStatusChange}
								tabindex={6}
								class="w-full px-3 py-2 border rounded-md bg-surface text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-muted disabled:text-muted-foreground transition-colors {validationErrors.status ? 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400' : 'border-border'}"
							>
								<option value="">Selecciona un estado</option>
								{#each statusOptions as status (status.value)}
									<option value={status.value}>{status.label}</option>
								{/each}
							</select>
							{#if validationErrors.status}
								<p class="mt-1 text-sm text-error">{validationErrors.status}</p>
							{/if}
						</div>
					</div>
				</div>

				<div class="flex justify-end space-x-4">
					<Button variant="outline" type="button" on:click={handleCancel} tabindex={7}>Cancelar</Button>
					<Button variant="primary" type="submit" {loading} disabled={loading} tabindex={8}>
						{loading ? 'Actualizando...' : 'Guardar Cambios'}
					</Button>
				</div>
			</form>
		</div>
	{/if}
</div>
