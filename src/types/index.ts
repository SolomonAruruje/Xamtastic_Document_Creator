export type DocumentType = "invoice" | "quotation" | "receipt";

export interface BusinessInfo {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
  logo?: string;
}

export interface ClientInfo {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  email: string;
  phone?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}