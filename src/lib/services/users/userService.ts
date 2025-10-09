import { apiClient } from '../api/client';
import type { Role } from '$lib/types/role';

interface User {
	id: string;
	name: string;
	username: string;
	phone: string;
	status: string;
	role_id: string;
	role?: Role;
	created_at: string;
	updated_at: string;
}

interface CreateUserRequest {
	name: string;
	username: string;
	phone: string;
	password: string;
	role_id: string;
}

interface UpdateUserRequest {
	name?: string;
	username?: string;
	phone?: string;
	password?: string;
	role_id?: string;
	status?: string;
}

interface UsersResponse {
	data: User[];
	pagination: {
		current_page: number;
		limit: number;
		total: number;
		total_pages: number;
	};
}

interface UserResponse {
	data: User;
	message?: string;
}

class UserService {
	private baseUrl = '/v1/users';

	async getAllUsers(
		page: number = 1,
		limit: number = 10,
		search: string = '',
		sortBy: string = '',
		sortDirection: string = 'asc'
	): Promise<UsersResponse> {
		const params = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString()
		});

		if (search.trim()) {
			params.append('search', search.trim());
		}

		if (sortBy.trim()) {
			params.append('sort_by', sortBy.trim());
			params.append('sort_direction', sortDirection);
		}

		const response = await apiClient.get<UsersResponse>(`${this.baseUrl}?${params}`);
		return response as unknown as UsersResponse;
	}

	async getUserById(id: string): Promise<UserResponse> {
		const response = await apiClient.get<UserResponse>(`${this.baseUrl}/${id}`);
		return response as unknown as UserResponse;
	}

	async createUser(userData: CreateUserRequest): Promise<UserResponse> {
		const response = await apiClient.post<UserResponse>(this.baseUrl, userData);
		return response as unknown as UserResponse;
	}

	async updateUser(id: string, userData: UpdateUserRequest): Promise<UserResponse> {
		const response = await apiClient.put<UserResponse>(`${this.baseUrl}/${id}`, userData);
		return response as unknown as UserResponse;
	}

	async deleteUser(id: string): Promise<{ message: string }> {
		const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`);
		return response as unknown as { message: string };
	}

	async unlockUser(id: string): Promise<{ message: string }> {
		const response = await apiClient.post<{ message: string }>(`${this.baseUrl}/${id}/unlock`, {});
		return response as unknown as { message: string };
	}
}

export const userService = new UserService();
export type { User, CreateUserRequest, UpdateUserRequest, UsersResponse, UserResponse };
