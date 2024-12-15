import { ssoCallback } from "@/api/handler/auth";
import checkoutStore from "@/stores/cartStore";
import userStore from "@/stores/userStore";
import { IUserStore, ICheckoutStore, UserType } from "@/types";
import { errorNotification } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SSOCallback() {
  const router = useRouter();
  const { state, code, scope, authuser, hd, prompt, variant, return_to } = router.query;

  const setUser = userStore((state: IUserStore) => state.setUser);

  const checkoutData = checkoutStore((state: ICheckoutStore) => state.checkout);
  const eventCart = checkoutData?.cart;
  const cartToken = eventCart?.token;

  const expireAfterThirtyDays = new Date().getTime() + 1000 * 60 * 60 * 24 * 30;

  const { mutate: handleCallback } = useMutation(
    () =>
      ssoCallback(
        {
          state: state as string,
          code: code as string,
          scope: scope as string,
          authuser: authuser as string,
          hd: hd as string,
          prompt: prompt as string,
          return_to: return_to ? (return_to as "checkout" | "mytickets" | "false") : "false",
          cart_token: cartToken || "",
        },
        variant as "google" | "facebook"
      ),
    {
      onSuccess: (res) => {
        setUser({
          data: res?.data,
          role: UserType.Attendee,
          token: res?.data?.current_access_token?.token as string,
          expiry: expireAfterThirtyDays,
        });
        if (return_to === "checkout") {
          if (!res.data?.mobile_confirmed_at) {
            router.push("/checkout/auth/step-2");
          } else {
            router.push("/checkout/pay");
          }
        } else {
          if (!res.data?.mobile_confirmed_at) {
            router.push("/auth/signup/step-2");
          } else if (return_to === "mytickets") {
            router.push("/my-tickets");
          } else {
            router.push("/");
          }
        }
      },
      onError: (e: AxiosError) => {
        errorNotification(e);
        router.push("/auth/login");
      },
    }
  );

  useEffect(() => {
    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady]);

  return <></>;
}
