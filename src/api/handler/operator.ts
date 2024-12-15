import { IValidatedTicket } from "@/types/organization";
import { AxiosResponse } from "axios";

import { api } from "../apiClient";

export const invalidateTicket = (code: string, eventId: string) =>
  api.put<AxiosResponse<IValidatedTicket>>("/organization/invalidate-ticket", {
    code,
    event_id: eventId,
  });
