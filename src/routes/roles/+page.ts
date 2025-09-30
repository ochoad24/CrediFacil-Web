// Auto-generated Page Loader for Roles List
// Do not edit manually - use generate-crud-frontend command

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
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
