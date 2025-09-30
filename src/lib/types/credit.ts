export interface Credit {
	id: string;
	clientId: string;
	amount: number;
	interestRate: number;
	term: number; // in months
	status: CreditStatus;
	type: CreditType;
	purpose: string;
	approvedAmount?: number;
	approvedAt?: string;
	approvedBy?: string;
	rejectedAt?: string;
	rejectedBy?: string;
	rejectionReason?: string;
	disbursedAt?: string;
	disbursedAmount?: number;
	createdAt: string;
	updatedAt: string;
	client: CreditClient;
	payments: Payment[];
	documents: CreditDocument[];
	collateral?: Collateral[];
}

export interface CreditRequest {
	clientId: string;
	amount: number;
	term: number;
	type: CreditType;
	purpose: string;
	monthlyIncome: number;
	employmentStatus: EmploymentStatus;
	requestedDocuments: string[];
	collateral?: CollateralRequest[];
}

export interface CreditClient {
	id: string;
	name: string;
	email: string;
	phone: string;
	creditScore?: number;
	totalActiveCredits: number;
	totalCreditHistory: number;
}

export interface Payment {
	id: string;
	creditId: string;
	amount: number;
	principal: number;
	interest: number;
	fees: number;
	dueDate: string;
	paidAt?: string;
	status: PaymentStatus;
	paymentMethod?: PaymentMethod;
	transactionId?: string;
}

export interface CreditDocument {
	id: string;
	creditId: string;
	type: DocumentType;
	name: string;
	url: string;
	uploadedAt: string;
	uploadedBy: string;
	status: DocumentStatus;
	verifiedAt?: string;
	verifiedBy?: string;
}

export interface Collateral {
	id: string;
	creditId: string;
	type: CollateralType;
	description: string;
	estimatedValue: number;
	verifiedValue?: number;
	documents: CollateralDocument[];
	status: CollateralStatus;
}

export interface CollateralRequest {
	type: CollateralType;
	description: string;
	estimatedValue: number;
}

export interface CollateralDocument {
	id: string;
	type: string;
	name: string;
	url: string;
}

export type CreditStatus =
	| 'draft'
	| 'submitted'
	| 'under_review'
	| 'approved'
	| 'rejected'
	| 'disbursed'
	| 'active'
	| 'completed'
	| 'defaulted'
	| 'cancelled';

export type CreditType =
	| 'personal'
	| 'business'
	| 'mortgage'
	| 'vehicle'
	| 'education'
	| 'emergency';

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'partial' | 'failed';

export type PaymentMethod = 'bank_transfer' | 'cash' | 'check' | 'online' | 'mobile_payment';

export type DocumentType =
	| 'identification'
	| 'income_proof'
	| 'bank_statement'
	| 'employment_letter'
	| 'tax_return'
	| 'collateral_document'
	| 'other';

export type DocumentStatus = 'uploaded' | 'under_review' | 'approved' | 'rejected' | 'expired';

export type CollateralType =
	| 'real_estate'
	| 'vehicle'
	| 'equipment'
	| 'inventory'
	| 'securities'
	| 'other';

export type CollateralStatus = 'pending' | 'verified' | 'rejected' | 'released';

export type EmploymentStatus = 'employed' | 'self_employed' | 'unemployed' | 'retired' | 'student';
