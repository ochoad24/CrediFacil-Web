// Auto-generated Page Loader for DocumentType Detail
// Do not edit manually - use generate-crud-frontend command

import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { requireAuth } from '$lib/utils/auth-guard';
import { requirePermission } from '$lib/utils/permission-guard';

export const load: PageLoad = async ({ params }) => {
  await requireAuth();
  requirePermission({
    permission: 'documenttypes.read',
    redirectTo: '/documenttypes'
  });

  const { id } = params;

  if (!id) {
    throw error(404, 'ID no proporcionado');
  }

  return {
    id
  };
};
