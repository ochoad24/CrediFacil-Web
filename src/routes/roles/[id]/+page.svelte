<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { PUBLIC_NAME_COMPANY } from '$env/static/public';
	import { roleService } from '$lib/services/roles/roleService';
	import type { Role } from '$lib/types/role';
	import { confirmation } from '$lib/stores/confirmation';
	import { authStore } from '$lib/stores/auth.svelte';

	let roleId = '';
	let role: Role | null = null;
	let loading = true;
	let error = '';

	async function loadRole() {
		loading = true;
		error = '';

		try {
			const response = await roleService.getById(roleId);
			role = response.data;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al cargar el role';
		} finally {
			loading = false;
		}
	}

	async function deleteRole() {
		if (!role) return;

		const confirmed = await confirmation.danger(
			'¿Estás seguro de que quieres eliminar este role? Esta acción no se puede deshacer.',
			'Eliminar Role'
		);

		if (!confirmed) return;

		try {
			await roleService.delete(role!.id);
			await goto('/roles');
		} catch (err) {
			error = err instanceof Error ? err.message : 'Error al eliminar role';
		}
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
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
		goto('/roles');
	}

	$: {
		roleId = $page.params.id || '';
		if (roleId) {
			loadRole();
		}
	}
</script>

<svelte:head>
	<title>Detalle de Rol - {PUBLIC_NAME_COMPANY}</title>
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
					title="Volver a roles"
					aria-label="Volver a roles"
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
						{role ? role!.name : 'Detalle de Rol'}
					</h1>
					<p class="text-sm sm:text-base text-secondary">Información completa del Rol</p>
				</div>
			</div>

			{#if role}
				<!-- Botones de acción responsive -->
				<div class="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
					{#if authStore.hasPermission('roles.update')}
						<button
							on:click={() => goto(`/roles/${role!.id}/edit`)}
							class="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
							title="Editar Rol"
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
					{/if}
					{#if authStore.hasPermission('roles.delete')}
						<button
							on:click={deleteRole}
							class="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] font-medium"
							title="Eliminar Rol"
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
					{/if}
				</div>
			{/if}
		</div>
	</div>

	{#if loading}
		<div class="text-center py-8">
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			<p class="mt-2 text-secondary">Cargando Rol...</p>
		</div>
	{:else if error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
			{error}
		</div>
	{:else if role}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Información Principal -->
			<div class="lg:col-span-2">
				<div class="bg-surface shadow-sm rounded-lg border border-border">
					<div class="p-6">
						<div class="flex items-center space-x-4 mb-6">
							<div class="flex-shrink-0">
								<div class="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
									{role!.name.charAt(0).toUpperCase()}
								</div>
							</div>
							<div>
								<h2 class="text-xl font-bold text-primary">{role!.name}</h2>
								{#if role.description}
									<p class="text-secondary">{role.description}</p>
								{/if}
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 class="text-sm font-medium text-tertiary uppercase tracking-wide mb-2">Estado</h3>
								<div class="space-y-3">
									<div class="flex items-center">
										<svg class="w-5 h-5 text-tertiary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
										</svg>
										<span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full {getStatusBadgeClass(role.status)}">{getStatusText(role.status)}</span>
									</div>
								</div>
							</div>
							<div>
								<h3 class="text-sm font-medium text-tertiary uppercase tracking-wide mb-2">Is System</h3>
								<div class="space-y-3">
									<div class="flex items-center">
										<svg class="w-5 h-5 text-tertiary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
										</svg>
										<span class="text-primary">{role.is_system ? 'Sí' : 'No'}</span>
									</div>
								</div>
							</div>
							
						</div>
					</div>
				</div>
			</div>

			<!-- Información Adicional -->
			<div class="space-y-6">
				<div class="bg-surface shadow-sm rounded-lg border border-border">
					<div class="p-6">
						<h3 class="text-lg font-medium text-primary mb-4">Información del Sistema</h3>
						<div class="space-y-4">
							<div>
								<dt class="text-sm font-medium text-tertiary">ID del Rol</dt>
								<dd class="mt-1 text-sm text-primary font-mono bg-muted px-2 py-1 rounded">
									{role!.id}
								</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-tertiary">Fecha de Creación</dt>
								<dd class="mt-1 text-sm text-primary">
									{formatDate(role!.created_at)}
								</dd>
							</div>
							<div>
								<dt class="text-sm font-medium text-tertiary">Última Actualización</dt>
								<dd class="mt-1 text-sm text-primary">
									{formatDate(role!.updated_at)}
								</dd>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-surface shadow-sm rounded-lg border border-border">
					<div class="p-6">
						<h3 class="text-lg font-medium text-primary mb-4">Users ({role.users ? role.users.length : 0})</h3>
						<div class="space-y-3">
							{#if role.users && role.users.length > 0}
								<div class="space-y-2">
									{#each role.users as user}
										<div class="flex items-center justify-between p-3 bg-muted rounded-lg">
											<div class="flex items-center space-x-3">
												<div class="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-inverse text-sm font-bold">
													{user.name.charAt(0).toUpperCase()}
												</div>
												<div>
													<p class="text-sm font-medium text-primary">{user.name}</p>
													<p class="text-xs text-secondary">@{user.username}</p>
												</div>
											</div>
											<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full {getStatusBadgeClass(user.status)}">
												{getStatusText(user.status)}
											</span>
										</div>
									{/each}
								</div>
							{:else}
								<div class="text-sm text-secondary text-center py-4">
									No hay usuarios asociados a este role
								</div>
							{/if}
						</div>
					</div>
				</div>
				<div class="bg-surface shadow-sm rounded-lg border border-border">
					<div class="p-6">
						<h3 class="text-lg font-medium text-primary mb-4">Role Permissions ({role.role_permissions ? role.role_permissions.length : 0})</h3>
						<div class="space-y-3">
							{#if role.role_permissions && role.role_permissions.length > 0}
								<div class="space-y-2">
									{#each role.role_permissions as relationItem}
										<div class="p-3 bg-muted rounded-lg">
											<div class="flex items-center justify-between">
												<div>
													<p class="text-sm font-medium text-primary">{relationItem.permission?.name || 'Sin nombre'}</p>
													{#if relationItem.permission?.description}
														<p class="text-xs text-secondary">{relationItem.permission.description}</p>
													{/if}
												</div>
												<div class="text-right">
													<p class="text-xs font-mono text-tertiary">{relationItem.permission?.module || ''}:{relationItem.permission?.action || ''}</p>
												</div>
											</div>
										</div>
									{/each}
								</div>
							{:else}
								<div class="text-sm text-secondary text-center py-4">
									No hay permisos asociados a este role
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
			<h3 class="mt-2 text-sm font-medium text-primary">Role no encontrado</h3>
			<p class="mt-1 text-sm text-tertiary">El role que buscas no existe o ha sido eliminado.</p>
			<div class="mt-6">
				<button
					on:click={handleBack}
					class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
				>
					Volver a Roles
				</button>
			</div>
		</div>
	{/if}
</div>