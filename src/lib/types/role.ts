// Auto-generated TypeScript types for Role
// Do not edit manually - use generate-crud-frontend command

export interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  status: string;
  role_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  module: string;
  action: string;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  permission: Permission;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  status: string;
  is_system: boolean;
  users: User[];
  role_permissions: RolePermission[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

}

export interface CreateRoleRequest {
  name: string;
  description?: string | undefined;
  status?: string;
  is_system?: boolean;

}

export interface UpdateRoleRequest {
  name?: string;
  description?: string | undefined;
  status?: string;
  is_system?: boolean;

}

export interface RoleResponse {
  data: Role;
}

export interface RolesResponse {
  data: Role[];
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

export interface RoleSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}