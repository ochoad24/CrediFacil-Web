// Central export for all types
export type * from './user';
export type * from './credit';

// Common utility types
export interface PaginationParams {
	page: number;
	limit: number;
}

export interface SortParams {
	sortBy: string;
	sortOrder: 'asc' | 'desc';
}

export interface SearchParams {
	query: string;
	fields?: string[];
}

export interface FilterParams {
	[key: string]: any;
}

export interface ApiListResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface SelectOption {
	value: string | number;
	label: string;
	disabled?: boolean;
}
