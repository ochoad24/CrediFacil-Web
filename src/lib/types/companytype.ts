// Auto-generated TypeScript types for CompanyType
// Do not edit manually - use generate-crud-frontend command

export interface CompanyType {
  name: string;
  description: string;
  code: string;
  status: string;
  category: string;
  createdbyid: string;
  createdbyuser: any;
  updatedbyid: string;
  updatedbyuser: any;
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

}

export interface CreateCompanyTypeRequest {
  name: string;
  description?: string;
  code: string;
  status?: string;
  category?: string;
  createdbyid?: string;
  updatedbyid?: string;

}

export interface UpdateCompanyTypeRequest {
  name?: string;
  description?: string;
  code?: string;
  status?: string;
  category?: string;
  createdbyid?: string;
  updatedbyid?: string;

}

export interface CompanyTypeResponse {
  data: CompanyType;
}

export interface CompanyTypesResponse {
  data: CompanyType[];
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

export interface CompanyTypeSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}