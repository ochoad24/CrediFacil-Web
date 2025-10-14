// Auto-generated TypeScript types for Company
// Do not edit manually - use generate-crud-frontend command

export interface Company {
  name: string;
  legal_name: string;
  tax_id: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  is_active: boolean;
  established_date: string;
  notes: string;
  document_type_code: string;
  document_type: string;
  document_number: string;
  created_by_id: string | null;
  updated_by_id: string | null;
  created_by: any | null;
  updated_by: any | null;
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

}

export interface CreateCompanyRequest {
  name: string;
  legal_name?: string;
  tax_id?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  is_active?: boolean;
  established_date?: string;
  notes?: string;
  document_type_code: string;
  document_number?: string;
  created_by_id?: string | undefined;
  updated_by_id?: string | undefined;

}

export interface UpdateCompanyRequest {
  name?: string;
  legal_name?: string;
  tax_id?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  is_active?: boolean;
  established_date?: string;
  notes?: string;
  document_type_code?: string;
  document_number?: string;
  created_by_id?: string | undefined;
  updated_by_id?: string | undefined;

}

export interface CompanyResponse {
  data: Company;
}

export interface CompaniesResponse {
  data: Company[];
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

export interface CompanySearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}