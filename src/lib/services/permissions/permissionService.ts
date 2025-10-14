import { apiClient } from '../api/client';
import type {
	ModulePermissions,
	ModulePermissionsWithAssignment,
	AssignPermissionRequest
} from '$lib/types/permission';

export const permissionService = {
	/**
	 * Get all permissions grouped by module
	 */
	async getAllGroupedByModule(): Promise<{ data: ModulePermissions[] }> {
		const response = await apiClient.get<{ data: ModulePermissions[] }>('/v1/permissions/grouped');
		return response.data;
	},

	/**
	 * Get all permissions with assignment status for a specific role
	 */
	async getRolePermissions(roleId: string): Promise<ModulePermissionsWithAssignment[]> {
		const response = await apiClient.get<ModulePermissionsWithAssignment[]>(
			`/v1/roles/${roleId}/permissions`
		);
		return response.data;
	},

	/**
	 * Assign a permission to a role
	 */
	async assignPermissionToRole(roleId: string, permissionId: string): Promise<{ message: string }> {
		const request: AssignPermissionRequest = { permission_id: permissionId };
		const response = await apiClient.post<{ message: string }>(
			`/v1/roles/${roleId}/permissions/assign`,
			request
		);
		return response.data;
	},

	/**
	 * Remove a permission from a role
	 */
	async removePermissionFromRole(roleId: string, permissionId: string): Promise<{ message: string }> {
		const response = await apiClient.delete<{ message: string }>(
			`/v1/roles/${roleId}/permissions/${permissionId}`
		);
		return response.data;
	}
};
