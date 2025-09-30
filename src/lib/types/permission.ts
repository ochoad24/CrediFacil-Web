// Auto-generated TypeScript types for Permission
// Do not edit manually - use generate-crud-frontend command

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  module: string;
  action: string;
  status: string;
  role_permissions: any[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CreatePermissionRequest {
  name: string;
  description?: string | null;
  module: string;
  action: string;
  status?: string;
}

export interface UpdatePermissionRequest {
  name?: string;
  description?: string | null;
  module?: string;
  action?: string;
  status?: string;
}

export interface PermissionResponse {
  data: Permission;
}

export interface PermissionsResponse {
  data: Permission[];
  pagination: {
    current_page: number;
    limit: number;
    total: number;
    total_pages: number;
    search: string;
    sort_by: string;
    sort_direction: string;
  };
}

export interface PermissionSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}
