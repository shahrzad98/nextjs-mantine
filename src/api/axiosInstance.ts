import getLocalStorageValue from "@/helpers/getLocalStorageValue";
import userStore from "@/stores/userStore";
import { ICurrentUserStorage, IGuestToken, IUserSignInResponse } from "@/types";
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`,
  responseType: "json",
  headers: {
    "Access-Control-Allow-Origin": "",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    Accept: "*/*",
  },
  withCredentials: true,
});

export async function userRefreshToken() {
  const storageCurrentUser =
    getLocalStorageValue<ICurrentUserStorage>("nvt-user-storage")?.state?.currentUser;

  if (!storageCurrentUser) return;
  const response = await axios.post<IUserSignInResponse>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/${
      storageCurrentUser?.data?.role ? "organization" : "attendee"
    }/auth/refresh-token`,
    { access_token: storageCurrentUser?.token, refresh_token: storageCurrentUser?.refreshToken },
    { headers: { "Content-Type": "application/json" } }
  );

  const userState = userStore.getState();

  if (!response.data || !userState || !userState.currentUser) return;
  userState.setUser({
    ...userState.currentUser,
    refreshToken: response.data.data.current_access_token.refresh_token,
    token: response.data.data.current_access_token.token,
  });
}

axiosInstance.interceptors.request.use((config: AxiosRequestConfig): InternalAxiosRequestConfig => {
  const storageToken =
    getLocalStorageValue<ICurrentUserStorage>("nvt-user-storage")?.state?.currentUser?.token ||
    getLocalStorageValue<IGuestToken>("guest-token")?.current_access_token?.token;
  if (storageToken) {
    config.headers = {
      ...(config.headers as AxiosHeaders),
      Authorization: `Bearer ${storageToken}`,
    };
  }

  return config as InternalAxiosRequestConfig;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const statusCode = error?.response?.status || null;
    if (statusCode === 401) {
      try {
        await userRefreshToken();
      } catch (error) {
        localStorage.removeItem("nvt-user-storage");
        if (document.location.href.includes("/organization")) {
          window.location.assign("/organization/auth/login");
        } else if (document.location.href.includes("/operator")) {
          window.location.assign("/operator/auth/login");
        } else {
          window.location.assign("/auth/login");
        }
      }

      if (error?.response && error.config && ![401, 500].includes(error.response.status)) {
        try {
          await axiosInstance(error.config);
        } catch (retryError) {
          // todo: handle retry request error
        }
      }
    }

    return Promise.reject(error);
  }
);

export { axiosInstance };
