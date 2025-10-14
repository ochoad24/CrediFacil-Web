// Auto-generated Page Loader for Agencies List
// Do not edit manually - use generate-crud-frontend command

import type { PageLoad } from './$types';
import { requireAuth } from '$lib/utils/auth-guard';
import { requirePermission } from '$lib/utils/permission-guard';

export const load: PageLoad = async ({ url }) => {
  await requireAuth();
  requirePermission({
    permission: 'agencies.read',
    redirectTo: '/'
  });

  // Extract search parameters for initial state
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');
  const search = url.searchParams.get('search') || '';
  const sort_by = url.searchParams.get('sort_by') || '';
  const sort_direction = url.searchParams.get('sort_direction') || 'asc';

  return {
    searchParams: {
      page,
      limit,
      search,
      sort_by,
      sort_direction
    }
  };
};
