import { cartCheckout, detachStripeCard, getCardList } from "@/api/handler/checkout";
import { useBreakpoint } from "@/hooks";
import checkoutStore from "@/stores/cartStore";
import { CheckoutResponse, ICartItem, ICheckoutStore } from "@/types";
import { cardList, errorNotification, separateByThousands, successNotification } from "@/utils";
import { ActionIcon, Button, Card, Flex, Menu, Radio, Skeleton, Text, rem } from "@mantine/core";
import { useStripe, useElements, PaymentElement, AddressElement } from "@stripe/react-stripe-js";
import { IconDots } from "@tabler/icons-react";
import { IconChevronLeft, IconCreditCard, IconPlus, IconTrash } from "@tabler/icons-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

const CardStyles = {
  cursor: "pointer",
  overflow: "visible",
  "& *": {
    cursor: "pointer",
  },
  "&:hover": {
    backgroundColor: "#2C2E33",
  },
};

export const CheckoutForm = ({
  amount,
  setPaymentInfo,
  setCurrentCountry,
  clientSecret,
}: {
  amount: number;
  setPaymentInfo: (res: CheckoutResponse) => void;
  setCurrentCountry: (country: string) => void;
  clientSecret: string | null;
}) => {
  const { isMobile } = useBreakpoint();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isValid, setIsValid] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "manual" | null>(null);

  const [activeCard, setActiveCard] = useState<string | undefined>();

  const checkoutData = checkoutStore((state: ICheckoutStore) => state.checkout);
  const emptyCheckout = checkoutStore((state: ICheckoutStore) => state.emptyCheckout);
  const currentPurchase = checkoutData?.purchase;
  const currentPayment = checkoutData?.payment_intent;

  const promoterName = localStorage.getItem(`event-${checkoutData?.event?.id}`);

  const { mutate: handleTaxCalculation, isLoading: taxCalculationLoading } = useMutation(
    ({ country, province }: { country: string; province: string }) =>
      cartCheckout({
        cart_id: currentPayment?.metadata.cart_id as string,
        purchase_id: currentPurchase?.id as string,
        province_state: province,
        country: country,
        promoter: promoterName as string,
      }),
    {
      onSuccess: (res) => {
        setPaymentInfo(res.data);
        setIsValid(true);
      },
      onError: (e: AxiosError<ICartItem>) => {
        errorNotification(e);
      },
    }
  );

  const { mutate: handleDetachCard } = useMutation(
    (payment_method_id: string) => detachStripeCard(payment_method_id),
    {
      onSuccess: () => {
        successNotification({ message: "Card removed successfully" });
        refetch();
      },
      onError: (e: AxiosError<ICartItem>) => {
        errorNotification(e);
      },
    }
  );

  const {
    data: cardListData,
    refetch,
    isLoading,
    error,
    isSuccess,
  } = useQuery([cardList, currentPayment?.metadata.cart_id], () => getCardList());

  if (isSuccess && cardListData.data.length > 0 && !paymentMethod) {
    setPaymentMethod("card");
  }

  if (isSuccess && cardListData.data.length === 0 && paymentMethod !== "manual") {
    setPaymentMethod("manual");
  }

  if (error) {
    setPaymentMethod("manual");
    errorNotification(error);
  }

  const handleSubmit = async (event: FormEvent) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    setPaymentLoading(true);

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    if (paymentMethod === "card") {
      const result = await stripe.confirmCardPayment(clientSecret as string, {
        payment_method: activeCard,
      });
      if (result.paymentIntent?.status === "succeeded") {
        router.push(`/my-tickets?addedEventId=${currentPurchase?.id}`);
        emptyCheckout();
        localStorage.removeItem(`event-${checkoutData?.event?.id}`);
      }

      if (result.paymentIntent?.status === "requires_payment_method") {
        errorNotification({
          message:
            "We are sorry, there was an error processing your payment. Please try again with a different payment method.",
          title: "Payment failed",
        });
        setPaymentLoading(false);
      }

      if (result.error) {
        // Show error to your customer (for example, payment details incomplete)
        errorNotification({
          message: result.error.message,
          title: "Payment failed",
        });
        console.log(result.error.message);
        setPaymentLoading(false);
      }
    } else {
      const eventKey = `event-${checkoutData?.event?.id}`;
      const promoterId = localStorage.getItem(eventKey);
      localStorage.removeItem(eventKey);
      const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: `${window.location.protocol}//${window.location.host}/my-tickets?addedEventId=${currentPurchase?.id}`,
        },
        redirect: "if_required",
      });

      if (result.paymentIntent?.status === "succeeded") {
        router.push(`/my-tickets?addedEventId=${currentPurchase?.id}`);
        emptyCheckout();
        localStorage.removeItem(`event-${checkoutData?.event?.id}`);
      }

      if (result.error) {
        if (promoterId) {
          localStorage.setItem(eventKey, promoterId);
        }
        // Show error to your customer (for example, payment details incomplete)
        errorNotification({
          message: result.error.message,
          title: "Payment failed",
        });
        console.log(result.error.message);
        setPaymentLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {isLoading && (
        <Flex direction={"column"} mt="xs" gap={"sm"}>
          {new Array(4).fill("").map((_, i) => (
            <Skeleton key={i} radius="md" height={60} />
          ))}
        </Flex>
      )}
      {isSuccess && paymentMethod === "card" && (
        <Flex direction={"column"} mt="xs" gap={"sm"}>
          <Radio.Group value={activeCard}>
            {cardListData.data.map((method) => {
              const { id, card, billing_details } = method;
              const { country, state } = billing_details.address;
              const { exp_month, exp_year, last4, brand } = card;

              return (
                <Card
                  key={id}
                  radius={"md"}
                  withBorder
                  sx={CardStyles}
                  onClick={() => {
                    setActiveCard(id);
                    handleTaxCalculation({
                      country: country as string,
                      province: state as string,
                    });
                    setCurrentCountry(country as string);
                  }}
                  mt={"sm"}
                >
                  <Radio
                    value={id}
                    styles={{
                      labelWrapper: {
                        width: "100%",
                      },
                      inner: {
                        alignSelf: "center",
                      },
                    }}
                    label={
                      <Flex justify={"space-between"} align={"center"} w={"100%"}>
                        <Flex align={"center"}>
                          {isMobile && <IconCreditCard />}
                          <Flex direction={"column"} ml={isMobile ? 16 : undefined}>
                            <Flex gap={"sm"} align={"center"}>
                              {!isMobile && <IconCreditCard />}
                              <Text tt={"uppercase"}>{brand}</Text> •••• {last4}
                            </Flex>

                            {isMobile && (
                              <Flex align={"center"}>
                                <Text c={"grey"} span mr={"xs"}>
                                  Expires
                                </Text>{" "}
                                {(exp_month as number) < 10 ? `0${exp_month}` : exp_month}/
                                {exp_year}
                              </Flex>
                            )}
                          </Flex>
                        </Flex>

                        <Flex
                          align={"center"}
                          gap={"sm"}
                          direction={isMobile ? "column" : undefined}
                        >
                          {!isMobile && (
                            <>
                              <Text c={"grey"} span mr={"sm"}>
                                Expires
                              </Text>{" "}
                              {(exp_month as number) < 10 ? `0${exp_month}` : exp_month}/{exp_year}
                            </>
                          )}
                          <Menu shadow="md" width={200} position="bottom-end">
                            <Menu.Target>
                              <ActionIcon onClick={(e) => e.stopPropagation()}>
                                <IconDots />
                              </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                              <Menu.Item
                                color="red"
                                icon={<IconTrash size={14} />}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  e.nativeEvent.stopImmediatePropagation();
                                  handleDetachCard(id as string);
                                }}
                              >
                                Remove card
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Flex>
                      </Flex>
                    }
                  />
                </Card>
              );
            })}
          </Radio.Group>
          <Card sx={CardStyles} radius={"md"} withBorder onClick={() => setPaymentMethod("manual")}>
            <Flex gap={"sm"}>
              <IconPlus />
              <Text>Add payment method</Text>
            </Flex>
          </Card>
        </Flex>
      )}
      {isSuccess && paymentMethod === "manual" && (
        <>
          {cardListData.data.length > 0 && (
            <Card
              sx={CardStyles}
              radius={"md"}
              mb={"md"}
              withBorder
              onClick={() => {
                setPaymentMethod("card");
                setActiveCard(undefined);
                setIsValid(false);
              }}
            >
              <Flex gap={"sm"}>
                <IconChevronLeft />
                <Text>Pay with card</Text>
              </Flex>
            </Card>
          )}
          <PaymentElement />
          <AddressElement
            options={{ mode: "billing" }}
            onChange={(event) => {
              setIsValid(false);
              if (event.complete) {
                handleTaxCalculation({
                  country: event.value.address.country,
                  province: event.value.address.state,
                });
                setCurrentCountry(event.value.address.country);
                // Extract potentially complete address
              }
            }}
          />
        </>
      )}

      <Button
        mt={32}
        mb={rem(60)}
        type="submit"
        disabled={!isValid}
        fullWidth
        size="lg"
        loading={taxCalculationLoading || paymentLoading}
        sx={{
          "&[data-disabled]": { backgroundColor: "#A3A9B3", color: "#FFFFFF" },
        }}
      >
        Pay $ {separateByThousands(amount.toFixed(2))}
      </Button>
    </form>
  );
};
