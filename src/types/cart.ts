import { IMyEvent, ITicketCount } from "@/types";

export interface ICartItem {
  id?: string;
  event_id?: string;
  ticket_tier_id?: string;
  quantity?: ITicketCount;
  token?: string | null;
  expires_at: string;
}

export interface IStripeCard {
  id: string;
  object: string;
  billing_details: {
    address: {
      city: string | null;
      country: string | null;
      line1: string | null;
      line2: string | null;
      postal_code: string | null;
      state: string | null;
    };
    email: string | null;
    name: string | null;
    phone: string | null;
  };
  card: {
    brand: string;
    checks: {
      address_line1_check: string | null;
      address_postal_code_check: string | null;
      cvc_check: string | null;
    };
    country: string | null;
    exp_month: number | null;
    exp_year: number | null;
    fingerprint: number | null;
    funding: number | null;
    generated_from: number | null;
    last4: number | null;
    networks: {
      available: string[] | null;
      preferred: string | null;
    };
    three_d_secure_usage: {
      supported: boolean;
    };
    wallet: string | null;
  };
  created: number;
  customer: string;
  livemode: boolean;
  metadata: object;
  type: string;
}

export interface PurchaseItem {
  id: string;
  event_id: string;
  ticket_tier_id: string;
  attendee_id: string;
  quantity: number;
  subtotal: number;
  tax_percentage: number | null;
  tax_amount: number | null;
  convertion_fee: number;
  fees: number;
  total_amount: number;
  status: string;
  expires_at: string;
  payment_intent_id: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentIntentItem {
  id: string;
  object: string;
  amount: number;
  amount_capturable: number;
  amount_details: {
    tip: null;
  };
  amount_received: number;
  application: string | null;
  application_fee_amount: string | null;
  automatic_payment_methods: {
    allow_redirects: string;
    enabled: boolean;
  };
  canceled_at: string | null;
  cancellation_reason: string | null;
  capture_method: string;
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  customer: string;
  description: string | null;
  invoice: string | null;
  last_payment_error: string | null;
  latest_charge: string | null;
  livemode: boolean;
  metadata: {
    cart_id: string;
  };
  next_action: string | null;
  on_behalf_of: string | null;
  payment_method: string | null;
  payment_method_options: {
    card: {
      installments: string | null;
      mandate_options: string | null;
      network: string | null;
      request_three_d_secure: string;
    };
  };
  payment_method_types: string[];
  processing: string | null;
  receipt_email: string | null;
  review: string | null;
  setup_future_usage: string | null;
  shipping: string | null;
  source: string | null;
  statement_descriptor: string | null;
  statement_descriptor_suffix: string | null;
  status: string;
  transfer_data: string | null;
  transfer_group: string;
}

export interface ICheckoutStore {
  checkout: {
    commission_percentage?: number | null;
    cart?: ICartItem | null;
    event?: IMyEvent | null;
    purchase?: PurchaseItem | null;
    payment_intent?: PaymentIntentItem | null;
  } | null;
  setCheckout: (checkout: {
    commission_percentage?: number;
    cart?: ICartItem;
    event?: IMyEvent;
    purchase?: PurchaseItem;
    payment_intent?: PaymentIntentItem;
  }) => void;
  emptyCheckout: () => void;
}

export interface CheckoutResponse {
  commission_percentage: number;
  purchase: PurchaseItem;
  payment_intent: PaymentIntentItem;
  exchange_rate: number;
}

export interface GeolocationResponse {
  country_code: string;
  country_name: string;
  city: string | null;
  postal: number | null;
  latitude: number;
  longitude: number;
  IPv4: string;
  state: string | null;
}
