import { cartCheckout } from "@/api/handler/checkout";
import NoSsr from "@/common/NoSsr";
import withAuth from "@/common/withAuth";
import { CheckoutPayModule } from "@/modules";
import checkoutStore from "@/stores/cartStore";
import userStore from "@/stores/userStore";
import { ICartItem, ICheckoutStore, IUserStore } from "@/types";
import { errorNotification, warningNotification } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function CheckoutPay() {
  const router = useRouter();

  const setCheckoutData = checkoutStore((state: ICheckoutStore) => state.setCheckout);
  const emptyCheckout = checkoutStore((state: ICheckoutStore) => state.emptyCheckout);
  const checkoutData = checkoutStore((state: ICheckoutStore) => state.checkout);

  const currentCart = checkoutData?.cart;
  const currentPurcahse = checkoutData?.purchase;
  const currentEvent = checkoutData?.event;

  const [purchaseSuccess, setPurchaseSuccess] = useState<boolean>(false);

  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const token = currentUser?.token;

  const promoterName = localStorage.getItem(`event-${currentEvent?.id}`);

  const { mutate: handlePurchase } = useMutation(
    () => cartCheckout({ cart_id: currentCart?.id as string, promoter: promoterName as string }),
    {
      onSuccess: (res) => {
        setCheckoutData({
          commission_percentage: res.data.commission_percentage,
          cart: {
            ...currentCart,
            id: undefined,
            token: undefined,
            expires_at: res.data.purchase.expires_at as string,
          },
          purchase: res.data.purchase,
          payment_intent: res.data.payment_intent,
        });
        if (!token) {
          router.push("/checkout/auth/signup");
        } else {
          setPurchaseSuccess(true);
        }
      },
      onError: (e: AxiosError<ICartItem>) => {
        if (e.response?.status === 403) {
          errorNotification(e);
          router.push("/my-account");
        } else if (currentEvent?.slug) {
          errorNotification(e);
          router.push(`/event/${currentEvent?.slug}`);
        } else {
          warningNotification({
            title: "Warning",
            message: "Navigation to the previous page is not allowed",
          });
          router.push(`/`);
        }
      },
    }
  );

  useEffect(() => {
    if (currentPurcahse?.expires_at) {
      const currentTime = new Date().getTime();
      const expireTime = new Date(currentPurcahse?.expires_at as string).getTime();
      if (currentTime > expireTime) {
        const eventSlug = currentEvent?.slug;
        emptyCheckout();
        router.push(`/event/${eventSlug}`);
      } else {
        setPurchaseSuccess(true);
      }
    } else {
      handlePurchase();
    }
  }, []);

  return <NoSsr>{purchaseSuccess && <CheckoutPayModule />}</NoSsr>;
}

export default withAuth(CheckoutPay);
