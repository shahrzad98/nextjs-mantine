import getLocalStorageValue from "@/helpers/getLocalStorageValue";
import { ICurrentUserStorage, IGuestToken } from "@/types";
import axios, { AxiosResponse } from "axios";

async function checkGuestToken() {
  const guestToken = getLocalStorageValue<IGuestToken>("guest-token")?.current_access_token;
  const currentUser =
    getLocalStorageValue<ICurrentUserStorage>("nvt-user-storage")?.state?.currentUser?.token;

  if (
    !currentUser ||
    !guestToken ||
    new Date().getTime() > new Date(guestToken.expires_at).getTime()
  ) {
    const response = await axios.get<AxiosResponse<IGuestToken>>(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/attendee/auth/guest-login`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    localStorage.setItem("guest-token", JSON.stringify(response.data.data));
  }
}

export default checkGuestToken;
