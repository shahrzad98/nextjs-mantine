import { IMyEvent } from "@/types/organization";

export type EventStatus = "draft" | "published" | "canceled" | "done" | "rescheduled";

export interface IEventRequest {
  name?: string;
  description?: string;
  category?: string;
  genre?: string;
  primary_image?: File | string | null;
  country?: string;
  province_state?: string;
  city?: string;
  address?: string;
  lat?: string;
  lng?: string;
  zip_pc?: string;
  start_at?: string;
  end_at?: string;
  time_zone?: string;
  contact_email?: string;
  contact_phone?: string;
}
export interface IOrganization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  country: string | null;
  city: string | null;
  province_state: string | null;
  address: string | null;
  zip_pc: string | null;
  cover_photo: string | null;
  lat: number | null;
  lng: number | null;
}

export interface TicketTier {
  id: string;
  event_id: string;
  name: string;
  description: string;
  price: number;
  ticket_quantity: number;
  available_tickets: number;
  created_at: string;
  updated_at: string;
}

export interface EventSalesMonth {
  id: string;
  name: string;
  start_at: string;
  total_sales: number;
  average_ticket_price: number;
}

export interface EventSalesYear {
  id: string;
  name: string;
  start_at: string;
  total_sales: number;
  average_ticket_price: number;
}

export interface IEventSalesYearResponse {
  monthly_chart_view: {
    [key: string]: EventSalesYear[];
  };
  yearly: {
    total_gross_revenue: number;
    total_ticket_price_average: number;
    year_top_five: EventSalesYear[];
  };
}

export interface TicketInsight {
  sold_tickets_count: number;
  unsold_tickets_count: number;
  avg_ticket_price: number;
  total_gross_revenue: number;
}

export interface TicketSoldEvents {
  events: TicketSold[];
  total_tickets_sold: number;
}

export interface TicketSold {
  id: string;
  name: string;
  start_at: string;
  sold_percentage: number;
  sold_tickets: number;
}

export interface IPublishEventRequest {
  event: IMyEvent;
}
