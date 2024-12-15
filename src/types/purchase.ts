import { ITimezone } from "./organization";

export interface IPurchasesResponse {
  data: IPurchase[];
}

export interface ISendTicket {
  code: string;
  email: string | null;
  first_name: string | null;
  id: string;
  last_name: string | null;
  phone_number: string | null;
  status: string;
}

export interface IPurchaseTicket {
  code: string;
  email: string | null;
  first_name: string | null;
  id: string;
  last_name: string | null;
  phone_number: string | null;
  status: string;
}

export interface IPurchase {
  id: string;
  quantity: number;
  status: "completed" | "refundable";
  ticket_tier: {
    name: string;
    price: number;
    start_at: string;
    end_at: string;
  };
  event: {
    id: string;
    name: string;
    description: string;
    primary_image: string;
    start_at: string;
    end_at: string;
    country: string;
    city: string;
    address: string;
    province_state: string;
    category: "music" | "sport" | "convention" | "theatre" | "comedy";
    genre: string | null;
    slug: string;
    time_zone: ITimezone;
  };
  tickets: IPurchaseTicket[];
}

export interface IPurchaseRefundResponse {
  id: string;
  object: string;
  amount: number;
  balance_transaction: string;
  charge: string;
  created: number;
  currency: string;
  metadata: string | null;
  payment_intent: string;
  reason: string | null;
  receipt_number: string | null;
  source_transfer_reversal: string | null;
  status: string;
  transfer_reversal: string | null;
}
