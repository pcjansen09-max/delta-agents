/**
 * Moneybird API types (subset voor MVP).
 * Volledige API docs: https://developer.moneybird.com
 */

export interface MoneybirdAdministration {
  id: string;
  name: string;
  language: string;
  country: string;
  currency: string;
}

export interface MoneybirdContact {
  id: string;
  company_name: string | null;
  firstname: string | null;
  lastname: string | null;
  address1: string | null;
  zipcode: string | null;
  city: string | null;
  country: string | null;
  email: string | null;
  phone: string | null;
  customer_id: string | null;
  tax_number: string | null;
  notes: string | null;
}

export interface MoneybirdProduct {
  id: string;
  description: string;
  price: string;          // bedragen komen als string uit Moneybird
  currency: string;
  tax_rate_id: string | null;
  ledger_account_id: string | null;
}

export interface MoneybirdSalesInvoice {
  id: string;
  contact_id: string;
  invoice_id: string;
  state: "draft" | "open" | "scheduled" | "pending_payment" | "late" | "reminded" | "paid" | "uncollectible";
  invoice_date: string;
  due_date: string;
  total_price_incl_tax: string;
  url: string;
  details: MoneybirdInvoiceLine[];
}

export interface MoneybirdInvoiceLine {
  id?: string;
  description: string;
  amount: string;
  price: string;
  tax_rate_id?: string | null;
  product_id?: string | null;
}

export interface MoneybirdTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: number;       // seconden tot verloop
  scope: string;
  created_at: number;
}
