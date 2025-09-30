<!-- Auto-generated Create Page for Permission -->
<!-- Do not edit manually - use generate-crud-frontend command -->

<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import { PermissionService } from '$lib/services/permissions/permissionService';
  import type { CreatePermissionRequest } from '$lib/types/permission';

  // Form data
  let form: CreatePermissionRequest = {
    name: '',
    description: undefined,
    module: '',
    action: '',
    status: '',
  };

  // Component state
  let loading = false;
  let errors: Record<string, string> = {};

  // Related data

  // Load related data
  async function loadRelatedData() {
  }

  // Handle form submission
  async function handleSubmit() {
    loading = true;
    errors = {};

    try {
      await PermissionService.create(form);
      goto('/permissions');
    } catch (err: any) {
      console.error('Error creating permission:', err);

      // Handle validation errors
      if (err.response?.data?.errors) {
        errors = err.response.data.errors;
      } else {
        errors.general = 'Error al crear permission';
      }
    } finally {
      loading = false;
    }
  }

  // Load related data on mount
  loadRelatedData();
</script>

<svelte:head>
  <title>Crear Permission - CrediFacil</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="max-w-2xl mx-auto">
    <div class="flex items-center mb-6">
      <Button
        variant="outline"
        onClick={() => goto('/permissions')}
        class="mr-4"
      >
        ← Volver
      </Button>
      <h1 class="text-3xl font-bold text-gray-900">Crear Permission</h1>
    </div>

    {#if errors.general}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        {errors.general}
      </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <Input
          id="name"
          type="text"
          bind:value={form.name}
          placeholder="Ingresa name"
          required={ true }
          error={errors.name}
        />
        {#if errors.name}
          <p class="text-red-600 text-sm mt-1">{errors.name}</p>
        {/if}
      </div>
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          id="description"
          bind:value={form.description}
          placeholder="Ingresa description"
          rows={3}
          required={ false }
          error={errors.description}
        />
        {#if errors.description}
          <p class="text-red-600 text-sm mt-1">{errors.description}</p>
        {/if}
      </div>
      <div>
        <label for="module" class="block text-sm font-medium text-gray-700 mb-1">
          Module *
        </label>
        <Input
          id="module"
          type="text"
          bind:value={form.module}
          placeholder="Ingresa module"
          required={ true }
          error={errors.module}
        />
        {#if errors.module}
          <p class="text-red-600 text-sm mt-1">{errors.module}</p>
        {/if}
      </div>
      <div>
        <label for="action" class="block text-sm font-medium text-gray-700 mb-1">
          Action *
        </label>
        <Input
          id="action"
          type="text"
          bind:value={form.action}
          placeholder="Ingresa action"
          required={ true }
          error={errors.action}
        />
        {#if errors.action}
          <p class="text-red-600 text-sm mt-1">{errors.action}</p>
        {/if}
      </div>
      <div>
        <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <Select
          id="status"
          bind:value={form.status}
          required={ false }
          error={errors.status}
        >
          <option value="">Selecciona status</option>
          <!-- Add options based on your enum/status values -->
        </Select>
        {#if errors.status}
          <p class="text-red-600 text-sm mt-1">{errors.status}</p>
        {/if}
      </div>

      <div class="flex justify-end space-x-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => goto('/permissions')}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Permission'}
        </Button>
      </div>
    </form>
  </div>
</div>
