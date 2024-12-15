import { userResetPassword, userSetPassword } from "@/api/handler/auth";
import { useBreakpoint } from "@/hooks";
import userStore from "@/stores/userStore";
import { IDefaultRequest, IUserStore, UserType } from "@/types/user";
import { errorNotification, successNotification } from "@/utils";
import { Button, Flex, PasswordInput, TextInput, rem } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { KeyboardEvent } from "react";

import { AuthenticationLayout, NovelTHead, BackgroundGradients } from "@/components";

interface IResetPasswordProps {
  variant: UserType;
  type: "set" | "reset";
}

export const ResetPasswordModule = ({ variant, type }: IResetPasswordProps) => {
  const isAttendee = variant === UserType.Attendee;
  const isOrganizer = variant === UserType.Organizer;
  const isAdmin = variant === UserType.Admin;
  const isPromoter = variant === UserType.Promoter;

  const { isMobile } = useBreakpoint();

  const router = useRouter();
  const { token, email, organization } = router.query;
  const currentUser = userStore((state: IUserStore) => state.currentUser);
  const userToken = currentUser?.token;

  userToken && router.push("/");

  const redirectToLogin = () => {
    if (isAttendee) {
      router.push("/auth/login");
    } else if (isOrganizer) {
      router.push(`/organization/auth/login`);
    } else if (isAdmin) {
      router.push(`/admin/auth/login`);
    } else if (isPromoter) {
      router.push(`/promoter/auth/login`);
    } else {
      router.push(`/operator/auth/login`);
    }
  };

  if (router.isReady && (!token || !email)) {
    redirectToLogin();
  }

  const resetPasswordForm = useForm({
    initialValues: {
      new_password: "",
      new_password_confirmation: "",
    },

    validate: {
      new_password: (value) =>
        value.length >= 8 ? null : "Password should be longer than 8 characters",
      new_password_confirmation: (value, values) =>
        value !== values.new_password
          ? "The password you have chosen does not match, please try again."
          : null,
    },
  });

  const { mutate: handleResetPassword, isLoading: resetPasswordLoading } = useMutation(
    ({ new_password }: { new_password: string }) =>
      type == "set"
        ? userSetPassword(
            token as string,
            new_password,
            variant === UserType.Admin
              ? "admin"
              : variant === UserType.Promoter
              ? "promoter"
              : "organization",
            variant === UserType.Operator ? "operator" : "owner"
          )
        : userResetPassword(
            token as string,
            new_password,
            variant === UserType.Attendee ? "attendee" : "organization"
          ),
    {
      onSuccess: () => {
        successNotification({
          title: "Success!",
          message:
            type === "set"
              ? "Your password has been set. Please login with your credentials to continue."
              : "Your password has been successfully reset.",
        });
        redirectToLogin();
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

  const layoutBackground: { [key in UserType]?: string } = {
    [UserType.Attendee]: "/img/reset-password-bg.png",
    [UserType.Organizer]: "/img/login-organizer-bg.png",
    [UserType.Operator]: "/img/operator-bg.png",
    [UserType.Admin]: "/img/admin-set-password-bg.png",
    [UserType.Promoter]: "/img/reset-password-promoter-bg.png",
  };

  return (
    <>
      <AuthenticationLayout
        title={type === "set" ? "Set your password" : "Reset Password"}
        image={layoutBackground[variant] as string}
      >
        <NovelTHead title="Reset Password" />
        <form
          onSubmit={resetPasswordForm.onSubmit((values) => handleResetPassword(values))}
          onKeyDown={(e) => checkKeyDown(e)}
        >
          <Flex direction={"column"} mt={isMobile ? rem(60) : rem(120)} px={isMobile ? 0 : rem(24)}>
            {variant === UserType.Operator && (
              <TextInput
                label="Organization "
                value={organization}
                size="sm"
                mb={25}
                placeholder="hello@gmail.com"
                disabled
                styles={{
                  input: {
                    border: 0,
                    "&[data-disabled]": {
                      backgroundColor: "#282B3D",
                      color: "#FFFFFFB2",
                      opacity: 1,
                    },
                  },
                }}
              />
            )}
            <TextInput
              label="Email"
              value={email}
              size="sm"
              mb={25}
              placeholder="hello@gmail.com"
              disabled
              styles={{
                input: {
                  border: 0,
                  "&[data-disabled]": {
                    backgroundColor: "#282B3D",
                    color: "#FFFFFFB2",
                    opacity: 1,
                  },
                },
              }}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              size="sm"
              styles={{
                visibilityToggle: {
                  strokeWidth: "1px",
                  color: "#5C5F65",
                },
              }}
              required
              mb={25}
              {...resetPasswordForm.getInputProps("new_password")}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Your password repeated"
              size="sm"
              styles={{
                visibilityToggle: {
                  strokeWidth: "1px",
                  color: "#5C5F65",
                },
              }}
              required
              {...resetPasswordForm.getInputProps("new_password_confirmation")}
            />
            <Button
              fullWidth
              mt="xl"
              size="md"
              fw={400}
              sx={{
                fontSize: 15,
                "&[data-disabled]": { backgroundColor: "#FFFFFF4D", color: "#9DA1A4" },
              }}
              variant="gradient"
              gradient={{ from: "#3077F3", to: "#15AABF" }}
              type="submit"
              disabled={!resetPasswordForm.isDirty()}
              loading={resetPasswordLoading}
            >
              {type === "reset" && "Change Password"}
              {type === "set" && variant === UserType.Admin && "Log In as an Admin"}
              {type === "set" && variant === UserType.Organizer && "Log In as an Organizer"}
              {type === "set" && variant === UserType.Operator && "Log In as an Operator"}
              {type === "set" && variant === UserType.Promoter && "Log In as a Promoter"}
            </Button>
          </Flex>
        </form>
      </AuthenticationLayout>
      <BackgroundGradients variant={2} />
    </>
  );
};
