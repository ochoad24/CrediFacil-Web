<!-- Auto-generated List Page for Permission -->
<!-- Do not edit manually - use generate-crud-frontend command -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import DataTable from '$lib/components/ui/DataTable.svelte';
  import { PermissionService } from '$lib/services/permissions/permissionService';
  import type { Permission, PermissionSearchParams } from '$lib/types/permission';

  // Reactive data
  let permissions: Permission[] = [];
  let loading = false;
  let error = '';
  let pagination = {
    current_page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
    search: '',
    sort_by: '',
    sort_direction: 'asc' as const
  };

  // Search and filter state
  let searchTerm = '';
  let sortBy = '';
  let sortDirection: 'asc' | 'desc' = 'asc';

  // DataTable configuration
  const columns = [
    {
      key: 'id',
      label: ' ID',
      sortable: true,
      render: (value: string) => ``
        <code class="text-xs bg-gray-100 px-1 rounded">${value.slice(0, 8)}...</code>
      ``
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string) => value || '-'
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      render: (value: any) => value || '-'
    },
    {
      key: 'module',
      label: 'Module',
      sortable: true,
      render: (value: string) => value || '-'
    },
    {
      key: 'action',
      label: 'Action',
      sortable: true,
      render: (value: string) => value || '-'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: any) => value || '-'
    },
    {
      key: 'created_at',
      label: 'Created At',
      sortable: true,
      render: (value: string) => value || '-'
    },
    {
      key: 'updated_at',
      label: 'Updated At',
      sortable: true,
      render: (value: string) => value || '-'
    },
    {
      key: 'deleted_at',
      label: 'Deleted At',
      sortable: false,
      render: (value: any) => value || '-'
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (_, row: Permission) => ``
        <div class="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goto(`/permissions/${row.id}`)}
          >
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goto(`/permissions/${row.id}/edit`)}
          >
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            Eliminar
          </Button>
        </div>
      ``
    }
  ];

  // Load data
  async function loadPermissions() {
    loading = true;
    error = '';

    try {
      const params: PermissionSearchParams = {
        page: pagination.current_page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        sort_by: sortBy || undefined,
        sort_direction: sortDirection
      };

      const response = await PermissionService.getAll(params);
      permissions = response.data;
      pagination = response.pagination;
    } catch (err) {
      error = 'Error al cargar permissions';
      console.error('Error loading permissions:', err);
    } finally {
      loading = false;
    }
  }

  // Handle search
  function handleSearch() {
    pagination.current_page = 1;
    loadPermissions();
  }

  // Handle sort
  function handleSort(column: string, direction: 'asc' | 'desc') {
    sortBy = column;
    sortDirection = direction;
    pagination.current_page = 1;
    loadPermissions();
  }

  // Handle pagination
  function handlePageChange(page: number) {
    pagination.current_page = page;
    loadPermissions();
  }

  // Handle delete
  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar este permission?')) {
      return;
    }

    try {
      await PermissionService.delete(id);
      await loadPermissions(); // Reload data
    } catch (err) {
      error = 'Error al eliminar permission';
      console.error('Error deleting permission:', err);
    }
  }

  // Load data on mount and when URL parameters change
  onMount(() => {
    // Get initial parameters from URL
    const urlParams = $page.url.searchParams;
    searchTerm = urlParams.get('search') || '';
    sortBy = urlParams.get('sort_by') || '';
    sortDirection = (urlParams.get('sort_direction') as 'asc' | 'desc') || 'asc';
    pagination.current_page = parseInt(urlParams.get('page') || '1');

    loadPermissions();
  });
</script>

<svelte:head>
  <title>Permissions - CrediFacil</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold text-gray-900">Permissions</h1>
    <Button onClick={() => goto('/permissions/create')}>
      Crear Permission
    </Button>
  </div>

  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}

  <DataTable
    {columns}
    data={ permissions }
    {loading}
    searchPlaceholder="Buscar permissions..."
    bind:searchTerm
    bind:sortBy
    bind:sortDirection
    {pagination}
    onSearch={handleSearch}
    onSort={handleSort}
    onPageChange={handlePageChange}
  />
</div>
