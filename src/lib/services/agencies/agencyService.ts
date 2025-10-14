// Auto-generated Service for Agency API calls
// Do not edit manually - use generate-crud-frontend command

import { apiClient } from '../api/client';
import type {
  Agency,
  CreateAgencyRequest,
  UpdateAgencyRequest,
  AgencyResponse,
  AgenciesResponse,
  AgencySearchParams
} from '$lib/types/agency';

class AgencyService {
  private baseUrl = '/v1/agencies';

  /**
   * Get all agencies with pagination, search and sorting
   */
  async getAll(params: AgencySearchParams = {}): Promise<AgenciesResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.sort_by) searchParams.set('sort_by', params.sort_by);
    if (params.sort_direction) searchParams.set('sort_direction', params.sort_direction);

    const url = searchParams.toString()
      ? `${this.baseUrl}?${searchParams.toString()}`
      : this.baseUrl;

    const response = await apiClient.get<AgenciesResponse>(url);
    return response as unknown as AgenciesResponse;
  }

  /**
   * Get a single agency by ID
   */
  async getById(id: string): Promise<AgencyResponse> {
    const response = await apiClient.get<AgencyResponse>(`${this.baseUrl}/${id}`);
    return response as unknown as AgencyResponse;
  }

  /**
   * Create a new agency
   */
  async create(data: CreateAgencyRequest): Promise<AgencyResponse> {
    const response = await apiClient.post<AgencyResponse>(this.baseUrl, data);
    return response as unknown as AgencyResponse;
  }

  /**
   * Update an existing agency
   */
  async update(id: string, data: UpdateAgencyRequest): Promise<AgencyResponse> {
    const response = await apiClient.put<AgencyResponse>(`${this.baseUrl}/${id}`, data);
    return response as unknown as AgencyResponse;
  }

  /**
   * Delete a agency (soft delete)
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    return response as unknown as { message: string };
  }

  // Related data fetching methods

  /**
   * Get all DocumentType for select options
   */
  async getDocumentTypeOptions(): Promise<DocumentType[]> {
    const response = await apiClient.get<{ data: DocumentType[] }>('/v1/documenttypes');
    return (response as any).data;
  }

  /**
   * Get all User for select options
   */
  async getUserOptions(): Promise<User[]> {
    const response = await apiClient.get<{ data: User[] }>('/v1/users');
    return (response as any).data;
  }
}

export const agencyService = new AgencyService();
