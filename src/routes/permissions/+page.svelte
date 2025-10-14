<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_NAME_COMPANY } from '$env/static/public';
	import { roleService } from '$lib/services/roles/roleService';
	import { permissionService } from '$lib/services/permissions/permissionService';
	import type { Role } from '$lib/types/role';
	import type {
		ModulePermissionsWithAssignment,
		PermissionWithAssignment
	} from '$lib/types/permission';
	import Select from '$lib/components/ui/Select.svelte';
	import { toast } from '$lib/utils/toast';
	import { showLoading, hideLoading } from '$lib/utils/loading';

	let roles: Role[] = [];
	let selectedRoleId: string = '';
	let selectedRole: Role | null = null;
	let modulePermissions: ModulePermissionsWithAssignment[] = [];
	let loading = false;
	let initializing = true;
	let selectedModule: string = '';

	// Cargar todos los roles al iniciar
	async function loadRoles() {
		try {
			const response = await roleService.getAll({
				page: 1,
				limit: 100 // Cargar todos los roles
			});
			roles = response.data;
		} catch (err) {
			console.error('Error loading roles:', err);
			toast.error('Error al cargar los roles');
		}
	}

	// Cargar todos los permisos con información de asignación al rol
	async function loadRolePermissions() {
		if (!selectedRoleId) {
			modulePermissions = [];
			selectedModule = '';
			return;
		}

		loading = true;
		try {
			const response = await permissionService.getRolePermissions(selectedRoleId);
			modulePermissions = Array.isArray(response) ? response : [];

			// Seleccionar el primer módulo por defecto si existe
			if (modulePermissions.length > 0 && !selectedModule) {
				selectedModule = modulePermissions[0].module;
			}
		} catch (err) {
			console.error('Error loading role permissions:', err);
			toast.error('Error al cargar los permisos del rol');
			modulePermissions = [];
		} finally {
			loading = false;
		}
	}

	// Manejar cambio de checkbox
	async function handlePermissionToggle(permission: PermissionWithAssignment, event: Event) {
		const checkbox = event.target as HTMLInputElement;
		const isChecked = checkbox.checked;

		// Verificar si es un rol de sistema
		if (selectedRole?.is_system) {
			toast.error('No se pueden modificar permisos de roles del sistema');
			checkbox.checked = !isChecked; // Revertir el cambio
			return;
		}

		try {
			if (isChecked) {
				// Asignar permiso
				showLoading('Asignando permiso...');
				await permissionService.assignPermissionToRole(selectedRoleId, permission.id);
				hideLoading();
				toast.success(`Permiso asignado correctamente`);
				// Actualizar el estado del permiso localmente
				permission.assigned = true;
			} else {
				// Remover permiso
				showLoading('Removiendo permiso...');
				await permissionService.removePermissionFromRole(selectedRoleId, permission.id);
				hideLoading();
				toast.success(`Permiso removido correctamente`);
				// Actualizar el estado del permiso localmente
				permission.assigned = false;
			}
			// Forzar re-render
			modulePermissions = modulePermissions;
		} catch (err) {
			hideLoading();
			console.error('Error toggling permission:', err);
			toast.error('Error al actualizar el permiso');
			// Revertir el cambio en el checkbox
			checkbox.checked = !isChecked;
		}
	}

	// Manejar cambio de rol
	function handleRoleChange() {
		selectedRole = roles.find((r) => r.id === selectedRoleId) || null;
		selectedModule = ''; // Resetear módulo seleccionado al cambiar de rol
		loadRolePermissions();
	}

	onMount(async () => {
		await loadRoles();
		initializing = false;
	});
</script>

<svelte:head>
	<title>Gestión de Permisos - {PUBLIC_NAME_COMPANY}</title>
</svelte:head>

<div class="p-4 sm:p-6 bg-page min-h-screen">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-6">
			<div class="lg:pr-0 pr-16">
				<h1 class="text-xl sm:text-2xl font-bold text-primary">Gestión de Permisos</h1>
				<p class="text-sm sm:text-base text-secondary">Asigna permisos a los roles del sistema</p>
			</div>
		</div>

		<!-- Role Selector -->
		<div class="bg-surface shadow-sm rounded-lg border border-border p-6 mb-6">
			<div class="max-w-md">
				<Select
					bind:value={selectedRoleId}
					label="Selecciona un rol"
					placeholder="Elige un rol"
					items={roles.map((role) => ({
						value: role.id,
						label: role.name + (role.is_system ? ' (Sistema)' : '')
					}))}
					on:change={handleRoleChange}
					disabled={initializing}
				/>
				{#if selectedRole?.is_system}
					<div class="mt-3 p-3 bg-warning-100 border border-warning-600 rounded-lg">
						<p class="text-sm text-warning-600">
							⚠️ Este es un rol del sistema y sus permisos no pueden ser modificados
						</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Permissions Content -->
		{#if selectedRoleId && !loading}
			<div class="bg-surface shadow-sm rounded-lg border border-border">
				<!-- Module Tabs -->
				<div class="border-b border-border">
					<div class="flex overflow-x-auto">
						{#each modulePermissions as module}
							<button
								on:click={() => (selectedModule = module.module)}
								class="px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors {selectedModule ===
								module.module
									? 'border-primary-600 text-primary-600'
									: 'border-transparent text-secondary hover:text-primary hover:border-border'}"
							>
								{module.module.charAt(0).toUpperCase() + module.module.slice(1)}
								<span class="ml-2 text-xs text-tertiary">({module.permissions.length})</span>
							</button>
						{/each}
					</div>
				</div>

				<!-- Permissions List -->
				<div class="p-6">
					{#each modulePermissions as module}
						{#if selectedModule === module.module}
							<div class="space-y-3">
								{#if module.permissions.length === 0}
									<p class="text-secondary text-center py-8">
										No hay permisos disponibles en este módulo
									</p>
								{:else}
									{#each module.permissions as permission}
										<label
											class="flex items-start p-4 rounded-lg border border-border hover:bg-muted transition-colors cursor-pointer {selectedRole?.is_system
												? 'opacity-60 cursor-not-allowed'
												: ''}"
										>
											<input
												type="checkbox"
												checked={permission.assigned}
												on:change={(e) => handlePermissionToggle(permission, e)}
												disabled={selectedRole?.is_system}
												class="mt-1 h-4 w-4 rounded border-border focus:ring-2 focus:ring-primary-600 {selectedRole?.is_system
													? 'cursor-not-allowed'
													: 'cursor-pointer'}"
												style="accent-color: var(--color-primary-600);"
											/>
											<div class="ml-3 flex-1">
												<div class="flex items-center justify-between">
													<span class="text-sm font-medium text-primary">
														{permission.description || permission.name}
													</span>
													<span
														class={permission.assigned
															? 'badge-status-active'
															: 'badge-status-inactive'}
													>
														{permission.assigned ? 'ACTIVO' : 'INACTIVO'}
													</span>
												</div>
												{#if permission.description}
													<p class="text-sm text-secondary mt-1">
														{permission.name}
													</p>
												{/if}
											</div>
										</label>
									{/each}
								{/if}
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{:else if selectedRoleId && loading}
			<div class="bg-surface shadow-sm rounded-lg border border-border p-12 text-center">
				<div
					class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-muted border-t-primary-600"
				></div>
				<p class="mt-4 text-secondary">Cargando permisos...</p>
			</div>
		{:else if !selectedRoleId}
			<div class="bg-surface shadow-sm rounded-lg border border-border p-12 text-center">
				<svg
					class="mx-auto h-12 w-12 text-muted"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					></path>
				</svg>
				<h3 class="mt-4 text-lg font-semibold text-primary">Selecciona un rol</h3>
				<p class="mt-2 text-sm text-secondary">
					Elige un rol del selector de arriba para gestionar sus permisos
				</p>
			</div>
		{/if}
	</div>
</div>
