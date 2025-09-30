// Types for the enhanced Select component

export type SelectItem = Record<string, any>;

// External search function type
export type ExternalSearchFunction<T = SelectItem> = (
	query: string,
	params?: {
		page?: number;
		limit?: number;
		sortBy?: string;
		sortDirection?: 'asc' | 'desc';
	}
) => Promise<{
	data: T[];
	pagination?: {
		current_page: number;
		limit: number;
		total: number;
		total_pages: number;
	};
}>;

export interface SelectProps<T = SelectItem> {
	// Core functionality
	value?: any;
	multiple?: boolean;
	searchable?: boolean;
	clearable?: boolean;
	disabled?: boolean;

	// Display & content
	label?: string;
	placeholder?: string;
	emptyText?: string;
	loadingText?: string;
	error?: string;

	// Styling
	className?: string;
	size?: 'sm' | 'md' | 'lg';

	// Data handling
	items?: T[];
	getValue?: (item: T) => any;
	getLabel?: (item: T) => string;
	getDisabled?: (item: T) => boolean;

	// External search
	externalSearch?: ExternalSearchFunction<T>;
	searchDebounceMs?: number;
	minSearchLength?: number;
	searchParams?: {
		page?: number;
		limit?: number;
		sortBy?: string;
		sortDirection?: 'asc' | 'desc';
	};
}

export interface SelectEvents<T = SelectItem> {
	change: { value: any; item: T | T[] | null };
	select: { item: T };
	deselect: { item: T };
	clear: void;
	search: { term: string };
}

// Common item structures for convenience
export interface SimpleSelectItem {
	value: string | number;
	label: string;
	disabled?: boolean;
}

export interface RoleSelectItem {
	id: string;
	name: string;
	description?: string;
	disabled?: boolean;
}

export interface UserSelectItem {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	active?: boolean;
}

// Helper function to create a role search function
export const createRoleSearchFunction = (roleService: any): ExternalSearchFunction => {
	return async (query: string, params = {}) => {
		const { page = 1, limit = 20, sortBy = '', sortDirection = 'asc' } = params;

		const response = await roleService.getAll({
			page,
			limit,
			search: query,
			sort_by: sortBy,
			sort_direction: sortDirection
		});

		return {
			data: response.data || [],
			pagination: response.pagination
		};
	};
};

// Helper functions for common patterns
export const selectHelpers = {
	// For simple value/label objects
	simple: {
		getValue: (item: SimpleSelectItem) => item.value,
		getLabel: (item: SimpleSelectItem) => item.label,
		getDisabled: (item: SimpleSelectItem) => item.disabled || false
	},

	// For role objects
	role: {
		getValue: (item: RoleSelectItem) => item.id,
		getLabel: (item: RoleSelectItem) => item.name,
		getDisabled: (item: RoleSelectItem) => item.disabled || false
	},

	// For user objects
	user: {
		getValue: (item: UserSelectItem) => item.id,
		getLabel: (item: UserSelectItem) => `${item.firstName} ${item.lastName} (${item.email})`,
		getDisabled: (item: UserSelectItem) => !item.active
	}
};
