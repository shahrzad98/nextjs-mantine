import { IOrganization, ITicketTierResponse } from "@/types";

export interface IMyEvent {
  id: string;
  name: string;
  description: string;
  status: "draft" | "published" | "canceled" | "done" | "rescheduled";
  available_tickets: number;
  primary_image: string;
  start_at: string;
  end_at: string;
  canceled_at: string | null;
  reschedulet_at: string | null;
  country: string;
  is_private: boolean;
  province_state: string;
  city: string;
  lat: number;
  lng: number;
  address: string;
  message_to_attendee: string | null;
  zip_pc: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  ticket_quantity: number;
  category: "music" | "sport" | "convention" | "theatre" | "comedy";
  genre: string | null;
  time_zone: ITimezone;
  // Below is specific to the organization - it might need refactoring!
  slug: string;
  organization_id: string;
  created_at: string;
  updated_at: string;
  organization: IOrganization;
  ticket_tiers: ITicketTierResponse[];
}

export interface IEventAttendee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  gender: string;
  date_of_birth: string;
  country: string | null;
  city: string | null;
  province_state: string | null;
  address: string | null;
  zip_pc: string | null;
  email_confirmed_at: string;
  mobile_confirmed_at: string;
  lat: string | null;
  lng: string | null;
  purchases: {
    id: string;
    quantity: number;
    subtotal: number;
    status: string;
    ticket_tier: {
      id: string;
      event_id: string;
      name: string;
      description: string;
      price: number;
      ticket_quantity: number;
      available_tickets: number;
      created_at: string;
      updated_at: string;
    };
    tickets: {
      id: string;
      purchase_id: string;
      code: string;
      status: string;
      created_at: string;
      updated_at: string;
    }[];
  }[];
}

export interface IEventPromoter {
  id: string;
  event_id: string;
  promoter_id: string;
  status: string;
  commission_amount: number | null;
  commission_type: "percentage" | "amount";
  event_promoter_views_count: number;
  invitation_sent_at?: string;
  purchases_count: number;
  promoter: {
    id: string;
    email: string;
    password_digest?: string;
    username: string | null;
    first_name: string | null;
    last_name: string | null;
    active: boolean;
    invitation_token?: string | null;
    invitation_sent_at: string | null;
    created_at?: string;
    updated_at?: string | null;
  };
}

export interface IOrganizationPromoterItem {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  active: boolean;
  invitation_sent_at: string;
}

export interface IOrganizationPromoterEvent {
  id: string;
  event_id: string;
  event_name: string;
  promoter_id: string;
  status: string;
  commission_amount: number;
  commission_type: "percentage" | "amount";
  event_promoter_views_count: number;
  invitation_sent_at: string | null;
  purchases_count: number;
}

export interface IEventPromoterDetails {
  purchases: {
    [date: string]: number;
  };
  purchases_count: number;
  views: {
    [date: string]: number;
  };
  views_count: number;
  total_revenue: number;
  commission_type: "percentage" | "amount";
  commission_amount: number;
  event_name: string;
  promoter_name: string;
}

export interface IOrganizationTeamMemberRequest {
  first_name: string;
  last_name: string;
  email: string;
}

interface IOrganizationTeamMemberBase {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  status: "invitation_sent" | "invitation_expired" | "active" | "inactive";
  current_access_token: string | null;
}

export interface IOrganizationAdmin extends IOrganizationTeamMemberBase {
  organization: IOrganizationInfo;
  role: "admin";
}

export interface IOrganizationOwner extends IOrganizationTeamMemberBase {
  organization: {
    id: string;
    name: string;
  };
  role: "owner";
}

export interface IOrganizationOperator extends IOrganizationTeamMemberBase {
  organization: {
    id: string;
    name: string;
  };
  role: "operator";
}

interface IOrganizationInfo extends IOrganization {
  stripe_account_id: string | null;
  active: boolean;
  balance: string;
  created_at: string;
  updated_at: string;
}

export interface IValidatedTicket {
  attendee: {
    first_name: string;
    email: string;
    id: string;
    last_name: string;
  };
  code: string;
  id: string;
  status: string;
  email: string | null;
  last_name: string | null;
  phone_number: string | null;
  first_name: string | null;
  ticket_tier: {
    id: string;
    name: string;
  };
}

export interface IOrganizationContactForm {
  name: string;
  email: string;
  phone?: string | null;
  organization: string;
}

export interface IOrganizationStripeResponse {
  url: string;
}

export interface IOrganizationListItem {
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
  commission_percentage: number;
  lat: string | null;
  lng: string | null;
  active: boolean;
  balance: string | null;
  owner: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    status: string | null;
    reset_password_token: string | null;
    reset_password_sent_at: string | null;
    email_confirmation_token: string | null;
    email_confirmation_sent_at: string | null;
    email_confirmed_at: string | null;
    invitation_token: string | null;
    invitation_sent_at: string | null;
    organization_id: string | null;
    role: number;
    created_at: string | null;
    updated_at: string | null;
  };
  invited_by: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    invitation_token: string | null;
    invitation_sent_at: string | null;
    created_at: string | null;
    updated_at: string | null;
  };
}

export interface ISearchOrganization {
  cover_photo: string | null;
  id: string | null;
  name: string | null;
  slug: string | null;
}

export interface ITimezone {
  name: string;
  utc_offset: number;
  abbr: string;
}
