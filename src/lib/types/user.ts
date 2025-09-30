export interface User {
	id: string;
	name: string;
	phone?: string;
	status: UserStatus;
	role?: Role;
	createdAt: string;
	updatedAt: string;
	lastLoginAt?: string;
}

export enum UserStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
	BLOCKED = 'blocked'
}

export interface Role {
	id: string;
	name: string;
	description?: string;
}

export interface CreateUserRequest {
	name: string;
	phone: string;
	password: string;
	roleId: string;
	status: UserStatus;
}

export interface UpdateUserRequest {
	name?: string;
	phone?: string;
	roleId?: string;
	status?: UserStatus;
}

export interface UpdateUserStatusRequest {
	status: UserStatus;
}
