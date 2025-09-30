// Auto-generated Service for Role API calls
// Do not edit manually - use generate-crud-frontend command

import { apiClient } from '../api/client';
import type {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  RoleResponse,
  RolesResponse,
  RoleSearchParams
} from '$lib/types/role';

class RoleService {
  private baseUrl = '/v1/roles';

  /**
   * Get all roles with pagination, search and sorting
   */
  async getAll(params: RoleSearchParams = {}): Promise<RolesResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.sort_by) searchParams.set('sort_by', params.sort_by);
    if (params.sort_direction) searchParams.set('sort_direction', params.sort_direction);

    const url = searchParams.toString()
      ? `${this.baseUrl}?${searchParams.toString()}`
      : this.baseUrl;

    const response = await apiClient.get<RolesResponse>(url);
    return response as unknown as RolesResponse;
  }

  /**
   * Get a single role by ID
   */
  async getById(id: string): Promise<RoleResponse> {
    const response = await apiClient.get<RoleResponse>(`${this.baseUrl}/${id}`);
    return response as unknown as RoleResponse;
  }

  /**
   * Create a new role
   */
  async create(data: CreateRoleRequest): Promise<RoleResponse> {
    const response = await apiClient.post<RoleResponse>(this.baseUrl, data);
    return response as unknown as RoleResponse;
  }

  /**
   * Update an existing role
   */
  async update(id: string, data: UpdateRoleRequest): Promise<RoleResponse> {
    const response = await apiClient.put<RoleResponse>(`${this.baseUrl}/${id}`, data);
    return response as unknown as RoleResponse;
  }

  /**
   * Delete a role (soft delete)
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    return response as unknown as { message: string };
  }

  // Related data fetching methods
}

export const roleService = new RoleService();
