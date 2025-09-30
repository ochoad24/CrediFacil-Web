import { apiClient, type ApiResponse } from '../api/client';
import type { User } from '$lib/types/user';

interface LoginCredentials {
	username: string;
	password: string;
}

interface LoginResponse {
	message: string;
	user: {
		id: string;
		username: string;
		name: string;
	};
}

interface RegisterData {
	name: string;
	email: string;
	phone: string;
	password: string;
	confirmPassword: string;
}

class AuthService {
	async login(credentials: LoginCredentials): Promise<LoginResponse> {
		const response = await apiClient.post<LoginResponse>('/v1/auth/login', credentials);
		return response.data;
	}

	async register(data: RegisterData): Promise<User> {
		const response = await apiClient.post<User>('/v1/auth/register', data);
		return response.data;
	}

	async logout(): Promise<void> {
		await apiClient.post('/v1/auth/logout');
	}

	async refreshToken(refreshToken: string): Promise<LoginResponse> {
		const response = await apiClient.post<LoginResponse>('/v1/auth/refresh', {
			refreshToken
		});
		return response.data;
	}

	async getCurrentUser(): Promise<User> {
		const response = await apiClient.get<User>('/v1/auth/me');
		return response.data;
	}

	async forgotPassword(email: string): Promise<void> {
		await apiClient.post('/v1/auth/forgot-password', { email });
	}

	async resetPassword(token: string, password: string): Promise<void> {
		await apiClient.post('/v1/auth/reset-password', { token, password });
	}

	async changePassword(currentPassword: string, newPassword: string): Promise<void> {
		await apiClient.post('/v1/auth/change-password', {
			currentPassword,
			newPassword
		});
	}

	async verifyEmail(token: string): Promise<void> {
		await apiClient.post('/v1/auth/verify-email', { token });
	}
}

export const authService = new AuthService();
