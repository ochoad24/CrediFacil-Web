export interface Permission {
	id: string;
	name: string;
	description?: string | null;
	module: string;
	action: string;
	status: 'ACTIVE' | 'INACTIVE';
	created_at: string;
	updated_at: string;
}

export interface PermissionWithAssignment extends Permission {
	assigned: boolean;
}

export interface ModulePermissions {
	module: string;
	permissions: Permission[];
}

export interface ModulePermissionsWithAssignment {
	module: string;
	permissions: PermissionWithAssignment[];
}

export interface AssignPermissionRequest {
	permission_id: string;
}
