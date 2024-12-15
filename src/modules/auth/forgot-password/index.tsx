import { userForgotPassword } from "@/api/handler/auth";
import { useBreakpoint } from "@/hooks";
import userStore from "@/stores/userStore";
import { IDefaultRequest, IUserStore } from "@/types/user";
import { emailRegex, errorNotification, successNotification } from "@/utils";
import { Button, Flex, TextInput, rem, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { KeyboardEvent } from "react";

import { AuthenticationLayout, BackgroundGradients, NovelTHead } from "@/components";

interface IResetPasswordProps {
  variant: "attendee" | "organizer" | "operator";
}

export const ForgotPasswordModule = ({ variant }: IResetPasswordProps) => {
  const isAttendee = variant === "attendee";
  const isOrganizer = variant === "organizer";

  const { isMobile } = useBreakpoint();

  const router = useRouter();
  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const token = currentUser?.token;

  token && router.push("/");

  const resetPasswordForm = useForm({
    initialValues: {
      email: "",
    },

    validate: {
      email: (value) => (emailRegex.test(value) ? null : "Invalid email"),
    },
  });

  const { mutate: handleResetPassword, isLoading: resetPasswordLoading } = useMutation(
    ({ email }: { email: string }) =>
      userForgotPassword(email, variant === "attendee" ? "attendee" : "organization"),
    {
      onSuccess: () => {
        successNotification({
          title: "Success!",
          message:
            "A link has been sent to the email address you provided. Click the link in your email to reset your password.",
        });
        if (isAttendee) {
          router.push("/auth/login");
        } else if (isOrganizer) {
          router.push("/organization/auth/login");
        } else {
          router.push("/operator/auth/login");
        }
      },
      onError: (e: AxiosError<IDefaultRequest>) => {
        if (e?.response?.status === 401) {
          resetPasswordForm.setFieldError("email", e?.response?.data?.message);
        } else {
          resetPasswordForm.setFieldError("email", e?.response?.data?.message);
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
      resetPasswordForm.validate();
      if (resetPasswordForm.isValid()) {
        handleResetPassword(resetPasswordForm.values);
      }
    }
  };

  return (
    <>
      <AuthenticationLayout
        title={<Text>Reset Password</Text>}
        description={
          <Text mt={!isMobile ? rem(28) : undefined} fw={400} size={rem(14)} c={"#FFFFFFCC"}>
            Please enter the email you use for your account.
          </Text>
        }
        image={
          isAttendee
            ? "/img/reset-password-bg.png"
            : isOrganizer
            ? "/img/login-organizer-bg.png"
            : "/img/operator-bg.png"
        }
      >
        <NovelTHead title="Reset Password" />
        <form
          onSubmit={resetPasswordForm.onSubmit((values) => handleResetPassword(values))}
          onKeyDown={(e) => checkKeyDown(e)}
        >
          <Flex
            direction={"column"}
            mt={isMobile ? rem(75) : rem(100)}
            px={isMobile ? 0 : rem(27)}
            pos={"relative"}
            sx={{ zIndex: 1 }}
          >
            <TextInput
              label="Email"
              placeholder="hello@gmail.com"
              size="sm"
              styles={{
                input: {
                  backgroundColor: "#282B3D",
                  border: "0",
                },
              }}
              required
              {...resetPasswordForm.getInputProps("email")}
            />
            <Button
              fullWidth
              mt="xl"
              size="md"
              fw={400}
              sx={{ fontSize: 15 }}
              variant="gradient"
              gradient={{ from: "#3077F3", to: "#15AABF" }}
              type="submit"
              disabled={!resetPasswordForm.isDirty()}
              loading={resetPasswordLoading}
            >
              Reset Password
            </Button>
            <Link
              href={
                isAttendee
                  ? "/auth/login"
                  : isOrganizer
                  ? "/organization/auth/login"
                  : "/operator/auth/login/"
              }
              style={{ textDecoration: "none" }}
            >
              <Button fullWidth mt="xl" size="md" fw={400} sx={{ fontSize: 15 }} variant="outline">
                Back to login Page
              </Button>
            </Link>
          </Flex>
        </form>
        <BackgroundGradients variant={2} />
      </AuthenticationLayout>
    </>
  );
};
