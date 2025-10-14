// Auto-generated Service for DocumentType API calls
// Do not edit manually - use generate-crud-frontend command

import { apiClient } from '../api/client';
import type {
  DocumentType,
  CreateDocumentTypeRequest,
  UpdateDocumentTypeRequest,
  DocumentTypeResponse,
  DocumentTypesResponse,
  DocumentTypeSearchParams
} from '$lib/types/documenttype';

class DocumentTypeService {
  private baseUrl = '/v1/documenttypes';

  /**
   * Get all documenttypes with pagination, search and sorting
   */
  async getAll(params: DocumentTypeSearchParams = {}): Promise<DocumentTypesResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.search) searchParams.set('search', params.search);
    if (params.sort_by) searchParams.set('sort_by', params.sort_by);
    if (params.sort_direction) searchParams.set('sort_direction', params.sort_direction);

    const url = searchParams.toString()
      ? `${this.baseUrl}?${searchParams.toString()}`
      : this.baseUrl;

    const response = await apiClient.get<DocumentTypesResponse>(url);
    return response as unknown as DocumentTypesResponse;
  }

  /**
   * Get a single documenttype by ID
   */
  async getById(id: string): Promise<DocumentTypeResponse> {
    const response = await apiClient.get<DocumentTypeResponse>(`${this.baseUrl}/${id}`);
    return response as unknown as DocumentTypeResponse;
  }

  /**
   * Create a new documenttype
   */
  async create(data: CreateDocumentTypeRequest): Promise<DocumentTypeResponse> {
    const response = await apiClient.post<DocumentTypeResponse>(this.baseUrl, data);
    return response as unknown as DocumentTypeResponse;
  }

  /**
   * Update an existing documenttype
   */
  async update(id: string, data: UpdateDocumentTypeRequest): Promise<DocumentTypeResponse> {
    const response = await apiClient.put<DocumentTypeResponse>(`${this.baseUrl}/${id}`, data);
    return response as unknown as DocumentTypeResponse;
  }

  /**
   * Delete a documenttype (soft delete)
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

export const documenttypeService = new DocumentTypeService();
