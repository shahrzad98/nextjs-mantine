import { api } from "@/api/apiClient";
import { CustomAxiosResponse } from "@/types";
import { CheckoutResponse, ICartItem, IStripeCard } from "@/types/cart";
import { AxiosResponse } from "axios";

export const getEventCart = (token: string) =>
  api.get<CustomAxiosResponse<ICartItem>>(`/attendee/cart?token=${token}`);

export const getCardList = () =>
  api.get<CustomAxiosResponse<IStripeCard[]>>("/attendee/stripe/cards");

export const detachStripeCard = (payment_method_id: string) =>
  api.delete<AxiosResponse>(
    `/attendee/stripe/detach-payment-method?payment_method_id=${payment_method_id}`
  );

export const cartAddItem = (event_id: string, ticket_tier_id: string, token?: string) =>
  api.post<CustomAxiosResponse<ICartItem>>(`/attendee/cart/add-item`, {
    event_id,
    ticket_tier_id,
    token,
  });

export const cartRemoveItem = (event_id: string, ticket_tier_id: string, token?: string) =>
  api.post<CustomAxiosResponse<ICartItem>>(`/attendee/cart/remove-item`, {
    event_id,
    ticket_tier_id,
    token,
  });
export const cartCheckout = ({
  cart_id,
  purchase_id,
  province_state,
  country,
  promoter,
}: {
  cart_id: string;
  purchase_id?: string;
  province_state?: string;
  country?: string;
  promoter?: string;
}) =>
  api.post<CustomAxiosResponse<CheckoutResponse>>(`/attendee/stripe/checkout`, {
    cart_id,
    purchase_id,
    province_state,
    country,
    promoter,
  });

export const deleteCart = (token: string) =>
  api.delete<AxiosResponse>(`/attendee/cart/delete-cart?token=${token}`);
