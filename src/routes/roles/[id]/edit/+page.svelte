<!-- Auto-generated Edit Page for Role -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { PUBLIC_NAME_COMPANY } from '$env/static/public';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import { roleService } from '$lib/services/roles/roleService';
  import type { UpdateRoleRequest, Role } from '$lib/types/role';
  import { loadingStore } from '$lib/stores/loading';
  import { toast } from '$lib/utils/toast';

  // Page data
  let roleId = $page.params.id || '';
  let form: UpdateRoleRequest = {};

  // Component state
  let loading = false;
  let validationErrors: Record<string, string> = {};
  let success = false;

  // Related data

  // Load existing data
  async function loadData() {
    if (!roleId) {
      toast.error('ID no válido');
      goto('/roles');
      return;
    }

    loadingStore.show('Cargando Role...');
    try {
      const response = await roleService.getById(roleId);
      const data = response.data;
      form = {
        name: data.name ?? '',
        description: data.description ?? '',
      };

    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Error al cargar los datos para editar');
    } finally {
      loadingStore.hide();
    }
  }

  // Validation function
  function validateForm(): boolean {
    validationErrors = {};
    // Nombre - Required validation
    if (!form.name?.trim()) {
      validationErrors.name = 'Nombre es requerido';
    } else if (form.name.trim().length < 2) {
      validationErrors.name = 'Nombre debe tener al menos 2 caracteres';
    } else if (form.name.trim().length > 255) {
      validationErrors.name = 'Nombre debe tener máximo 255 caracteres';
    }
    // Descripción - Optional field validation
    if (form.description?.trim() && form.description.trim().length > 500) {
      validationErrors.description = 'Descripción debe tener máximo 500 caracteres';
    }

    return Object.keys(validationErrors).length === 0;
  }

  // Clear field error on input
  function clearFieldError(field: string) {
    if (validationErrors[field]) {
      validationErrors = { ...validationErrors };
      delete validationErrors[field];
    }
  }

  // Handle form submission
  async function handleSubmit() {
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores del formulario');
      return;
    }

    loading = true;
    loadingStore.show('Actualizando Role...');
    validationErrors = {};

    try {
      await roleService.update(roleId, form);
      success = true;
      toast.success('Role actualizado exitosamente');
      goto('/roles');
    } catch (err: any) {
      console.error('Error updating role:', err);

      // Handle validation errors from server
      if (err.response?.data?.errors) {
        validationErrors = err.response.data.errors;
        toast.error('Por favor, corrige los errores del formulario');
      } else {
        // Parse error message
        let errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Error al actualizar role';

        // Handle database constraint errors
        if (errorMessage.includes('duplicate key') || errorMessage.includes('SQLSTATE 23505')) {
          // Extract field name from unique constraint error
          if (errorMessage.includes('idx_roles_name') || errorMessage.includes('name')) {
            errorMessage = 'Ya existe un role con ese nombre';
          } else if (errorMessage.includes('idx_roles_')) {
            // Generic duplicate error
            errorMessage = 'Ya existe un role con esos datos';
          } else {
            errorMessage = 'Este registro ya existe en el sistema';
          }
        } else if (errorMessage.includes('foreign key') || errorMessage.includes('SQLSTATE 23503')) {
          errorMessage = 'Error de referencia: verifica que los datos relacionados existan';
        } else if (errorMessage.includes('not null') || errorMessage.includes('SQLSTATE 23502')) {
          errorMessage = 'Faltan campos obligatorios';
        } else if (errorMessage.includes('check constraint') || errorMessage.includes('SQLSTATE 23514')) {
          errorMessage = 'Los datos no cumplen con las reglas de validación';
        }

        toast.error(errorMessage);
      }
    } finally {
      loading = false;
      loadingStore.hide();
    }
  }

  // Load data on mount
  loadData();
</script>

<svelte:head>
  <title>Editar Rol - {PUBLIC_NAME_COMPANY}</title>
</svelte:head>

<div class="p-4 sm:p-6 bg-page min-h-screen">
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <!-- Header responsive con espacio para botón hamburger en móvil -->
      <div class="flex items-center space-x-4 lg:pr-0 pr-16">
        <button
          type="button"
          on:click={() => goto('/roles')}
          class="text-secondary hover:text-primary transition-colors flex-shrink-0"
          title="Volver"
          aria-label="Volver"
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
          <h1 class="text-xl sm:text-2xl font-bold text-primary truncate">Editar Rol</h1>
          <p class="text-sm sm:text-base text-secondary">Actualizar la información</p>
        </div>
      </div>
    </div>

    <div class="bg-surface shadow-sm rounded-lg border border-border">
      <div class="p-6">
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <Input
          id="name"
          type="text"
          bind:value={form.name}
          label="Nombre *"
          placeholder="Ingresa nombre"
          required={ true }
          autofocus={true}
          tabindex={ 1 }
          error={validationErrors.name}
          on:input={() => clearFieldError('name')}
        />
      </div>
      <div>
        <Textarea
          id="description"
          bind:value={form.description}
          label="Descripción"
          placeholder="Ingresa descripción"
          rows={3}
          required={ false }
          
          tabindex={ 2 }
          error={validationErrors.description}
          on:input={() => clearFieldError('description')}
        />
      </div>

          <div class="flex justify-end space-x-4 pt-6 border-t border-border">
            <button
              type="button"
              on:click={() => goto('/roles')}
              disabled={loading}
              class="px-4 py-2 text-sm font-medium text-secondary bg-surface hover:bg-muted rounded-lg border border-border disabled:opacity-50 transition-colors"
              tabindex={ 3 }
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              class="px-4 py-2 text-sm font-medium text-inverse bg-primary-600 hover:bg-primary-700 rounded-lg disabled:opacity-50 transition-colors"
              tabindex={ 4 }
            >
              {loading ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
