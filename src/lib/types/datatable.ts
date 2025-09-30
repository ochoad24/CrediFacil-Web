export interface Column<T> {
	key: string;
	title: string;
	sortable?: boolean;
	render?: (value: unknown, item: T) => string;
	className?: string;
}

export interface PaginationInfo {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface DataTableProps<T> {
	data: T[];
	columns: Column<T>[];
	loading?: boolean;
	searchable?: boolean;
	searchPlaceholder?: string;
	onSearch?: (search: string) => void;
	pagination?: PaginationInfo;
	onPageChange?: (page: number) => void;
	onLimitChange?: (limit: number) => void;
	limitOptions?: number[];
	onSort?: (key: string, direction: 'asc' | 'desc') => void;
	sortKey?: string;
	sortDirection?: 'asc' | 'desc';
	emptyMessage?: string;
	className?: string;
	showRowNumbers?: boolean;
}

export type SortDirection = 'asc' | 'desc';
