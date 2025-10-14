<!-- Auto-generated Create Page for Agency -->
<script lang="ts">
  import { goto } from '$app/navigation';
  import { PUBLIC_NAME_COMPANY } from '$env/static/public';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import { agencyService } from '$lib/services/agencies/agencyService';
  import type { CreateAgencyRequest } from '$lib/types/agency';
  import { loadingStore } from '$lib/stores/loading';
  import { toast } from '$lib/utils/toast';

  // Form data
  let form = {
    name: '' as string,
    company_id: '' as string,
    address: '' as string,
    phone: '' as string,
    email: '' as string,
    manager_name: '' as string,
    is_active: false,
    opening_date: '' as string,
    notes: '' as string,
  } satisfies CreateAgencyRequest as CreateAgencyRequest;

  // Component state
  let loading = false;
  let validationErrors: Record<string, string> = {};
  let success = false;

  // Related data
  let documenttypeOptions: DocumentType[] = [];
  let userOptions: User[] = [];

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
    // Identificación de la empresa - Optional field validation
    if (form.company_id?.trim() && form.company_id.trim().length > 255) {
      validationErrors.company_id = 'Identificación de la empresa debe tener máximo 255 caracteres';
    }
    // DIRECCIÓN - Optional field validation
    if (form.address?.trim() && form.address.trim().length > 255) {
      validationErrors.address = 'DIRECCIÓN debe tener máximo 255 caracteres';
    }
    // Teléfono - Optional field validation
    if (form.phone?.trim() && form.phone.trim().length > 255) {
      validationErrors.phone = 'Teléfono debe tener máximo 255 caracteres';
    }
    if (form.phone && !/^\+?[\d\s\-()]+$/.test(form.phone)) {
      validationErrors.phone = 'Formato de teléfono inválido';
    }
    // Correo electrónico - Optional field validation
    if (form.email?.trim() && form.email.trim().length > 255) {
      validationErrors.email = 'Correo electrónico debe tener máximo 255 caracteres';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validationErrors.email = 'Ingresa un email válido';
    }
    // Nombre del gerente - Optional field validation
    if (form.manager_name?.trim() && form.manager_name.trim().length > 255) {
      validationErrors.manager_name = 'Nombre del gerente debe tener máximo 255 caracteres';
    }
    // Está activo - Optional field validation
    // Fecha de apertura - Optional field validation
    // Notas - Optional field validation
    if (form.notes?.trim() && form.notes.trim().length > 255) {
      validationErrors.notes = 'Notas debe tener máximo 255 caracteres';
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

  // Load related data
  async function loadRelatedData() {
    try {
      documenttypeOptions = await agencyService.getDocumentTypeOptions();
    } catch (err) {
      console.error('Error loading documenttype options:', err);
    }
    try {
      userOptions = await agencyService.getUserOptions();
    } catch (err) {
      console.error('Error loading user options:', err);
    }
  }

  // Handle form submission
  async function handleSubmit() {
    // Client-side validation
    if (!validateForm()) {
      toast.error('Por favor, corrige los errores del formulario');
      return;
    }

    loading = true;
    loadingStore.show('Creando Agency...');
    validationErrors = {};

    try {
      await agencyService.create(form);
      success = true;
      toast.success('Agency creado exitosamente');
      goto('/agencies');
    } catch (err: any) {
      console.error('Error creating agency:', err);

      // Handle validation errors from server
      if (err.response?.data?.errors) {
        validationErrors = err.response.data.errors;
        toast.error('Por favor, corrige los errores del formulario');
      } else {
        // Parse error message
        let errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Error al crear agency';

        // Handle database constraint errors
        if (errorMessage.includes('duplicate key') || errorMessage.includes('SQLSTATE 23505')) {
          // Extract field name from unique constraint error
          if (errorMessage.includes('idx_agencies_name') || errorMessage.includes('name')) {
            errorMessage = 'Ya existe un agency con ese nombre';
          } else if (errorMessage.includes('idx_agencies_')) {
            // Generic duplicate error
            errorMessage = 'Ya existe un agency con esos datos';
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

  // Load related data on mount
  loadRelatedData();
</script>

<svelte:head>
  <title>Crear Agencia - {PUBLIC_NAME_COMPANY}</title>
</svelte:head>

<div class="p-4 sm:p-6 bg-page min-h-screen">
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <!-- Header responsive con espacio para botón hamburger en móvil -->
      <div class="flex items-center space-x-4 lg:pr-0 pr-16">
        <button
          type="button"
          on:click={() => goto('/agencies')}
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
          <h1 class="text-xl sm:text-2xl font-bold text-primary truncate">Crear Agencia</h1>
          <p class="text-sm sm:text-base text-secondary">Agregar nueva información</p>
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
        <Input
          id="company_id"
          type="text"
          bind:value={form.company_id}
          label="Identificación de la empresa"
          placeholder="Ingresa identificación de la empresa"
          required={ false }
          
          tabindex={ 2 }
          error={validationErrors.company_id}
          on:input={() => clearFieldError('company_id')}
        />
      </div>
      <div>
        <Input
          id="address"
          type="text"
          bind:value={form.address}
          label="DIRECCIÓN"
          placeholder="Ingresa dirección"
          required={ false }
          
          tabindex={ 3 }
          error={validationErrors.address}
          on:input={() => clearFieldError('address')}
        />
      </div>
      <div>
        <Input
          id="phone"
          type="tel"
          bind:value={form.phone}
          label="Teléfono"
          placeholder="Ingresa teléfono"
          required={ false }
          
          tabindex={ 4 }
          error={validationErrors.phone}
          on:input={() => clearFieldError('phone')}
        />
      </div>
      <div>
        <Input
          id="email"
          type="email"
          bind:value={form.email}
          label="Correo electrónico"
          placeholder="Ingresa correo electrónico"
          required={ false }
          
          tabindex={ 5 }
          error={validationErrors.email}
          on:input={() => clearFieldError('email')}
        />
      </div>
      <div>
        <Input
          id="manager_name"
          type="text"
          bind:value={form.manager_name}
          label="Nombre del gerente"
          placeholder="Ingresa nombre del gerente"
          required={ false }
          
          tabindex={ 6 }
          error={validationErrors.manager_name}
          on:input={() => clearFieldError('manager_name')}
        />
      </div>
      <div>
        <Input
          id="is_active"
          type="text"
          bind:value={form.is_active}
          label="Está activo"
          placeholder="Ingresa está activo"
          required={ false }
          
          tabindex={ 7 }
          error={validationErrors.is_active}
          on:input={() => clearFieldError('is_active')}
        />
      </div>
      <div>
        <Input
          id="opening_date"
          type="datetime-local"
          bind:value={form.opening_date}
          label="Fecha de apertura"
          placeholder="Ingresa fecha de apertura"
          required={ false }
          
          tabindex={ 8 }
          error={validationErrors.opening_date}
          on:input={() => clearFieldError('opening_date')}
        />
      </div>
      <div>
        <Input
          id="notes"
          type="text"
          bind:value={form.notes}
          label="Notas"
          placeholder="Ingresa notas"
          required={ false }
          
          tabindex={ 9 }
          error={validationErrors.notes}
          on:input={() => clearFieldError('notes')}
        />
      </div>

          <div class="flex justify-end space-x-4 pt-6 border-t border-border">
            <button
              type="button"
              on:click={() => goto('/agencies')}
              disabled={loading}
              class="px-4 py-2 text-sm font-medium text-secondary bg-surface hover:bg-muted rounded-lg border border-border disabled:opacity-50 transition-colors"
              tabindex={ 10 }
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              class="px-4 py-2 text-sm font-medium text-inverse bg-primary-600 hover:bg-primary-700 rounded-lg disabled:opacity-50 transition-colors"
              tabindex={ 11 }
            >
              {loading ? 'Creando...' : 'Crear Agencia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
