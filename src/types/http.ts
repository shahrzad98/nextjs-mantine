import { AxiosError, AxiosResponse } from "axios";

export interface CustomErrorResponse {
  message: string;
  errors: string[];
}

export function isHttpError(response: unknown): response is AxiosError<CustomErrorResponse> {
  return (response as AxiosError)?.isAxiosError;
}

export interface ApiInfiniteResponse<T> {
  data: T;
  meta: {
    total_count: number;
    total_events?: number;
    total_organizations?: number;
  };
}

export interface CustomAxiosResponse<T> extends AxiosResponse {
  data: T;
  meta: {
    total_count: number;
    total_events?: number;
    total_organizations?: number;
  };
}

export interface IPagination {
  page?: number;
  perPage?: number;
}
