import { IAttendee, IAttendeeStripeResponse } from "@/types/user";
import { AxiosResponse } from "axios";

import { api } from "../apiClient";

export const getAttendeeAccount = (): Promise<AxiosResponse<IAttendee>> =>
  api.get("/attendee/account/me");

export const updateAttendeeAccount = (
  values: Partial<IAttendee>
): Promise<AxiosResponse<IAttendee>> => api.put("/attendee/account/me", values);

export const requestVerificationEmail = (email: string) =>
  api.post("/attendee/auth/request-verification-email", { email });

export const getAttendeeStripeDashboard = (): Promise<AxiosResponse<IAttendeeStripeResponse>> =>
  api.get("/attendee/stripe/dashboard");
