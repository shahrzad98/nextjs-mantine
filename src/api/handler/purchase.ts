import { IPurchaseRefundResponse, IPurchaseTicket, IPurchasesResponse } from "@/types/purchase";
import { AxiosResponse } from "axios";

import { api } from "../apiClient";

export const getPurchases = () => api.get<IPurchasesResponse>(`/attendee/purchases`);

export const refundPurchase = (id: string) =>
  api.post<AxiosResponse<IPurchaseRefundResponse>>(`/attendee/stripe/refund`, { purchase_id: id });

export const sendTicket = ({
  purchaseId,
  id,
  values,
}: {
  purchaseId: string;
  id: string;
  values: Partial<IPurchaseTicket>;
}) =>
  api.post<AxiosResponse<IPurchaseTicket>>(
    `/attendee/purchases/${purchaseId}/tickets/${id}/gift-ticket`,
    values
  );
