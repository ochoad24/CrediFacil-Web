<!-- Auto-generated Edit Page for Permission -->
<!-- Do not edit manually - use generate-crud-frontend command -->

<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Button from '$lib/components/ui/Button.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Textarea from '$lib/components/ui/Textarea.svelte';
  import { PermissionService } from '$lib/services/permissions/permissionService';
  import type { Permission, UpdatePermissionRequest } from '$lib/types/permission';

  // Get ID from URL params
  $: id = $page.params.id;

  // Form data
  let form: UpdatePermissionRequest = {};
  let originalPermission: Permission | null = null;

  // Component state
  let loading = false;
  let loadingData = false;
  let errors: Record<string, string> = {};
  let error = '';

  // Related data

  // Load permission data
  async function loadPermission() {
    if (!id) return;

    loadingData = true;
    error = '';

    try {
      const response = await PermissionService.getById(id);
      originalPermission = response.data;

      // Populate form with current data
      form = `{
        name: original