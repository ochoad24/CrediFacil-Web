// Auto-generated Service for CompanyType API calls
// Do not edit manually - use generate-crud-frontend command

import { apiClient } from '../api/client';
import type {
  CompanyType,
  CreateCompanyTypeRequest,
  UpdateCompanyTypeRequest,
  CompanyTypeResponse,
  CompanyTypesResponse,
  CompanyTypeSearchParams
} from '$lib/types/companytype';

class CompanyTypeService {
  private baseUrl = '/v1/companytypes';

  /**
   * Get all companytypes with pagination, search and sorting
   */
  async getAll(params: CompanyTypeSearchParams = {}): Promise<CompanyTypesResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.sort_by) searchParams.set('sort_by', params.sort_by);
    if (params.sort_direction) searchParams.set('sort_direction', params.sort_direction);

    const url = searchParams.toString()
      ? `${this.baseUrl}?${searchParams.toString()}`
      : this.baseUrl;

    const response = await apiClient.get<CompanyTypesResponse>(url);
    return response as unknown as CompanyTypesResponse;
  }

  /**
   * Get a single companytype by ID
   */
  async getById(id: string): Promise<CompanyTypeResponse> {
    const response = await apiClient.get<CompanyTypeResponse>(`${this.baseUrl}/${id}`);
    return response as unknown as CompanyTypeResponse;
  }

  /**
   * Create a new companytype
   */
  async create(data: CreateCompanyTypeRequest): Promise<CompanyTypeResponse> {
    const response = await apiClient.post<CompanyTypeResponse>(this.baseUrl, data);
    return response as unknown as CompanyTypeResponse;
  }

  /**
   * Update an existing companytype
   */
  async update(id: string, data: UpdateCompanyTypeRequest): Promise<CompanyTypeResponse> {
    const response = await apiClient.put<CompanyTypeResponse>(`${this.baseUrl}/${id}`, data);
    return response as unknown as CompanyTypeResponse;
  }

  /**
   * Delete a companytype (soft delete)
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    return response as unknown as { message: string };
  }

  // Related data fetching methods

  /**
   * Get all User for select options
   */
  async getUserOptions(): Promise<User[]> {
    const response = await apiClient.get<{ data: User[] }>('/v1/users');
    return (response as any).data;
  }
}

export const companytypeService = new CompanyTypeService();
