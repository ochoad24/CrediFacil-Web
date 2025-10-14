// Auto-generated Service for Company API calls
// Do not edit manually - use generate-crud-frontend command

import { apiClient } from '../api/client';
import type {
  Company,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CompanyResponse,
  CompaniesResponse,
  CompanySearchParams
} from '$lib/types/company';

class CompanyService {
  private baseUrl = '/v1/companies';

  /**
   * Get all companies with pagination, search and sorting
   */
  async getAll(params: CompanySearchParams = {}): Promise<CompaniesResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.sort_by) searchParams.set('sort_by', params.sort_by);
    if (params.sort_direction) searchParams.set('sort_direction', params.sort_direction);

    const url = searchParams.toString()
      ? `${this.baseUrl}?${searchParams.toString()}`
      : this.baseUrl;

    const response = await apiClient.get<CompaniesResponse>(url);
    return response as unknown as CompaniesResponse;
  }

  /**
   * Get a single company by ID
   */
  async getById(id: string): Promise<CompanyResponse> {
    const response = await apiClient.get<CompanyResponse>(`${this.baseUrl}/${id}`);
    return response as unknown as CompanyResponse;
  }

  /**
   * Create a new company
   */
  async create(data: CreateCompanyRequest): Promise<CompanyResponse> {
    const response = await apiClient.post<CompanyResponse>(this.baseUrl, data);
    return response as unknown as CompanyResponse;
  }

  /**
   * Update an existing company
   */
  async update(id: string, data: UpdateCompanyRequest): Promise<CompanyResponse> {
    const response = await apiClient.put<CompanyResponse>(`${this.baseUrl}/${id}`, data);
    return response as unknown as CompanyResponse;
  }

  /**
   * Delete a company (soft delete)
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

export const companyService = new CompanyService();
