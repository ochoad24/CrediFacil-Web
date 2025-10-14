export interface FileUser {
	id: string;
	name: string;
	username: string;
}

export interface File {
	id: string;
	original_name: string;
	storage_path: string;
	bucket_name: string;
	file_size: number;
	mime_type: string;
	extension: string;
	hash: string;
	thumbnail_path?: string;
	created_by_id: string;
	created_by_user?: FileUser;
	updated_by_id?: string;
	updated_by_user?: FileUser;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
}

export interface FileUploadRequest {
	file: globalThis.File;
	bucket_name: string;
}

export interface FileUpdateRequest {
	file?: globalThis.File;
	file_name?: string;
}

export interface FileListParams {
	page?: number;
	limit?: number;
	search?: string;
	sort_by?: 'original_name' | 'bucket_name' | 'file_size' | 'created_at' | 'updated_at';
	sort_direction?: 'asc' | 'desc';
}

export interface FilePagination {
	current_page: number;
	limit: number;
	total: number;
	total_pages: number;
	search?: string;
	sort_by?: string;
	sort_direction?: string;
}

export interface FileListResponse {
	data: File[];
	pagination: FilePagination;
}

export interface FileResponse {
	data: File;
	message?: string;
}

export interface FileUploadResponse {
	data: File;
	message: string;
}

export interface FileDeleteResponse {
	message: string;
}
