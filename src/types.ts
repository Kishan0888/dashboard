export type DocumentId = string;

export type Product = {
	id: DocumentId;
	name: string;
	description?: string;
	active: boolean;
	createdAt: number;
	updatedAt: number;
};

export type TeamMember = {
	id: DocumentId;
	name: string;
	email?: string;
	active: boolean;
	createdAt: number;
	updatedAt: number;
};

export type SalesCampaign = {
	id: DocumentId;
	productId: DocumentId;
	numOrders: number;
	orderValue: number;
	date: string; // YYYY-MM-DD
	createdAt: number;
	updatedAt: number;
};

export type RecurringSales = {
	id: DocumentId;
	productId: DocumentId;
	teamMemberId: DocumentId;
	numOrders: number;
	orderValue: number;
	date: string;
	createdAt: number;
	updatedAt: number;
};

export type AbandonedCart = {
	id: DocumentId;
	productId: DocumentId;
	totalOrdersCreated: number;
	conversion: number; // 0..100 percent
	orderValue: number;
	date: string;
	createdAt: number;
	updatedAt: number;
};

export type LeadGeneration = {
	id: DocumentId;
	productId: DocumentId;
	totalLeads: number;
	conversion: number; // 0..100 percent
	orderValue: number;
	date: string;
	createdAt: number;
	updatedAt: number;
};

export type MediaEngagement = {
	id: DocumentId;
	numOrders: number;
	totalOrderValue: number;
	date: string;
	createdAt: number;
	updatedAt: number;
};

export type ChannelRecord =
	| { channel: 'salesCampaign'; data: SalesCampaign }
	| { channel: 'recurringSales'; data: RecurringSales }
	| { channel: 'abandonedCart'; data: AbandonedCart }
	| { channel: 'leadGeneration'; data: LeadGeneration }
	| { channel: 'mediaEngagement'; data: MediaEngagement };
