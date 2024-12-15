import { getAttendeeAccount } from "@/api/handler/attendee";
import { attendeeAccountSetup, attendeeVerifyMobile } from "@/api/handler/auth";
import { useBreakpoint } from "@/hooks";
import userStore from "@/stores/userStore";
import { ICurrentUser, IUserStore } from "@/types";
import { CustomErrorResponse } from "@/types/http";
import { errorNotification, successNotification } from "@/utils";
import { attendeeAccountKey } from "@/utils/queryKeys";
import { Anchor, Box, Button, Flex, Group, PinInput, Text, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useInterval } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { KeyboardEvent, useEffect, useState } from "react";

import { AuthenticationLayout, BackgroundGradients, NovelTHead } from "@/components";

export const NumberVerificationForm = ({ isCheckout = false }: { isCheckout?: boolean }) => {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const interval = useInterval(() => setSeconds((s) => s + 1), 1000);

  const { isMobile } = useBreakpoint();

  const countdown = 120;

  const queryClient = useQueryClient();

  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const setUser = userStore((state: IUserStore) => state.setUser);

  const {
    data: attendeeAccount,
    isSuccess: isAttendeeAccountSuccess,
    isLoading: isAttendeeAccountLoading,
    error: attendeeAccountError,
  } = useQuery([attendeeAccountKey], () => getAttendeeAccount().then((res) => res.data), {
    initialData: queryClient.getQueryData([attendeeAccountKey]),
  });

  useEffect(() => {
    if (attendeeAccountError) {
      errorNotification(attendeeAccountError as AxiosError);
    }
  }, [attendeeAccountError]);

  useEffect(() => {
    setSeconds(0);
    interval.start();

    return interval.stop;
  }, []);

  if (interval.active && seconds === countdown) {
    interval.stop();
  }

  const { mutate: handleVerificationCode } = useMutation(
    () =>
      attendeeAccountSetup({
        mobile: attendeeAccount?.mobile as string,
        first_name: attendeeAccount?.first_name as string,
        last_name: attendeeAccount?.last_name as string,
      }),
    {
      onSuccess: () => {
        if (countdown - seconds === 0) {
          setSeconds(0);
          interval.start();
        }
        successNotification({
          title: "Success!",
          message: "A 6 digit verification code has been sent to your mobile device.",
        });
      },
      onError: (e: AxiosError<CustomErrorResponse>) => {
        errorNotification(e);
      },
    }
  );

  const verificationForm = useForm({
    initialValues: {
      token: "",
    },

    validate: {
      token: (value) => (value.length === 6 ? null : "Verification Token is required!"),
    },
  });

  const { mutate: handleVerification, isSuccess } = useMutation(
    (token: string) => attendeeVerifyMobile(token),
    {
      onSuccess: () => {
        successNotification({
          title: "Success!",
          message: "Your phone number has been verified.",
        });

        setUser({
          ...(currentUser as ICurrentUser),
          data: {
            ...currentUser?.data,
            mobile_confirmed_at: new Date().toISOString(),
          },
        });
        if (isCheckout) {
          router.push("/checkout/auth/email-verification");
        } else if (
          attendeeAccount?.province_state ||
          attendeeAccount?.date_of_birth ||
          attendeeAccount?.gender ||
          attendeeAccount?.zip_pc
        ) {
          router.push("/");
        } else {
          router.push("/auth/onboarding/account-setup");
        }
      },
      onError: (e: AxiosError<CustomErrorResponse>) => {
        if (e.response?.status === 406) {
          verificationForm.setErrors({ token: "error" });
          errorNotification({
            title: "Invalid Verification Code",
            message:
              "Please re-enter the correct 6 digit verification code that has been sent to your mobile device.",
          });
        } else if (e?.response?.status === 500) {
          errorNotification(e);
        } else {
          errorNotification({
            title: "Error!",
            message: e?.response?.data?.message || e?.message || "Something went wrong!",
          });
        }
      },
    }
  );

  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      verificationForm.validate();
      if (verificationForm.isValid()) {
        handleVerification(verificationForm.values.token);
      }
    }
  };

  return (
    <form
      onSubmit={verificationForm.onSubmit((values) => handleVerification(values.token))}
      onKeyDown={(e) => checkKeyDown(e)}
    >
      <Flex
        direction={"column"}
        mt={isMobile ? rem(100) : rem(120)}
        pos={"relative"}
        sx={{ zIndex: 1 }}
      >
        <Text
          fw={"400"}
          size={isMobile ? 24 : 32}
          lh={rem(39)}
          mb={isMobile ? rem(50) : rem(64)}
          ta={"center"}
          color="#3077F3"
        >
          {120 - seconds}
        </Text>
        <Group position="center">
          <PinInput
            type="number"
            oneTimeCode
            size="lg"
            length={6}
            styles={{
              input: {
                fontSize: rem(13),
                color: "#FFFFFFB2",
                borderColor: isSuccess ? "#43C559" : undefined,
                "&::placeholder": {
                  fontSize: "2rem",
                },
                "&[data-invalid]": {
                  color: "#FFFFFFB2",
                },
              },
            }}
            {...verificationForm.getInputProps("token")}
          />
        </Group>

        <Group position="center" mt={rem(20)}>
          {!isAttendeeAccountLoading && isAttendeeAccountSuccess && (
            <Anchor
              color={seconds === countdown ? "#7791F9" : "#FFFFFF4D"}
              size={15}
              fw={"400"}
              underline={false}
              sx={{
                cursor: countdown - seconds === 0 ? "pointer" : undefined,
              }}
              onClick={() => seconds === countdown && handleVerificationCode()}
            >
              Resend code
            </Anchor>
          )}
          <Anchor
            color="#7791F9"
            size={15}
            fw={"400"}
            td={"underline"}
            onClick={() =>
              router.push(isCheckout ? "/checkout/auth/step-2" : "/auth/signup/step-2")
            }
          >
            Update Phone Number
          </Anchor>
        </Group>

        <Box ta={"center"}>
          <Button
            mt={58}
            size="md"
            fw={400}
            sx={{
              fontSize: 15,
              "&[data-disabled]": { backgroundColor: "#FFFFFF4D", color: "#9DA1A4" },
            }}
            type="submit"
            variant="gradient"
            fullWidth={isMobile}
            gradient={{ from: "#3077F3", to: "#15AABF" }}
            disabled={!verificationForm.isDirty()}
          >
            Continue
          </Button>
        </Box>
      </Flex>
    </form>
  );
};

export const NumberVerificationModule = () => {
  return (
    <>
      <AuthenticationLayout image={"/img/signup-details-bg.png"}>
        <NovelTHead title="Number Verification" />
        <NumberVerificationForm />
      </AuthenticationLayout>
      <BackgroundGradients variant={4} />
    </>
  );
};
