import { IOrganization, IMyEvent, ITimezone } from "@/types";

export interface IHomeEventsRequest {
  per_page: number;
  page: number;
  event_type: string;
  lat?: number;
  lng?: number;
}

export interface IHomeEventsSearchRequest {
  query?: string;
  start_date?: string | null;
  end_date?: string | null;
  lat?: number;
  lng?: number;
  page: number;
  per_page: number;
}

export interface IHomeEventsSearch {
  events: IMyEvent[];
  organizations: IOrganization[];
  meta: {
    total_events: number;
    total_organizations: number;
  };
}

export interface IHomeEvent {
  id: string;
  name: string;
  description: string | null;
  status: string;
  primary_image: string | null;
  start_at: string | null;
  end_at: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  province_state: string | null;
  zip_pc?: string | null;
  category: string | null;
  genre?: string | null;
  url?: string | null;
  canceled_at?: string | null;
  reschedulet_at?: string | null;
  organization?: IOrganization;
  organization_id?: string;
  created_at?: string;
  updated_at?: string;
  available_tickets: number | null;
  ticket_quantity?: number;
  slug?: string;
  time_zone: ITimezone;
}
