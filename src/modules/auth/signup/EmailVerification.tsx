import {
  getAttendeeAccount,
  requestVerificationEmail,
  updateAttendeeAccount,
} from "@/api/handler/attendee";
import { createWebsocketConnection } from "@/helpers/createSocketConnection";
import userStore from "@/stores/userStore";
import { IAttendee, IUserStore, UserType } from "@/types";
import { isHttpError } from "@/types/http";
import { emailRegex, errorNotification, successNotification } from "@/utils";
import { attendeeAccountKey } from "@/utils/queryKeys";
import {
  Anchor,
  Center,
  Flex,
  Group,
  Loader,
  RingProgress,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Transition,
  rem,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { AuthenticationLayout, BackgroundGradients, NovelTHead } from "@/components";

export const EmailVerificationForm = () => {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [editingEmail, setEditingEmail] = useState<boolean>(false);
  const [resendEmailCounter, setResendEmailCounter] = useState<number>(0);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [emailConfirmed, setEmailConfirmed] = useState<string | null>(null);

  const setUser = userStore((state: IUserStore) => state.setUser);
  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const token = currentUser?.token;
  const queryClient = useQueryClient();

  const {
    data: myAccount,
    isSuccess,
    error,
  } = useQuery([attendeeAccountKey], () => getAttendeeAccount().then((res) => res.data), {
    initialData: queryClient.getQueryData([attendeeAccountKey]),
  });

  useEffect(() => {
    if (!currentUser) return;
    if (isSuccess) {
      setUser({
        expiry: currentUser?.expiry as number,
        token: currentUser?.token,
        refreshToken: currentUser?.refreshToken,
        apiTokenExpiry: currentUser?.apiTokenExpiry,
        role: currentUser?.role,
        data: { ...currentUser?.data, ...myAccount },
      });
      setEmailAddress(myAccount.email);
    }
  }, [myAccount, isSuccess]);

  useEffect(() => {
    if (isHttpError(error)) {
      errorNotification(error);
    }
  }, [error]);

  useEffect(() => {
    const timer =
      resendEmailCounter > 0
        ? setInterval(() => setResendEmailCounter(resendEmailCounter - 1), 1000)
        : undefined;

    return () => clearInterval(timer);
  }, [resendEmailCounter]);

  const { mutate: resendEmail } = useMutation((email: string) => requestVerificationEmail(email), {
    onSuccess: () => {
      successNotification({
        title: "Email Confirmation Sent",
        message:
          "A confirmation link has been sent to your email. Please make sure to check your spam folder as well.",
      });
      setResendEmailCounter(120);
    },
    onError: () => {
      errorNotification({
        title: "Something went wrong contacting the server!",
        message: "Please visit another time or contact support.",
      });
    },
  });

  const handleResendEmail = () => {
    if (resendEmailCounter === 0) {
      resendEmail(emailAddress);
    } else {
      errorNotification({
        title: `Please wait ${resendEmailCounter} before another request.`,
      });
    }
  };

  const { mutate: updateMyAccount } = useMutation(
    ({ data }: { data: Partial<IAttendee>; type: "account" | "email" }) =>
      updateAttendeeAccount(data).then((res) => res.data),
    {
      onSuccess: (data, { type }) => {
        if (type === "email") {
          successNotification({
            title: "Your Email Has Been Updated",
            message:
              "A confirmation link has been sent to your email. Please make sure to check your spam folder as well.",
          });

          setResendEmailCounter(0);
          setEditingEmail(false);
        } else {
          successNotification({ title: "Your Account Has Been Updated." });
        }

        queryClient.setQueryData([attendeeAccountKey], data);
        if (!currentUser) return;
        setUser({
          token: currentUser?.token,
          refreshToken: currentUser?.refreshToken,
          apiTokenExpiry: currentUser?.apiTokenExpiry,
          expiry: currentUser?.expiry as number,
          role: currentUser?.role,
          data: { ...currentUser?.data, ...data },
        });
      },
      onError: (error) => {
        if (isHttpError(error)) {
          errorNotification(error);
        }
      },
    }
  );

  const handleUpdateEmail = () => {
    if (emailRegex.test(emailAddress)) {
      updateMyAccount({
        data: { email: emailAddress },
        type: "email",
      });
    } else {
      errorNotification({
        title: "Error!",
        message: "Please provide a valid email address.",
      });
    }
  };

  useEffect(() => {
    createWebsocketConnection(
      {
        token: token as string,
        channel: "VerifyEmailChannel",
      },
      (message) => {
        if (message.email_confirmed_at) {
          setEmailVerified(true);
          setEmailConfirmed(message.email_confirmed_at as string);
          setTimeout(() => {
            router.push("/checkout/pay");
          }, 3000);
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

  return (
    <Flex direction={"column"} mt={rem(36)}>
      <Group position="center">
        <>
          {editingEmail ? (
            <Stack spacing={rem(2)} align="flex-start" w={"100%"}>
              <TextInput
                w="100%"
                label="Email"
                placeholder="Your email"
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleUpdateEmail();
                  }
                }}
              />

              <Anchor
                component="button"
                type="button"
                c="blue"
                size="xs"
                onClick={handleUpdateEmail}
              >
                Update Email Address
              </Anchor>
            </Stack>
          ) : (
            <Stack spacing={rem(2)} align="flex-start" w={"100%"}>
              <TextInput
                w="100%"
                label="Email"
                placeholder="Your email"
                value={emailAddress}
                variant="filled"
                readOnly
              />
              <Flex w="100%" justify="space-between">
                <Anchor
                  component="button"
                  type="button"
                  c="red"
                  size="xs"
                  onClick={handleResendEmail}
                >
                  {resendEmailCounter === 0
                    ? "Resend Confirmation Link"
                    : `${resendEmailCounter} seconds until another try`}
                </Anchor>
                <Anchor
                  component="button"
                  type="button"
                  c="blue"
                  size="xs"
                  onClick={() => setEditingEmail(true)}
                >
                  Change Email Address
                </Anchor>
              </Flex>
            </Stack>
          )}
        </>
      </Group>
      <Flex direction={"column"} w={"100%"} align={"center"} mt={60}>
        <Transition
          mounted={!emailVerified}
          transition="scale"
          duration={400}
          timingFunction="ease"
        >
          {(styles) => (
            <Flex style={styles} direction={"column"} w={"100%"} align={"center"}>
              <Loader size={72} />
              <Text fw={400} size={rem(14)} color="rgba(255, 255, 255, 0.80)" my={rem(8)}>
                Awaiting email confirmation…
              </Text>
              <Text fw={400} size={rem(14)} color="rgba(255, 255, 255, 0.80)">
                Please do not close this page. You will be automatically redirected to the payment
                page once you have confirmed your email address.
              </Text>
            </Flex>
          )}
        </Transition>
        <Transition mounted={emailVerified} transition="scale" duration={400} timingFunction="ease">
          {(styles) => (
            <RingProgress
              sections={[{ value: 100, color: "teal" }]}
              style={{ ...styles, position: "absolute" }}
              label={
                <Center mih={rem(135)}>
                  <ThemeIcon color="teal" variant="light" radius="xl" size="xl">
                    <IconCheck size={22} />
                  </ThemeIcon>
                </Center>
              }
            />
          )}
        </Transition>
      </Flex>
    </Flex>
  );
};

export const EmailVerificationModule = () => {
  return (
    <>
      <AuthenticationLayout image={"/img/signup-details-bg.png"}>
        <NovelTHead title="Email Verification" />
        <EmailVerificationForm />
      </AuthenticationLayout>
      <BackgroundGradients variant={4} />
    </>
  );
};
