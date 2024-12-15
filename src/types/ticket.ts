export interface ITicketTierResponse {
  id: string;
  name: string;
  price: number;
  description: string;
  ticket_quantity: number;
  available_tickets: number;
  seats: number;
  start_at: string;
  end_at: string;
  event_id: string;
  created_at: string;
  updated_at: string;
  event: {
    start_at: string;
    end_at: string;
    id: string;
  };
}

export interface ITicketTierRequest {
  name?: string;
  price?: number;
  description?: string;
  ticket_quantity?: number;
  seats?: number;
  start_at?: string;
  end_at?: string;
}

export type ITicketCount = 0 | 1 | 2 | 3 | 4 | 5;
