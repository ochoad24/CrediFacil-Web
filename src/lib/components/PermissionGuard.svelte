<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		permission?: string;
		anyOf?: string[];
		allOf?: string[];
		fallback?: Snippet;
		children: Snippet;
	}

	let { permission, anyOf, allOf, fallback, children }: Props = $props();

	// Función derivada que verifica los permisos
	let hasAccess = $derived.by(() => {
		if (permission) {
			return authStore.hasPermission(permission);
		}
		if (anyOf && anyOf.length > 0) {
			return authStore.hasAnyPermission(anyOf);
		}
		if (allOf && allOf.length > 0) {
			return authStore.hasAllPermissions(allOf);
		}
		return false;
	});
</script>

{#if hasAccess}
	{@render children()}
{:else if fallback}
	{@render fallback()}
{/if}
