<!-- Auto-generated Edit Page for DocumentType -->
<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { PUBLIC_NAME_COMPANY } from '$env/static/public';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import { documenttypeService } from '$lib/services/documenttypes/documenttypeService';
  import type { UpdateDocumentTypeRequest, DocumentType } from '$lib/types/documenttype';
  import { loadingStore } from '$lib/stores/loading';
  import { toast } from '$lib/utils/toast';

  // Page data
  let documenttypeId = $page.params.id || '';
  let form: UpdateDocumentTypeRequest = {};

  // Component state
  let loading = false;
  let validationErrors: Record<string, string> = {};
  let success = false;

  // Related data
  let userOptions: User[] = [];

  // Load existing data
  async function loadData() {
    if (!documenttypeId) {
      toast.error('ID no válido');
      goto('/documenttypes');
      return;
    }

    loadingStore.show('Cargando DocumentType...');
    try {
      const response = await documenttypeService.getById(documenttypeId);
      const data = response.data;
      form = {
        code: data.code ?? '',
        name: data.name ?? '',
        description: data.description ?? '',
        prefix: data.prefix ?? '',
        include_year: data.include_year ?? false,
        include_month: data.include_month ?? false,
        number_length: data.number_length ?? 0,
        module: data.module ?? '',
      };
      userOptions = await documenttypeService.getUserOptions();

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
    // Código - Required validation
    if (!form.code?.trim()) {
      validationErrors.code = 'Código es requerido';
    } else if (form.code.trim().length > 255) {
      validationErrors.code = 'Código debe tener máximo 255 caracteres';
    }
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
    // Prefijo - Required validation
    if (!form.prefix?.trim()) {
      validationErrors.prefix = 'Prefijo es requerido';
    } else if (form.prefix.trim().length > 255) {
      validationErrors.prefix = 'Prefijo debe tener máximo 255 caracteres';
    }
    // Incluir año - Optional field validation
    // Incluir mes - Optional field validation
    // Longitud del número - Required validation
    if (!form.number_length) {
      validationErrors.number_length = 'Longitud del número es requerido';
    } else if (form.number_length.length < 4) {
      validationErrors.number_length = 'Longitud del número debe tener al menos 4 caracteres';
    } else if (form.number_length.length > 12) {
      validationErrors.number_length = 'Longitud del número debe tener máximo 12 caracteres';
    }
    // Módulo - Required validation
    if (!form.module?.trim()) {
      validationErrors.module = 'Módulo es requerido';
    } else if (form.module.trim().length > 255) {
      validationErrors.module = 'Módulo debe tener máximo 255 caracteres';
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
    loadingStore.show('Actualizando DocumentType...');
    validationErrors = {};

    try {
      await documenttypeService.update(documenttypeId, form);
      success = true;
      toast.success('DocumentType actualizado exitosamente');
      goto('/documenttypes');
    } catch (err: any) {
      console.error('Error updating documenttype:', err);

      // Handle validation errors from server
      if (err.response?.data?.errors) {
        validationErrors = err.response.data.errors;
        toast.error('Por favor, corrige los errores del formulario');
      } else {
        // Parse error message
        let errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Error al actualizar documenttype';

        // Handle database constraint errors
        if (errorMessage.includes('duplicate key') || errorMessage.includes('SQLSTATE 23505')) {
          // Extract field name from unique constraint error
          if (errorMessage.includes('idx_documenttypes_name') || errorMessage.includes('name')) {
            errorMessage = 'Ya existe un documenttype con ese nombre';
          } else if (errorMessage.includes('idx_documenttypes_')) {
            // Generic duplicate error
            errorMessage = 'Ya existe un documenttype con esos datos';
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
  <title>Editar Tipos de Documento - {PUBLIC_NAME_COMPANY}</title>
</svelte:head>

<div class="p-4 sm:p-6 bg-page min-h-screen">
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <!-- Header responsive con espacio para botón hamburger en móvil -->
      <div class="flex items-center space-x-4 lg:pr-0 pr-16">
        <button
          type="button"
          on:click={() => goto('/documenttypes')}
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
          <h1 class="text-xl sm:text-2xl font-bold text-primary truncate">Editar Tipos de Documento</h1>
          <p class="text-sm sm:text-base text-secondary">Actualizar la información</p>
        </div>
      </div>
    </div>

    <div class="bg-surface shadow-sm rounded-lg border border-border">
      <div class="p-6">
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <Input
          id="code"
          type="text"
          bind:value={form.code}
          label="Código *"
          placeholder="Ingresa código"
          required={ true }
          autofocus={true}
          tabindex={ 1 }
          error={validationErrors.code}
          on:input={() => clearFieldError('code')}
        />
      </div>
      <div>
        <Input
          id="name"
          type="text"
          bind:value={form.name}
          label="Nombre *"
          placeholder="Ingresa nombre"
          required={ true }
          
          tabindex={ 2 }
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
          
          tabindex={ 3 }
          error={validationErrors.description}
          on:input={() => clearFieldError('description')}
        />
      </div>
      <div>
        <Input
          id="prefix"
          type="text"
          bind:value={form.prefix}
          label="Prefijo *"
          placeholder="Ingresa prefijo"
          required={ true }
          
          tabindex={ 4 }
          error={validationErrors.prefix}
          on:input={() => clearFieldError('prefix')}
        />
      </div>
      <div>
        <Input
          id="include_year"
          type="text"
          bind:value={form.include_year}
          label="Incluir año"
          placeholder="Ingresa incluir año"
          required={ false }
          
          tabindex={ 5 }
          error={validationErrors.include_year}
          on:input={() => clearFieldError('include_year')}
        />
      </div>
      <div>
        <Input
          id="include_month"
          type="text"
          bind:value={form.include_month}
          label="Incluir mes"
          placeholder="Ingresa incluir mes"
          required={ false }
          
          tabindex={ 6 }
          error={validationErrors.include_month}
          on:input={() => clearFieldError('include_month')}
        />
      </div>
      <div>
        <Input
          id="number_length"
          type="number"
          bind:value={form.number_length}
          label="Longitud del número *"
          placeholder="Ingresa longitud del número"
          required={ true }
          
          tabindex={ 7 }
          error={validationErrors.number_length}
          on:input={() => clearFieldError('number_length')}
        />
      </div>
      <div>
        <Input
          id="module"
          type="text"
          bind:value={form.module}
          label="Módulo *"
          placeholder="Ingresa módulo"
          required={ true }
          
          tabindex={ 8 }
          error={validationErrors.module}
          on:input={() => clearFieldError('module')}
        />
      </div>

          <div class="flex justify-end space-x-4 pt-6 border-t border-border">
            <button
              type="button"
              on:click={() => goto('/documenttypes')}
              disabled={loading}
              class="px-4 py-2 text-sm font-medium text-secondary bg-surface hover:bg-muted rounded-lg border border-border disabled:opacity-50 transition-colors"
              tabindex={ 9 }
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              class="px-4 py-2 text-sm font-medium text-inverse bg-primary-600 hover:bg-primary-700 rounded-lg disabled:opacity-50 transition-colors"
              tabindex={ 10 }
            >
              {loading ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
