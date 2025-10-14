// Auto-generated Page Loader for Company Create
// Do not edit manually - use generate-crud-frontend command

import { requireAuth } from '$lib/utils/auth-guard';
import { requirePermission } from '$lib/utils/permission-guard';

export const load = async () => {
  await requireAuth();
  requirePermission({
    permission: 'companies.create',
    redirectTo: '/companies'
  });
  return {};
};
