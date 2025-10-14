// Auto-generated TypeScript types for Agency
// Do not edit manually - use generate-crud-frontend command

export interface Agency {
  name: string;
  company_id: string;
  address: string;
  phone: string;
  email: string;
  manager_name: string;
  is_active: boolean;
  opening_date: string;
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

export interface CreateAgencyRequest {
  name: string;
  company_id?: string;
  address?: string;
  phone?: string;
  email?: string;
  manager_name?: string;
  is_active?: boolean;
  opening_date?: string;
  notes?: string;
  document_type_code: string;
  document_number?: string;
  created_by_id?: string | undefined;
  updated_by_id?: string | undefined;

}

export interface UpdateAgencyRequest {
  name?: string;
  company_id?: string;
  address?: string;
  phone?: string;
  email?: string;
  manager_name?: string;
  is_active?: boolean;
  opening_date?: string;
  notes?: string;
  document_type_code?: string;
  document_number?: string;
  created_by_id?: string | undefined;
  updated_by_id?: string | undefined;

}

export interface AgencyResponse {
  data: Agency;
}

export interface AgenciesResponse {
  data: Agency[];
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

export interface AgencySearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}