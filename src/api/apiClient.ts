import { axiosInstance } from "./axiosInstance";

const makeApiRequest = async <T>(
  endpoint: string,
  method = "GET",
  data: T | null = null
): Promise<T> => {
  const response = await axiosInstance.request<T>({
    url: endpoint,
    method,
    data,
  });

  return response.data;
};

export const api = {
  get: async <T>(endpoint: string): Promise<T> => makeApiRequest<T>(endpoint, "GET"),
  post: async <T>(endpoint: string, data: any): Promise<T> =>
    makeApiRequest<T>(endpoint, "POST", data),
  put: async <T>(endpoint: string, data: any): Promise<T> =>
    makeApiRequest<T>(endpoint, "PUT", data),
  patch: async <T>(endpoint: string, data: any): Promise<T> =>
    makeApiRequest<T>(endpoint, "PATCH", data),
  delete: async <T>(endpoint: string): Promise<T> => makeApiRequest<T>(endpoint, "DELETE"),
};
