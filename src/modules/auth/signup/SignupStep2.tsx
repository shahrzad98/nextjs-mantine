import { updateAttendeeAccount } from "@/api/handler";
import { createWebsocketConnection } from "@/helpers/createSocketConnection";
import { useBreakpoint } from "@/hooks";
import userStore from "@/stores/userStore";
import { CustomErrorResponse } from "@/types/http";
import { IAttendeeAccountRequest, ICurrentUser, IUserStore, UserType } from "@/types/user";
import { errorNotification, successNotification } from "@/utils";
import { Box, Button, Flex, TextInput, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { KeyboardEvent, useEffect, useState } from "react";

import { AuthenticationLayout, BackgroundGradients, NovelTHead } from "@/components";

export const SignupStep2Form = ({ isCheckout = false }: { isCheckout?: boolean }) => {
  const router = useRouter();
  const { isMobile } = useBreakpoint();

  const [emailConfirmed, setEmailConfirmed] = useState<string | null>(null);
  // const [countryCode, setCountryCode] = useState<string>("1");

  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const setUser = userStore((state: IUserStore) => state.setUser);
  const token = currentUser?.token;

  const setupForm = useForm({
    initialValues: {
      first_name: currentUser?.data?.first_name || "",
      last_name: currentUser?.data?.last_name || "",
      // mobile: currentUser?.data?.mobile || "",
    },

    validate: {
      first_name: (value) =>
        value.replace(/\s/g, "").length === 0
          ? "First Name is required!"
          : !/^[^#%@&*:<>?/{|}]+$/.test(value)
          ? "First Name should not contain any special characters!"
          : null,
      last_name: (value) =>
        value.replace(/\s/g, "").length === 0
          ? "Last Name is required!"
          : !/^[^#%@&*:<>?/{|}]+$/.test(value)
          ? "Last Name should not contain any special characters!"
          : null,
      // mobile: (value) =>
      //   !value
      //     ? "Phone Number is required!"
      //     : /^\d{10}$/.test(value)
      //     ? null
      //     : "Invalid Phone Number!",
    },
  });

  const { mutate: handleSetup, isLoading: setupLoading } = useMutation(
    (values: IAttendeeAccountRequest) =>
      updateAttendeeAccount({
        ...values,
        // mobile: `${countryCode}-${values.mobile}`
      }),
    {
      onSuccess: ({ data }) => {
        // successNotification({
        //   title: "Success!",
        //   message: "A 6 digit verification code has been sent to your mobile device.",
        // });

        // setUser({
        //   ...(currentUser as ICurrentUser),
        //   data: {
        //     ...currentUser?.data,
        //     first_name: setupForm.values.first_name,
        //     last_name: setupForm.values.last_name,
        //     mobile: setupForm.values.mobile,
        //   },
        // });

        // router.push(
        //   {
        //     pathname: isCheckout
        //       ? "/checkout/auth/phone-verification"
        //       : "/auth/onboarding/phone-verification",
        //     query: setupForm.values,
        //   },
        //   isCheckout ? "/checkout/auth/phone-verification" : "/auth/onboarding/phone-verification"
        // );

        successNotification({
          title: "Success!",
          message: "Your registration has been completed!",
        });

        setUser({
          ...(currentUser as ICurrentUser),
          data,
        });
        if (isCheckout) {
          if (currentUser?.data?.email_confirmed_at) {
            router.push("/checkout/pay");
          } else {
            router.push("/checkout/auth/email-verification");
          }
        } else {
          router.push("/");
        }
      },
      onError: (e: AxiosError<CustomErrorResponse>) => {
        if (e?.response?.status === 401) {
          // setupForm.setFieldError("mobile", e?.response?.data?.message);
          setupForm.setFieldError("first_name", " ");
          setupForm.setFieldError("last_name", " ");
        } else {
          errorNotification(e);
        }
      },
    }
  );

  useEffect(() => {
    createWebsocketConnection(
      {
        token: token as string,
        channel: "VerifyEmailChannel",
      },
      (message) => {
        if (message.email_confirmed_at) {
          setEmailConfirmed(message.email_confirmed_at as string);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (emailConfirmed) {
      setUser({
        token: currentUser?.token as string,
        refreshToken: currentUser?.refreshToken as string,
        apiTokenExpiry: currentUser?.apiTokenExpiry as string,
        expiry: currentUser?.expiry as number,
        role: currentUser?.role as UserType,
        data: {
          ...currentUser?.data,
          email_confirmed_at: emailConfirmed as string,
        },
      });
    }
  }, [emailConfirmed]);

  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setupForm.validate();
      if (setupForm.isValid()) {
        handleSetup(setupForm.values);
      }
    }
  };

  return (
    <form
      onSubmit={setupForm.onSubmit((values) => handleSetup(values))}
      onKeyDown={(e) => checkKeyDown(e)}
    >
      <Flex direction={"column"} mt={rem(55)} px={isMobile ? 0 : rem(27)}>
        <TextInput
          label="First Name"
          placeholder="Your First Name"
          size="sm"
          required
          mb={rem(25)}
          {...setupForm.getInputProps("first_name")}
        />
        <TextInput
          label="Last Name"
          placeholder="Your Last Name"
          size="sm"
          required
          mb={rem(25)}
          {...setupForm.getInputProps("last_name")}
        />
        {/* <PhoneNumberInput
          label="Phone Number"
          placeholder="(506) 234-5678"
          inputProps={{ ...setupForm.getInputProps("mobile") }}
          setCountryCode={setCountryCode}
        /> */}
        <Box ta={"center"}>
          <Button
            fullWidth={isMobile}
            mt={rem(56)}
            size="md"
            fw={400}
            sx={{
              fontSize: 15,
              "&[data-disabled]": { backgroundColor: "#FFFFFF4D", color: "#9DA1A4" },
            }}
            type="submit"
            variant="gradient"
            gradient={{ from: "#3077F3", to: "#15AABF" }}
            disabled={!setupForm.isDirty()}
            loading={setupLoading}
          >
            Continue
          </Button>
        </Box>
      </Flex>
    </form>
  );
};

export const SignupStep2Module = () => {
  return (
    <>
      <AuthenticationLayout image={"/img/signup-details-bg.png"}>
        <NovelTHead title="Sign Up | Step 2" />
        <SignupStep2Form />
      </AuthenticationLayout>
      <BackgroundGradients variant={4} />
    </>
  );
};
