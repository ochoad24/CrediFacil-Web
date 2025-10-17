<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_NAME_COMPANY } from '$env/static/public';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { userService, type User } from '$lib/services/users/userService';
	import { confirmation } from '$lib/stores/confirmation';
	import { formatUTCToLocal } from '$lib/utils/date';

	let userId = '';
	let user: User | null = null;
	let loading = true;
	let error = '';

	async function loadUser() {
		loading = true;
		error = '';

		try {
			const response = await userService.getUserById(userId);
			user = response.data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al cargar el usuario';
		} finally {
			loading = false;
		}
	}

	async function deleteUser() {
		if (!user) return;

		const confirmed = await confirmation.danger(
			`¿Estás seguro de que quieres eliminar al usuario "${user.name}"? Esta acción no se puede deshacer.`,
			'Eliminar Usuario'
		);

		if (!confirmed) return;

		try {
			await userService.deleteUser(user.id);
			await goto('/users');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al eliminar usuario';
		}
	}

	function getStatusBadgeClass(status: string): string {
		switch (status.toUpperCase()) {
			case 'ACTIVE':
				return 'badge-status-active';
			case 'INACTIVE':
				return 'badge-status-inactive';
			case 'SUSPENDED':
				return 'badge-status-suspended';
			default:
				return 'badge-status-default';
		}
	}

	function getStatusText(status: string): string {
		switch (status.toUpperCase()) {
			case 'ACTIVE':
				return 'Activo';
			case 'INACTIVE':
				return 'Inactivo';
			case 'SUSPENDED':
				return 'Suspendido';
			default:
				return status;
		}
	}

	function handleBack() {
		goto('/users');
	}

	$: {
		userId = $page.params.id || '';
		if (userId) {
			loadUser();
		}
	}
</script>

<svelte:head>
	<title>{user ? `${user.name} - Usuario` : 'Detalle de Usuario'} - {PUBLIC_NAME_COMPANY}</title>
</svelte:head>

<div class="p-4 sm:p-6 bg-page min-h-screen">
	<div class="mb-6">
		<!-- Header responsive: stack en móvil, horizontal en desktop -->
		<!-- Agregamos pr-16 en móvil para dar espacio al botón hamburger del sidebar -->
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg:pr-0 pr-16">
			<div class="flex items-center space-x-4">
				<button
					on:click={handleBack}
					class="text-tertiary hover:text-secondary transition-colors flex-shrink-0"
					title="Volver a usuarios"
					aria-label="Volver a usuarios"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						></path>
					</svg>
				</button>
				<div class="min-w-0 flex-1">
					<h1 class="text-xl sm:text-2xl font-bold text-primary truncate">
						{user ? user.name : 'Detalle de Usuario'}
					</h1>
					<p class="text-sm sm:text-base text-secondary">Información completa del usuario</p>
				</div>
			</div>

			{#if user}
				<!-- Botones de acción responsive -->
				<div class="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
					<button
						on:click={() => goto(`/users/${user!.id}/edit`)}
						class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
						title="Editar usuario"
					>
						<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							></path>
						</svg>
						<span>Editar</span>
					</button>
					<button
						on:click={deleteUser}
						class="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
						title="Eliminar usuario"
					>
						<svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							></path>
						</svg>
						<span>Eliminar</span>
					</button>
				</div>
			{/if}
		</div>
	</div>

	{#if loading}
		<div class="text-center py-8">
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			<p class="mt-2 text-secondary">Cargando usuario...</p>
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
			{error}
		</div>
	{:else if user}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Información Principal -->
			<div class="lg:col-span-2">
				<div class="bg-surface shadow-sm rounded-lg border border-border">
					<div class="p-6">
						<div class="flex items-center space-x-4 mb-6">
							<div class="flex-shrink-0">
								<div
									class="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold"
								>
									{user.name.charAt(0).toUpperCase()}
								</div>
							</div>
							<div>
								<h2 class="text-xl font-bold text-primary">{user.name}</h2>
								<p class="text-secondary">@{user.username}</p>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 class="text-sm font-medium text-tertiary uppercase tracking-wide mb-2">
									Información de Contacto
								</h3>
								<div class="space-y-3">
									<div class="flex items-center">
										<svg
											class="w-5 h-5 text-tertiary mr-3"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
											></path>
										</svg>
										<span class="text-primary">{user.phone}</span>
									</div>
								</div>
							</div>

							<div>
								<h3 class="text-sm font-medium text-tertiary uppercase tracking-wide mb-2">
									Rol
								</h3>
								<div class="space-y-3">
									<div class="flex items-center">
										<svg
											class="w-5 h-5 text-tertiary mr-3"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											></path>
										</svg>
										<span class="text-primary">{user.role?.name || 'Sin rol asignado'}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Información Adicional -->
			<div class="space-y-6">
				<!-- Fechas -->
				<div class="bg-surface shadow-sm rounded-lg border border-border">
					<div class="p-6">
						<h3 class="text-lg font-medium text-primary mb-4">Información del Sistema</h3>
						<div class="space-y-4">
							<div>
								<dt class="text-sm font-medium text-tertiary">ID del Usuario</dt>
								<dd class="mt-1 text-sm text-primary font-mono bg-muted px-2 py-1 rounded">
									{user.id}
								</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-tertiary">Fecha de Creación</dt>
								<dd class="mt-1 text-sm text-primary">
									{formatUTCToLocal(user.created_at)}
								</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-tertiary">Última Actualización</dt>
								<dd class="mt-1 text-sm text-primary">
									{formatUTCToLocal(user.updated_at)}
								</dd>
							</div>
						</div>
					</div>
				</div>

				<!-- Estado y Configuración -->
				<div class="bg-surface shadow-sm rounded-lg border border-border">
					<div class="p-6">
						<h3 class="text-lg font-medium text-primary mb-4">Configuración</h3>
						<div class="space-y-4">
							<div>
								<dt class="text-sm font-medium text-tertiary">Estado del Usuario</dt>
								<dd class="mt-1">
									<span
										class="inline-flex px-3 py-1 text-sm font-semibold rounded-full {getStatusBadgeClass(
											user.status
										)}"
									>
										{getStatusText(user.status)}
									</span>
								</dd>
							</div>
							{#if user.role}
								<div>
									<dt class="text-sm font-medium text-tertiary">Información del Rol</dt>
									<dd class="mt-1 space-y-2">
										<div class="bg-muted p-3 rounded-lg">
											<div class="flex items-center justify-between mb-2">
												<span class="text-sm font-medium text-primary">{user.role.name}</span>
												{#if user.role.is_system}
													<span class="inline-flex px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
														Sistema
													</span>
												{/if}
											</div>
											{#if user.role.description}
												<p class="text-sm text-secondary mb-2">{user.role.description}</p>
											{/if}
											<div class="flex items-center text-xs text-tertiary space-x-4">
												<span>ID: {user.role.id}</span>
												<span>Estado: {getStatusText(user.role.status)}</span>
											</div>
										</div>
									</dd>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="text-center py-8">
			<svg
				class="mx-auto h-12 w-12 text-tertiary"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
				></path>
			</svg>
			<h3 class="mt-2 text-sm font-medium text-primary">Usuario no encontrado</h3>
			<p class="mt-1 text-sm text-tertiary">El usuario que buscas no existe o ha sido eliminado.</p>
			<div class="mt-6">
				<button
					on:click={handleBack}
					class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
				>
					Volver a Usuarios
				</button>
			</div>
		</div>
	{/if}
</div>
