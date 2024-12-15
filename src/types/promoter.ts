export interface IPromoterInvitation {
  id: string;
  event_id: string;
  promoter_id: string;
  status: string;
  commission_amount: number;
  commission_type: string;
  event_promoter_views_count: number;
  invitation_sent_at: null | string;
  revenue: number;
  event: {
    id: string;
    name: string;
    description: string;
    status: string;
    primary_image: string;
    start_at: string;
    end_at: string;
    country: string;
    city: string;
    address: string;
    zip_pc: string;
    category: string;
    genre: string | null;
    slug: string;
    contact_email: string | null;
    canceled_at: string | null;
    rescheduled_at: string | null;
    ticket_quantity: number;
    lat: number;
    lng: number;
    contact_phone: string | null;
    province_state: string | null;
    available_tickets: number | null;
    organization: {
      id: string;
      name: string;
      slug: string;
      cover_photo: string | null;
    };
  };
}

export interface IPromoterPurchases {
  events: {
    id: string;
    name: string;
    slug: string;
    purchases: {
      [date: string]: number;
    };
    revenue: number;
  }[];
  total_gross_revenue: number;
}

export interface IPromoterEvent {
  id: string;
  event_id: string;
  promoter_id: string;
  status: string;
  commission_amount: number;
  commission_type: string;
  event_promoter_views_count: number;
  invitation_sent_at: string | null;
  purchases_count: number;
  revenue: number;
  event: {
    id: string;
    name: string;
    description: string;
    status: string;
    primary_image: string;
    start_at: string;
    end_at: string;
    country: string;
    city: string;
    address: string;
    zip_pc: string;
    category: string;
    genre: string | null;
    slug: string;
    contact_email: string | null;
    canceled_at: string | null;
    rescheduled_at: string | null;
    ticket_quantity: number;
    lat: number;
    lng: number;
    contact_phone: string | null;
    province_state: string;
    available_tickets: string | null;
    organization: {
      id: string;
      name: string;
      slug: string;
      cover_photo: string | null;
    };
  };
}
