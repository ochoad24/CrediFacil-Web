// Application constants

// API Configuration
export const API_CONFIG = {
	BASE_URL: '/api',
	TIMEOUT: 30000,
	RETRY_ATTEMPTS: 3
} as const;

// Authentication
export const AUTH_CONFIG = {
	TOKEN_KEY: 'auth_token',
	REFRESH_TOKEN_KEY: 'refresh_token',
	TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
	SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes in milliseconds
} as const;

// Credit Business Rules
export const CREDIT_LIMITS = {
	MIN_AMOUNT: 1000,
	MAX_AMOUNT: 1000000,
	MIN_TERM: 6, // months
	MAX_TERM: 60, // months
	DEFAULT_INTEREST_RATE: 12, // percentage
	MAX_DEBT_TO_INCOME_RATIO: 40 // percentage
} as const;

// User Roles and Permissions
export const USER_ROLES = {
	ADMIN: 'admin',
	MANAGER: 'manager',
	AGENT: 'agent',
	CLIENT: 'client'
} as const;

export const PERMISSIONS = {
	CREDITS: {
		VIEW: 'credits.view',
		CREATE: 'credits.create',
		EDIT: 'credits.edit',
		DELETE: 'credits.delete',
		APPROVE: 'credits.approve',
		DISBURSE: 'credits.disburse'
	},
	USERS: {
		VIEW: 'users.view',
		CREATE: 'users.create',
		EDIT: 'users.edit',
		DELETE: 'users.delete'
	},
	REPORTS: {
		VIEW: 'reports.view',
		EXPORT: 'reports.export'
	}
} as const;

// Credit Status Workflow
export const CREDIT_STATUS_FLOW = {
	draft: ['submitted', 'cancelled'],
	submitted: ['under_review', 'cancelled'],
	under_review: ['approved', 'rejected'],
	approved: ['disbursed', 'cancelled'],
	rejected: [],
	disbursed: ['active'],
	active: ['completed', 'defaulted'],
	completed: [],
	defaulted: [],
	cancelled: []
} as const;

// Payment Configuration
export const PAYMENT_CONFIG = {
	GRACE_PERIOD_DAYS: 5,
	LATE_FEE_PERCENTAGE: 2,
	DEFAULT_THRESHOLD_DAYS: 30
} as const;

// File Upload Configuration
export const FILE_CONFIG = {
	MAX_SIZE: 5 * 1024 * 1024, // 5MB
	ALLOWED_TYPES: [
		'image/jpeg',
		'image/png',
		'image/gif',
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	],
	ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx']
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
	INFO: 'info',
	SUCCESS: 'success',
	WARNING: 'warning',
	ERROR: 'error'
} as const;

// Date Formats
export const DATE_FORMATS = {
	DISPLAY: 'DD/MM/YYYY',
	DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
	ISO: 'YYYY-MM-DD',
	DATABASE: 'YYYY-MM-DD HH:mm:ss'
} as const;

// Pagination Defaults
export const PAGINATION_DEFAULTS = {
	PAGE: 1,
	LIMIT: 10,
	MAX_LIMIT: 100
} as const;

// Guatemala specific constants
export const GUATEMALA_CONFIG = {
	PHONE_PREFIX: '+502',
	PHONE_LENGTH: 8,
	CURRENCY: 'GTQ',
	CURRENCY_SYMBOL: 'Q',
	LOCALE: 'es-GT',
	TIMEZONE: 'America/Guatemala'
} as const;
