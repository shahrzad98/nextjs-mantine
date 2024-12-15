import { getPurchases } from "@/api/handler/purchase";
import withAuth from "@/common/withAuth";
import { createWebsocketConnection } from "@/helpers/createSocketConnection";
import { useBreakpoint } from "@/hooks";
import checkoutStore from "@/stores/cartStore";
import userStore from "@/stores/userStore";
import { ICheckoutStore, IUserStore, isHttpError } from "@/types";
import { successNotification } from "@/utils";
import { purchasesKey } from "@/utils/queryKeys";
import { Box, Container, Group, Title, rem } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import { NovelTHead, NVTLayout, TicketList } from "@/components";

function MyTickets() {
  const { isMobile } = useBreakpoint();
  const router = useRouter();

  const [addedEventId, setAddedEventId] = useState<string | null>(
    router.query.addedEventId as string
  );

  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const emptyCheckout = checkoutStore((state: ICheckoutStore) => state.emptyCheckout);

  const purchasedId = useRef<string | null>(null);
  const [trigger, setTrigger] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const {
    data: purchasesData,
    error,
    refetch,
    isFetching,
    isSuccess,
    isError,
    isLoading,
  } = useQuery([purchasesKey], () => getPurchases().then((res) => res.data), {
    initialData: queryClient.getQueryData([purchasesKey]),
  });

  useEffect(() => {
    if (addedEventId && isSuccess && purchasesData.find((item) => item.id === addedEventId)) {
      purchasedId.current = addedEventId as string;
      router.replace("/my-tickets", undefined, { shallow: true });
      successNotification({
        id: addedEventId as string,
        title: "Successful",
        message: "Your payment was successful!",
      });

      setTimeout(() => {
        setAddedEventId(null);
      }, 5000);

      emptyCheckout();
      setTrigger((prev) => !prev);
    }
  }, [addedEventId && isSuccess]);

  useEffect(() => {
    if (isHttpError(error)) {
      notifications.show({
        title: error?.response?.data.errors.toString() ?? "Something went wrong!",
        message: error?.message,
        color: "red",
      });
    }
  }, [error]);

  useEffect(() => {
    createWebsocketConnection(
      {
        token: currentUser?.token as string,
        channel: "PurchaseTicketChannel",
      },
      (message: { [key: string]: string | number }) => {
        if (message.purchase && message.purchase !== purchasedId.current) {
          emptyCheckout();
          purchasedId.current = message.purchase as string;
          successNotification({
            id: message.purchase as string,
            title: "Successful",
            message: "Your payment was successful!",
          });

          setTimeout(() => {
            setAddedEventId(null);
          }, 5000);

          refetch();
          setTrigger((prev) => !prev);
        }
      }
    );
  }, []);

  return (
    <>
      <NVTLayout
        navbarProps={{
          handleBackButton: () => router.push("/"),
        }}
        backgroundGradientVariant={11}
      >
        <NovelTHead title="My Tickets" />
        {!isMobile && (
          <Container size={rem(1240)}>
            <Group pt={rem(24)}>
              <Title order={3} fz={rem(24)} fw={500} mb={rem(20)}>
                My Tickets
              </Title>
            </Group>
          </Container>
        )}
        <Container size={!isMobile ? rem(1288) : "xs"} px={isMobile ? rem(28) : undefined}>
          {isMobile && (
            <Title order={3} fz={rem(18)} fw={500} mt={rem(8)} color="#FFFFFFCC">
              My Tickets
            </Title>
          )}

          {purchasesData && (
            <Box sx={{ overflow: "auto" }} mr={isMobile ? -30 : undefined} mb={rem(55)}>
              <TicketList
                purchases={purchasesData || []}
                addedEventId={((trigger && purchasedId.current) ?? "") as string}
                refetchTickets={refetch}
                isFetchingPurchases={isFetching}
                isLoadingPurchases={isLoading}
                isLoadingPurchasesError={isError}
                isLoadingPurchasesSuccess={isSuccess}
              />
            </Box>
          )}
        </Container>
      </NVTLayout>
    </>
  );
}

export default withAuth(MyTickets);
