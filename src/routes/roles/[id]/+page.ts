// Auto-generated Page Loader for Role Detail
// Do not edit manually - use generate-crud-frontend command

import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  const { id } = params;

  if (!id) {
    throw error(404, 'ID no proporcionado');
  }

  return {
    id
  };
};
