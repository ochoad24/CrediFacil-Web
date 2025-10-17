// Auto-generated TypeScript types for DocumentType
// Do not edit manually - use generate-crud-frontend command

export interface DocumentType {
  code: string;
  name: string;
  description: string | null;
  prefix: string;
  include_year: boolean;
  include_month: boolean;
  number_length: number;
  format: string;
  module: string;
  status: string;
  is_system: boolean;
  created_by_id: string | null;
  updated_by_id: string | null;
  created_by: any | null;
  updated_by: any | null;
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;

}

export interface CreateDocumentTypeRequest {
  code: string;
  name: string;
  description?: string | undefined;
  prefix: string;
  include_year?: boolean;
  include_month?: boolean;
  number_length?: number;
  format: string;
  module: string;
  status?: string;
  is_system?: boolean;
  created_by_id?: string | undefined;
  updated_by_id?: string | undefined;

}

export interface UpdateDocumentTypeRequest {
  code?: string;
  name?: string;
  description?: string | undefined;
  prefix?: string;
  include_year?: boolean;
  include_month?: boolean;
  number_length?: number;
  format?: string;
  module?: string;
  status?: string;
  is_system?: boolean;
  created_by_id?: string | undefined;
  updated_by_id?: string | undefined;

}

export interface DocumentTypeResponse {
  data: DocumentType;
}

export interface DocumentTypesResponse {
  data: DocumentType[];
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

export interface DocumentTypeSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}