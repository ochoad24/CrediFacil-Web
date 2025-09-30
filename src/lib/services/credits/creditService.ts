import { apiClient, type ApiResponse } from '../api/client';
import type { Credit, CreditRequest, CreditStatus } from '$lib/types/credit';

interface CreditFilters {
	status?: CreditStatus;
	clientId?: string;
	dateFrom?: string;
	dateTo?: string;
	amountMin?: number;
	amountMax?: number;
	page?: number;
	limit?: number;
}

interface CreditListResponse {
	credits: Credit[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

class CreditService {
	async getCredits(filters?: CreditFilters): Promise<CreditListResponse> {
		const queryParams = new URLSearchParams();

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					queryParams.append(key, value.toString());
				}
			});
		}

		const endpoint = `/credits${queryParams.toString() ? `?${queryParams}` : ''}`;
		const response = await apiClient.get<CreditListResponse>(endpoint);
		return response.data;
	}

	async getCreditById(id: string): Promise<Credit> {
		const response = await apiClient.get<Credit>(`/credits/${id}`);
		return response.data;
	}

	async createCredit(creditRequest: CreditRequest): Promise<Credit> {
		const response = await apiClient.post<Credit>('/credits', creditRequest);
		return response.data;
	}

	async updateCredit(id: string, updates: Partial<Credit>): Promise<Credit> {
		const response = await apiClient.patch<Credit>(`/credits/${id}`, updates);
		return response.data;
	}

	async deleteCredit(id: string): Promise<void> {
		await apiClient.delete(`/credits/${id}`);
	}

	async approveCredit(id: string, approvalNotes?: string): Promise<Credit> {
		const response = await apiClient.post<Credit>(`/credits/${id}/approve`, {
			notes: approvalNotes
		});
		return response.data;
	}

	async rejectCredit(id: string, rejectionReason: string): Promise<Credit> {
		const response = await apiClient.post<Credit>(`/credits/${id}/reject`, {
			reason: rejectionReason
		});
		return response.data;
	}

	async getCreditHistory(id: string): Promise<any[]> {
		const response = await apiClient.get<any[]>(`/credits/${id}/history`);
		return response.data;
	}

	async generateCreditReport(filters?: CreditFilters): Promise<Blob> {
		const queryParams = new URLSearchParams();

		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					queryParams.append(key, value.toString());
				}
			});
		}

		const endpoint = `/credits/report${queryParams.toString() ? `?${queryParams}` : ''}`;

		// For file downloads, we need to use fetch directly
		const token = localStorage.getItem('auth_token');
		const response = await fetch(`/api${endpoint}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		if (!response.ok) {
			throw new Error('Failed to generate report');
		}

		return response.blob();
	}
}

export const creditService = new CreditService();
